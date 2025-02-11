'use client';

import { Check, CheckCheck, Contact, Info } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    IsEmptyArray,
    IsUndefinedOrNull,
    Navigation,
    ObjectDto,
    replaceVariablesInString,
    TEAM_INBOX_SPLIT_LIST,
    toastBackendError,
    useFormBuilder,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Avatar,
    Button,
    cn,
    FormatDisplayDateStyled,
    InputField,
    Loading,
    ModalBody,
    ModalContainer,
    ModalFooter,
    SlidingPane,
    Tooltip,
} from '@finnoto/design-system';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import ArcGenericSplitDetailComponent from '../../Components/ArcGenericSplitDetail/arcGenericSplitDetail.component';
import { openTemplateViewer } from '../broadcast/your-templates/components/TemplateViewer.component';
import { MessageSectionPreview } from '../broadcast/your-templates/components/YourTemplatesPriview.component';
import { openAddContactForm } from '../contact/add.contact.modal.form';

const TeamInboxModuleDetail = () => {
    return (
        <ArcGenericSplitDetailComponent
            defaultActiveTab='all'
            definitionKey=''
            title='Team Inbox'
            type='teamInbox'
            breadcrumbKey='contact.display_name'
            actions={[
                {
                    name: 'Action',
                    type: 'action_btn',
                    outline: true,
                    buttonActions: [
                        { name: 'Add Inbox', action: openAddInbox },
                    ],
                },
            ]}
            renderCardItem={(item, activeId) => {
                return <Card data={item} isActive={activeId === item?.id} />;
            }}
            renderDetailSection={({ data, isLoading }: any) => {
                return <DetailSection data={data} isLoading={isLoading} />;
            }}
        />
    );
};

export default TeamInboxModuleDetail;

