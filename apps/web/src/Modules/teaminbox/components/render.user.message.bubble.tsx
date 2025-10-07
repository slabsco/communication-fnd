import axios from 'axios';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

import {
    ACCESS_TOKEN,
    BUSINESS_API_URL,
    Ellipsis,
    GetItem,
    IsUndefinedOrNull,
    replaceVariablesInString,
} from '@finnoto/core';
import {
    FormatDisplayDateStyled,
    IconButton,
    Loading,
} from '@finnoto/design-system';

import { useQuery } from '@tanstack/react-query';

import { FileDownloadSvgIcon } from 'assets';

const getData = (components: any[], type: string) => {
    if (!components?.length) return [];
    return components?.find((val) => val?.type === type)?.parameters || [];
};

export const RenderUserMessageBubble = ({ message }) => {
    const payload = message?.payload;
    const identifierPayload =
        payload?.image ||
        payload?.document ||
        payload?.video ||
        payload?.audio ||
        payload?.sticker;

    const { data, isLoading } = useQuery({
        queryKey: ['document', identifierPayload?.id],
        enabled: !IsUndefinedOrNull(identifierPayload?.id),
        cacheTime: Infinity,
        queryFn: async () => {
            const baseurl = GetItem(BUSINESS_API_URL, true);

            const response = await axios.get(
                `${baseurl}api/b/team-inbox/${identifierPayload?.id}/get-document`,
                {
                    headers: {
                        Authorization: `Bearer ${GetItem(ACCESS_TOKEN, false)}`,
                    },
                    responseType: 'blob', // Changed from 'stream' to 'blob'
                }
            );

            if (response.status === 200) {
                const blob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });
                return URL.createObjectURL(blob);
            }

            return null;
        },
    });

    const repliedContent = useMemo(() => {
        const content = {};

        getData(message?.parent_payload?.template?.components, 'body')?.forEach(
            (element) => {
                content[element?.parameter_name] = element?.text;
            }
        );

        return content;
    }, [message?.parent_payload?.template?.components]);

    const renderComponent = () => {
        if (payload?.image?.id) {
            return (
                <div className='gap-1 col-flex'>
                    <div className='flex flex-col gap-2'>
                        <div className='h-[300px] w-[300px] flex items-center justify-center overflow-hidden'>
                            {isLoading ? (
                                <Loading
                                    size='xl'
                                    color='primary'
                                    type='balls'
                                />
                            ) : (
                                <Image
                                    alt='Image'
                                    src={data}
                                    height={300}
                                    width={300}
                                    className='object-contain'
                                />
                            )}
                        </div>

                        <span className='text-sm text-primary-950'>
                            {payload?.image?.caption}
                        </span>
                    </div>
                </div>
            );
        }
        if (payload?.video?.id) {
            return (
                <div className='gap-1 col-flex'>
                    <div className='flex flex-col gap-2'>
                        <div className='h-[300px] w-[300px] flex items-center justify-center overflow-hidden'>
                            {isLoading ? (
                                <Loading
                                    size='xl'
                                    color='primary'
                                    type='balls'
                                />
                            ) : (
                                <video
                                    autoPlay={false}
                                    controls
                                    src={data}
                                    height={300}
                                    width={300}
                                    className='w-full h-full'
                                />
                            )}
                        </div>

                        <span className='text-sm text-primary-950'>
                            {payload?.video?.caption}
                        </span>
                    </div>
                </div>
            );
        }
        if (payload?.audio?.id) {
            return (
                <div className='gap-1 col-flex'>
                    <div className='flex flex-col gap-2'>
                        <div className='h-[80px] w-[300px] flex items-center justify-center overflow-hidden'>
                            {isLoading ? (
                                <Loading
                                    size='xl'
                                    color='primary'
                                    type='balls'
                                />
                            ) : (
                                <audio controls src={data} className='w-full' />
                            )}
                        </div>

                        <span className='text-sm text-primary-950'>
                            {payload?.audio?.caption}
                        </span>
                    </div>
                </div>
            );
        }
        if (payload?.sticker?.id) {
            return (
                <div className='gap-1 col-flex'>
                    <div className='flex flex-col gap-2'>
                        <div className='h-[200px] w-[200px] flex items-center justify-center overflow-hidden'>
                            {isLoading ? (
                                <Loading
                                    size='xl'
                                    color='primary'
                                    type='balls'
                                />
                            ) : (
                                <Image
                                    alt='Image'
                                    src={data}
                                    height={300}
                                    width={300}
                                    className='object-contain'
                                />
                            )}
                        </div>
                        <span className='text-sm text-primary-950'>
                            {payload?.sticker?.caption}
                        </span>
                    </div>
                </div>
            );
        }
        if (payload?.document?.id) {
            const isNotPdf = !(payload?.document?.filename as string).endsWith(
                '.pdf'
            );

            return (
                <div className='gap-1 col-flex'>
                    <div className='flex flex-col gap-2'>
                        {isNotPdf ? (
                            <div className='flex gap-2 items-center px-3 py-1 rounded bg-base-200'>
                                <FileIcon size={14} />
                                <span className='text-sm'>
                                    {Ellipsis({
                                        text: payload?.document?.filename,
                                    })}
                                </span>
                                <Link href={data || ''} target='_blank'>
                                    <IconButton
                                        icon={FileDownloadSvgIcon}
                                        size='xs'
                                        appearance='base'
                                    />
                                </Link>
                            </div>
                        ) : (
                            <div className='h-[300px] w-[300px] overflow-hidden flex items-center justify-center'>
                                <iframe src={data} width='100%' height='100%' />
                            </div>
                        )}

                        <span className='text-sm text-primary-950'>
                            {payload?.document?.caption}
                        </span>
                    </div>
                </div>
            );
        }

        if (message?.payload?.text?.body) {
            return (
                <span
                    className='text-sm whitespace-pre-line break-words'
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                    dangerouslySetInnerHTML={{
                        __html: convertWhatsAppToHtml(
                            message?.payload?.text?.body
                        ),
                    }}
                ></span>
            );
        }

        return (
            <span className='text-sm'>
                {message?.payload?.button?.text ||
                    message?.payload?.text?.body ||
                    message?.payload?.interactive?.button_reply?.title ||
                    message?.payload?.interactive?.list_reply?.title ||
                    'Unsupported Format'}
            </span>
        );
    };

    return (
        <div className='flex gap-2 items-end'>
            <div className='gap-2 items-start px-2 py-1 bg-gray-300 rounded max-w-[75%] col-flex'>
                {message?.template_parent_body && (
                    <div
                        className='h-[70px] overflow-hidden text-ellipsis whitespace-pre-line line-clamp-3 w-[200px] bg-primary/70 text-sm p-1 rounded text-primary-content'
                        dangerouslySetInnerHTML={{
                            __html: replaceVariablesInString(
                                message?.template_parent_body,
                                repliedContent
                            ),
                        }}
                    ></div>
                )}
                {message?.parent_payload?.interactive && (
                    <div
                        className='h-[25px] overflow-hidden text-ellipsis whitespace-pre-line line-clamp-3 w-[200px] bg-primary/70 text-sm px-2 py-1 rounded text-primary-content'
                        dangerouslySetInnerHTML={{
                            __html: message?.parent_payload?.interactive?.body
                                ?.text,
                        }}
                    ></div>
                )}
                {renderComponent()}
            </div>

            {FormatDisplayDateStyled({
                value: message?.created_at,
                size: 'xs',
                className: 'text-base-secondary',
                containerClass: 'text-[10px]',
            })}
        </div>
    );
};

