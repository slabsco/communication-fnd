'use client';

import { Check, CheckCheck, Contact } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Message } from 'react-hook-form';
import InfiniteScroll from 'react-infinite-scroll-component';

import { FetchData, replaceVariablesInString } from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Avatar,
    Button,
    cn,
    FormatDisplayDateStyled,
    InputField,
    Loading,
} from '@finnoto/design-system';

import { useQuery } from '@tanstack/react-query';

import ArcGenericSplitDetailComponent from '../../Components/ArcGenericSplitDetail/arcGenericSplitDetail.component';
import { MessageSectionPreview } from '../broadcast/your-templates/components/YourTemplatesPriview.component';

const TeamInboxModule = () => {
    return (
        <ArcGenericSplitDetailComponent
            defaultActiveTab='all'
            definitionKey=''
            title='Team Inbox'
            type='teamInbox'
            breadcrumbKey='contact.name'
            renderCardItem={(item, activeId) => {
                return <Card data={item} isActive={activeId === item?.id} />;
            }}
            renderDetailSection={({ data, isLoading }: any) => {
                return <DetailSection data={data} isLoading={isLoading} />;
            }}
        />
    );
};

export default TeamInboxModule;

const Card = ({ data, isActive }: { data: any; isActive: boolean }) => {
    return (
        <div
            className={cn(
                'flex gap-3 items-start p-2 rounded border transition-all cursor-pointer hover:shadow',
                {
                    'bg-secondary text-secondary-content': isActive,
                }
            )}
        >
            <Avatar color='primary' size='sm' shape='circle' alt='M' />

            <div className='flex-1'>
                <div className='flex gap-2 items-center'>
                    <span className='font-medium'>{data?.contact_name}</span>
                    {/* <span className='text-sm text-gray-500'>Bot</span> */}
                </div>
                <div className='mt-0'>
                    <span className='text-sm'>
                        {FormatDisplayDateStyled({ value: data?.updated_at })}
                    </span>
                </div>
            </div>
        </div>
    );
};

const DetailSection = ({
    data,
    isLoading,
}: {
    data: any;
    isLoading?: boolean;
}) => {
    return (
        <div className='grid overflow-hidden grid-cols-3 gap-2 items-center h-full'>
            <div className='overflow-y-auto col-span-2 h-full rounded border bg-polaris-bg-surface'>
                {isLoading && (
                    <div className='flex justify-center items-center h-full'>
                        <Loading color='primary' size='xl' />
                    </div>
                )}
                {!isLoading && (
                    <div className='relative gap-1 p-2 h-full col-flex'>
                        <div className='overflow-y-auto flex-1 border'>
                            <RenderMessageDetail data={data} />
                        </div>
                        <div className='flex sticky right-0 bottom-0 left-0 gap-2 items-center'>
                            <InputField
                                placeholder={'Enter Message Here'}
                                className='w-full'
                                size='sm'
                            />
                            <Button>Send</Button>
                        </div>
                    </div>
                )}
            </div>
            <RightSection data={data} isLoading={isLoading} />
        </div>
    );
};