export const navigateToTeamInboxDetail = (id: number) => {
    Navigation.navigate({
        url: `${TEAM_INBOX_SPLIT_LIST}/${id}`,
    });
};
const Card = ({ data, isActive }: { data: any; isActive: boolean }) => {
    return (
        <div
            onClick={() => navigateToTeamInboxDetail(data.id)}
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
    const queryClient = useQueryClient();
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        const { success, response } = await FetchData({
            className: TeamInboxController,
            method: 'sendMessage',
            methodParams: data?.id,
            classParams: {
                data: input,
            },
        });

        if (!success) return;
        setInput('');

        queryClient.invalidateQueries({
            queryKey: ['team_inbox_messages'],
        });
    };

    return (
        <div className='grid overflow-hidden grid-cols-3 gap-2 items-center h-full'>
            <div className='overflow-y-auto col-span-2 h-full rounded border bg-polaris-bg-surface'>
                {isLoading && (
                    <div className='flex justify-center items-center h-full'>
                        <Loading color='primary' size='xl' />
                    </div>
                )}
                {!isLoading && (
                    <form
                        className='relative gap-1 p-2 h-full col-flex'
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await sendMessage();
                        }}
                    >
                        <div className='overflow-hidden flex-1 border'>
                            <RenderMessageDetail data={data} />
                        </div>
                        <div className='flex sticky right-0 bottom-0 left-0 gap-2 items-center'>
                            <InputField
                                value={input}
                                onChange={setInput}
                                placeholder={'Enter Message Here'}
                                className='w-full'
                                size='sm'
                            />
                            <Button type='submit' disabled={input.length <= 0}>
                                Send
                            </Button>
                        </div>
                    </form>
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
                            alt={data.contact?.display_name}
                        />
                        <span className='font-medium'>
                            {data.contact?.display_name}
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

                    {!IsEmptyArray(data?.contact?.custom_attributes) && (
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center p-1 text-base-content bg-base-300'>
                                <h3 className='flex gap-2 items-center font-medium'>
                                    <Contact size={18} />
                                    Contact Attributes
                                </h3>
                            </div>

                            {/* Attributes List */}
                            <div className='space-y-2 p-2 max-h-[300px] overflow-y-auto border rounded'>
                                {data?.contact?.custom_attributes?.map(
                                    (val) => {
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
                                    }
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const RenderMessageDetail = ({ data }: { data: { id: string } }) => {
    const mainRef = useRef(null);
    const { data: response, isLoading } = useQuery({
        refetchInterval: 5000,
        queryKey: ['team_inbox_messages', data?.id],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: TeamInboxController,
                method: 'messages',
                methodParams: data?.id,
                classParams: {
                    limit: 1000,
                },
            });

            if (!success) throw new Error('Failed to fetch messages');
            return response;
        },
    });

    useEffect(() => {
        if (!mainRef?.current) return;
        mainRef.current.scrollTop = mainRef.current.scrollHeight;
    }, [mainRef, response]);

    return (
        <div
            className='flex overflow-y-auto flex-col-reverse gap-2 p-4 h-full'
            ref={mainRef}
        >
            {response?.records.map((message: any) => (
                <MessageItem key={message?.id} message={message} />
            ))}
        </div>
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
    }, [body, footer, header]);

    const repliedContent = useMemo(() => {
        const content = {};

        getData(message?.parent_payload?.template?.components, 'body')?.forEach(
            (element) => {
                content[element?.parameter_name] = element?.text;
            }
        );

        return content;
    }, [message?.parent_payload?.template?.components]);

    return (
        <div
            className={cn('w-fit col-flex gap-2', {
                'mr-auto ': message.is_replied,
                'ml-auto ': message?.attributes?.sent_by,
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
            ) : message?.attributes?.sent_by ? (
                <div className='flex flex-row-reverse gap-2 items-end'>
                    {message?.is_error && (
                        <Tooltip
                            message={JSON.stringify(
                                message.attributes?.errors?.[0]?.error_data
                                    ?.details || message.response
                            )}
                        >
                            <Info size={14} color='red' />
                        </Tooltip>
                    )}

                    <div
                        className={cn(
                            'rounded-md p-3 shadow-md  self-end flex flex-col gap-1 text-black max-w-[50%] bg-green-200'
                        )}
                    >
                        <div className='flex flex-col gap-2'>
                            <span className='text-sm text-primary-950'>
                                {message?.payload?.text?.body}
                            </span>
                        </div>
                    </div>
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
                <></>
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

const openAddInbox = () => {
    SlidingPane.open({ component: AddInboxModal });
};

const AddInboxModal = () => {
    const [attributes, setAttributes] = useState({});

    const formSchema: FormBuilderFormSchema = {
        contact_id: {
            type: 'reference_select',
            placeholder: 'Select The contact here',
            name: 'Contact',
            label: 'Contact',
            controller: ContactController,
            required: true,
            labelKey: 'display_name',
            autoSelectZeroth: true,
        },
        template_id: {
            type: 'reference_select',
            controller: CommunicationTemplateController,
            label: 'Template',
            placeholder: 'Select Template',
            required: true,
        },
    };

    const onSubmit: FormBuilderSubmitType = async (
        values: ObjectDto,
        { setError, isCreateAnother }
    ) => {
        const { success, response } = await FetchData({
            className: TeamInboxController,
            method: 'create',
            classParams: { ...values, custom_attributes: attributes },
        });

        SlidingPane.closeAll();
        if (!success) return toastBackendError(response);

        Navigation.navigate({ url: `${TEAM_INBOX_SPLIT_LIST}/${response.id}` });
    };

    const { renderFormFields, handleFormData, watch, handleSubmit } =
        useFormBuilder({
            formSchema,
            onSubmit,
        });
    return (
        <ModalContainer title='Send Message'>
            <ModalBody className='flex-1 col-flex'>
                <div className='w-full col-flex'>
                    {renderFormFields('contact_id')}
                    <Button
                        size='xs'
                        appearance='plain'
                        outline
                        className='justify-end ml-auto text-right w-fit'
                        onClick={() =>
                            openAddContactForm(undefined, {
                                callback: (data) => {
                                    handleFormData('contact_id', data?.id);
                                },
                            })
                        }
                    >
                        Add Contact
                    </Button>
                </div>

                {renderFormFields('template_id')}

                {true && (
                    <div className='gap-2 px-2 py-3 mt-3 col-flex bg-base-200'>
                        <Button
                            onClick={() =>
                                openTemplateViewer(watch('template_id'))
                            }
                            size={'xs'}
                            appearance='accent'
                            outline
                        >
                            View Template
                        </Button>

                        <DisplayAttributesField
                            template_id={watch('template_id')}
                            setAttributes={setAttributes}
                        />
                    </div>
                )}
            </ModalBody>
            <ModalFooter className='py-4 justify'>
                <div className='flex-1 gap-4 row-flex'>
                    <Button
                        appearance='errorHover'
                        onClick={() => SlidingPane.close()}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance='primary'
                        className='flex-1'
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </div>
            </ModalFooter>
        </ModalContainer>
    );
};

const DisplayAttributesField = ({
    template_id,
    setAttributes,
}: {
    template_id: number;
    setAttributes: (data: any) => void;
}) => {
    const { isFetching, data } = useQuery({
        queryKey: ['template_detail', template_id],
        enabled: !IsUndefinedOrNull(template_id),
        cacheTime: Infinity,
        staleTime: Infinity,
        retry: 5,
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: CommunicationTemplateController,
                method: 'show',
                methodParams: template_id,
            });

            if (!success) return Promise.reject(response);

            return response;
        },
    });

    if (!template_id) return <></>;
    if (isFetching)
        return (
            <div className='flex justify-center items-center'>
                <Loading size='lg' color='primary' />
            </div>
        );

    return (
        <div className='gap-2 items-center w-full col-flex'>
            {Object.entries(data?.sample_contents)?.map(([key, value]) => {
                return (
                    <InputField
                        size='sm'
                        required
                        key={key}
                        placeholder={key}
                        className='w-full'
                        onChange={(e) => {
                            setAttributes((prev) => ({ ...prev, [key]: e }));
                        }}
                    />
                );
            })}
        </div>
    );
};
