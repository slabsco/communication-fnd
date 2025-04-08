import axios from 'axios';
import { FileIcon, Link } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';

import {
    ACCESS_TOKEN,
    BUSINESS_API_URL,
    Ellipsis,
    FetchData,
    GetItem,
    IsUndefinedOrNull,
    replaceVariablesInString,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
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
    const identifierPayload = payload.image || payload.document;

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

    const setMessageRead = async (broadcastMessageid: number) => {
        const { success, response } = await FetchData({
            className: TeamInboxController,
            method: 'markAsRead',
            methodParams: broadcastMessageid,
        });
    };

    useEffect(() => {
        if (message?.read_at || !message?.is_replied) return;
        setMessageRead(message.id);
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

        return (
            <span>
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
            <div className='gap-2 items-start p-3 bg-gray-300 rounded col-flex'>
                {message?.template_parent_body && (
                    <div
                        className='h-[70px] overflow-hidden text-ellipsis whitespace-pre-line line-clamp-3 w-[200px] bg-primary/70 text-xs p-1 rounded text-primary-content'
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
                        className='h-[25px] overflow-hidden text-ellipsis whitespace-pre-line line-clamp-3 w-[200px] bg-primary/70 text-xs p-1 rounded text-primary-content'
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