function convertWhatsAppToHtml(input) {
    if (input == null) return '';

    // Helper: escape HTML
    const escapeHtml = (s) =>
        s
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    let text = String(input);

    // 1) Extract code blocks (triple backticks) and replace with placeholders
    const codeBlocks = [];
    text = text.replace(/```([\s\S]*?)```/g, (m, p1) => {
        const idx = codeBlocks.push(p1) - 1;
        return `@@CODEBLOCK_${idx}@@`;
    });

    // 2) Extract inline code (single backticks) and replace with placeholders
    const inlineCodes = [];
    text = text.replace(/`([^`\r\n]+?)`/g, (m, p1) => {
        const idx = inlineCodes.push(p1) - 1;
        return `@@INLINECODE_${idx}@@`;
    });

    // The 's' (dotAll) and 'g' flags are not available in ES2017 and below.
    // So, we need to avoid using 's' and use [\s\S] instead of '.' for multiline matching.

    // Bold+italic: *_text_*
    text = text
        .replace(/\*_([\s\S]+?)_\*/g, '<strong><em>$1</em></strong>')
        .replace(/_\*([\s\S]+?)\*_/g, '<strong><em>$1</em></strong>');

    // Strikethrough: ~text~
    text = text.replace(/~([\s\S]+?)~/g, '<del>$1</del>');

    // Bold: *text*
    // Avoid matching * surrounded by spaces
    text = text.replace(/\*(?!\s)([\s\S]+?)(?<!\s)\*/g, '<strong>$1</strong>');

    // Italic: _text_
    // Avoid matching _ surrounded by spaces
    text = text.replace(/_(?!\s)([\s\S]+?)(?<!\s)_/g, '<em>$1</em>');

    const protectedTags = ['strong', 'em', 'del', 'pre', 'code', 'br'];
    protectedTags.forEach((tag) => {
        const openRe = new RegExp(`<${tag}>`, 'g');
        const closeRe = new RegExp(`</${tag}>`, 'g');
        text = text.replace(openRe, `@@OPEN_${tag.toUpperCase()}@@`);
        text = text.replace(closeRe, `@@CLOSE_${tag.toUpperCase()}@@`);
    });

    text = escapeHtml(text);

    protectedTags.forEach((tag) => {
        text = text.replace(/@@OPEN_([A-Z]+)@@/g, (m, p1) => {
            if (p1.toLowerCase() === tag) return `<${tag}>`;
            return m;
        });
        text = text.replace(/@@CLOSE_([A-Z]+)@@/g, (m, p1) => {
            if (p1.toLowerCase() === tag) return `</${tag}>`;
            return m;
        });
    });

    text = text.replace(/@@INLINECODE_(\d+)@@/g, (m, idx) => {
        const code = escapeHtml(inlineCodes[Number(idx)]);
        return `<code>${code}</code>`;
    });

    text = text.replace(/@@CODEBLOCK_(\d+)@@/g, (m, idx) => {
        const cb = escapeHtml(codeBlocks[Number(idx)]);
        return `<pre><code>${cb}</code></pre>`;
    });

    text = text.replace(/\r\n/g, '\n').replace(/\n/g, '<br/>');

    return text;
}