const RightSection = ({
    data,
    isLoading,
}: {
    data: any;
    isLoading?: boolean;
}) => {
    return (
        <div className='col-span-1 h-full rounded border bg-polaris-bg-surface'>
            {isLoading && (
                <div className='flex justify-center items-center h-full'>
                    <Loading color='primary' size='xl' />
                </div>
            )}
            {!isLoading && (
                <div className='p-4 space-y-4'>
                    {/* Header with Avatar */}
                    <div className='flex gap-3 items-center'>
                        <Avatar
                            color='primary'
                            size='sm'
                            shape='circle'
                            alt={data.contact?.name}
                        />
                        <span className='font-medium'>
                            {data.contact?.name}
                        </span>
                    </div>

                    {/* Contact Info Section */}
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center p-1 text-base-content bg-base-300'>
                            <h3 className='flex gap-2 items-center font-medium'>
                                <Contact size={18} />
                                Contact info
                            </h3>
                        </div>

                        {/* Contact Details */}
                        <div className='space-y-4'>
                            <div>
                                <label className='text-sm text-gray-500'>
                                    Phone Number
                                </label>
                                <div className='flex gap-2 items-center'>
                                    <span className='i-flag-india' />
                                    <span>
                                        (+{data?.contact?.dialing_code}){' '}
                                        {data?.contact?.mobile}
                                    </span>
                                    {/* <button className='text-gray-400'>
                                        <span className='i-copy' />
                                    </button> */}
                                </div>
                            </div>
                            <div>
                                <label className='text-sm text-gray-500'>
                                    User Name
                                </label>
                                <div>{data?.contact?.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Attributes Section */}
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center p-1 text-base-content bg-base-300'>
                            <h3 className='flex gap-2 items-center font-medium'>
                                <Contact size={18} />
                                Contact Attributes
                            </h3>
                        </div>

                        {/* Attributes List */}
                        <div className='space-y-2 p-2 max-h-[300px] overflow-y-auto border rounded'>
                            {data?.contact?.custom_attributes?.map((val) => {
                                return (
                                    <div
                                        className='gap-0 col-flex'
                                        key={val?.key}
                                    >
                                        <label className='text-sm text-gray-500'>
                                            {val?.key}
                                        </label>
                                        <div>{val?.value}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RenderMessageDetail = ({ data }: { data: { id: string } }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        total: 10,
        page: 1,
    });

    const { isFetching } = useQuery({
        refetchInterval: 5000,
        queryKey: ['messages', data?.id, pagination.page],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: TeamInboxController,
                method: 'messages',
                methodParams: data?.id,
                classParams: pagination,
            });

            if (!success) throw new Error('Failed to fetch messages');
            return response;
        },
        onSuccess: (response) => {
            setMessages((prev) => response?.records);
            setPagination((prev) => ({
                ...prev,
                total: response.stats.total,
            }));
        },
    });

    const handleLoadMore = useCallback(() => {
        if (!isFetching) {
            setPagination((prev) => ({
                ...prev,
                page: prev.page + 1,
            }));
        }
    }, [isFetching]);

    return (
        <InfiniteScroll
            dataLength={messages.length}
            next={handleLoadMore}
            hasMore={messages.length < pagination.total}
            loader={<Loading color='primary' size='xl' />}
            scrollableTarget='message-container'
            className='h-full'
            scrollThreshold={0.8}
        >
            <div className='p-4 space-y-4'>
                {messages.map((message) => (
                    <MessageItem key={message} message={message} />
                ))}
            </div>
        </InfiniteScroll>
    );
};

const getData = (components: any[], type: string) => {
    if (!components?.length) return [];
    return components?.find((val) => val?.type === type)?.parameters || [];
};
// Add a new MessageItem component to render individual messages
const MessageItem = ({ message }: { message: any }) => {
    const component = message?.payload?.template?.components;

    const header = getData(component, 'header');
    const footer = getData(component, 'footer');
    const body = getData(component, 'body');

    const sampleContent = useMemo(() => {
        const content = {};

        const allData = [...header, ...footer, ...body];

        allData?.forEach((element) => {
            content[element?.parameter_name] = element?.text;
        });

        return content;
    }, []);

    const repliedContent = useMemo(() => {
        const content = {};

        getData(message?.parent_payload?.template?.components, 'body')?.forEach(
            (element) => {
                content[element?.parameter_name] = element?.text;
            }
        );

        return content;
    }, []);

    return (
        <div
            className={cn('w-fit col-flex gap-2', {
                'mr-auto ': message.is_replied,
            })}
        >
            {component ? (
                <div className='flex flex-row-reverse gap-2 items-end'>
                    <MessageSectionPreview
                        sampleContent={sampleContent}
                        configuration={message?.template_button_configurations}
                        title={message?.template_title}
                        footer={message?.template_footer}
                        body={message?.template_body}
                        className='max-w-[50%] bg-green-200'
                        showTime={false}
                    />
                    <div className='flex gap-1'>
                        {FormatDisplayDateStyled({
                            value: message?.created_at,
                            size: 'xs',
                            className: 'text-base-secondary',
                        })}
                        <div className='flex items-center'>
                            {message?.read_at ? (
                                <CheckCheck size={10} color='green' />
                            ) : message?.delivered_at ? (
                                <CheckCheck size={10} />
                            ) : message?.sent_at ? (
                                <Check size={10} />
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : (
                !message?.is_replied && (
                    <div className='flex flex-row-reverse gap-2 items-end'>
                        <div className='max-w-[50%] bg-green-200'>
                            Something
                        </div>
                        {FormatDisplayDateStyled({
                            value: message?.created_at,
                            size: 'xs',
                            className: 'text-base-secondary',
                        })}
                    </div>
                )
            )}

            {message?.is_replied && (
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

                        <span>
                            {message?.payload?.button?.text ||
                                message?.payload?.text?.body}
                        </span>
                    </div>
                    {FormatDisplayDateStyled({
                        value: message?.created_at,
                        size: 'xs',
                        className: 'text-base-secondary',
                    })}
                </div>
            )}
        </div>
    );
};
