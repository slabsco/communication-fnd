import axios from 'axios';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
    ACCESS_TOKEN,
    BUSINESS_API_URL,
    Ellipsis,
    GetItem,
    IsEmptyObject,
    IsUndefinedOrNull,
    useQuery,
} from '@finnoto/core';
import { cn, IconButton } from '@finnoto/design-system';

import { FileDownloadSvgIcon } from 'assets';

export const RenderInnerTextMessage = ({ message }: any) => {
    const payload = message?.payload;

    const identifierPayload =
        payload?.image ||
        payload?.document ||
        payload?.video ||
        payload?.audio ||
        payload?.sticker;

    const { data, isLoading } = useQuery({
        queryKey: ['document', message?.id],
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

    const renderComponent = () => {
        if (!IsEmptyObject(payload?.image)) {
            return (
                <div className='flex flex-col gap-2'>
                    <Image
                        height={300}
                        width={300}
                        alt='image'
                        src={payload?.image.link || data}
                    />

                    <span
                        className='text-sm text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: convertWhatsappFormatToHtml(
                                payload?.image?.caption
                            ),
                        }}
                    ></span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.sticker)) {
            return (
                <div className='flex flex-col gap-2'>
                    <Image height={300} width={300} alt='image' src={data} />
                    <span
                        className='text-sm text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: convertWhatsappFormatToHtml(
                                payload?.image?.caption
                            ),
                        }}
                    ></span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.document)) {
            const isNotPdf = !(
                payload?.document?.link || payload?.document?.filename
            )?.endsWith('.pdf');
            return (
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
                        <iframe
                            src={payload?.document?.link || data}
                            width='100%'
                            height='100%'
                        />
                    )}

                    <span
                        className='text-sm text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: convertWhatsappFormatToHtml(
                                payload?.document?.caption
                            ),
                        }}
                    ></span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.video)) {
            return (
                <div className='flex flex-col gap-2'>
                    <video
                        src={payload?.video?.link || data}
                        width='100%'
                        height='100%'
                        controls
                    />

                    <span
                        className='text-sm text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: convertWhatsappFormatToHtml(
                                payload?.video?.caption
                            ),
                        }}
                    ></span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.audio)) {
            return (
                <div className='gap-1 col-flex'>
                    <div className='flex flex-col gap-2'>
                        <div className='h-[40px] w-[300px] flex items-center justify-center overflow-hidden'>
                            <audio
                                controls
                                src={payload?.audio?.link || data}
                                className='w-full'
                            />
                        </div>

                        <span
                            className='text-sm text-primary-950'
                            dangerouslySetInnerHTML={{
                                __html: convertWhatsappFormatToHtml(
                                    payload?.audio?.caption
                                ),
                            }}
                        ></span>
                    </div>
                </div>
            );
        }

        return (
            <div className='flex flex-col gap-2'>
                <span
                    className='text-sm whitespace-pre-line break-words text-primary-950'
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                    dangerouslySetInnerHTML={{
                        __html: convertWhatsappFormatToHtml(
                            payload?.text?.body
                        ),
                    }}
                ></span>
            </div>
        );
    };

    return (
        <div
            className={cn(
                'rounded-md px-2 py-1 shadow-md  self-end flex flex-col gap-1 text-black max-w-[50%] bg-green-200'
            )}
        >
            {renderComponent()}
        </div>
    );
};

export function convertWhatsappFormatToHtml(text: string): string {
    if (!text) return '';

    text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    text = text.replace(/~(.*?)~/g, '<del>$1</del>');
    text = text.replace(/\n/g, '<br/>');

    return text;
}
