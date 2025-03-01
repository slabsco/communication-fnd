'use client';

import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import {
    Check,
    CheckCheck,
    Clock1,
    Contact,
    FileIcon,
    Info,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useClickAway, useEffectOnce, useList } from 'react-use';

import {
    ACCESS_TOKEN,
    AccessManager,
    BUSINESS_API_URL,
    Ellipsis,
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    GetItem,
    IsEmptyArray,
    IsEmptyObject,
    IsUndefinedOrNull,
    Navigation,
    ObjectDto,
    RefetchGenericListing,
    RemoveEmptyArray,
    replaceVariablesInString,
    TEAM_INBOX_SPLIT_LIST,
    toastBackendError,
    useFormBuilder,
    useOperatingSystem,
    UserBusiness,
    useRecursiveFetch,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import { QuickReplyController } from '@finnoto/core/src/backend/communication/controller/quick.reply.controller';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Avatar,
    Badge,
    Button,
    cn,
    CommonFileUploader,
    DropdownMenu,
    FormatDisplayDateStyled,
    handleDocumentIcon,
    Icon,
    IconButton,
    InputField,
    Loading,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    openResourceViewerModal,
    Popover,
    TextareaField,
    Tooltip,
    Typography,
} from '@finnoto/design-system';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import ArcGenericSplitDetailComponent from '../../Components/ArcGenericSplitDetail/arcGenericSplitDetail.component';
import { AsyncTemplateViewer } from '../broadcast/your-templates/components/TemplateViewer.component';
import { MessageSectionPreview } from '../broadcast/your-templates/components/YourTemplatesPriview.component';
import { openAddContactForm } from '../contact/add.contact.modal.form';
import { openQuickReplySelect } from '../quickreply/quick.reply.select.list';

import {
    ArcMessageSvgIcon,
    AttachmentsSvgIcon,
    DocumentSvgIcon,
    EmojiSvgIcon,
    FileDownloadSvgIcon,
    MoreIcon,
    ReplySvgICon,
} from 'assets';

const TeamInboxModuleDetail = () => {
    const [recursiveFetch] = useRecursiveFetch(RefetchGenericListing, {
        delay: 2000,
        repeat: Infinity,
    });

    useEffectOnce(() => {
        recursiveFetch();
    });

    return (
        <ArcGenericSplitDetailComponent
            defaultActiveTab='all'
            definitionKey=''
            title='Team Inbox'
            type='teamInbox'
            breadcrumbKey='contact.display_name'
            // renderTopBar={() => {
            //     return <></>;
            // }}
            actions={[
                {
                    name: 'Send New Message',
                    type: 'create',
                    action: openAddInbox,
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
                    {data?.attributes?.unread_count > 0 && (
                        <Badge
                            className='animate-pulse'
                            label={`${data?.attributes?.unread_count} Unread`}
                            size='xs'
                            solid
                            appearance='info'
                        />
                    )}
                </div>
                <div className='mt-0'>
                    <span className='text-sm'>
                        {FormatDisplayDateStyled({
                            value: data?.last_activity_at,
                        })}
                    </span>
                </div>
            </div>
            {data?.expired_at && (
                <Badge label={'Expired'} size='sm' appearance='error' />
            )}
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
                        <div className='overflow-hidden flex-1 border'>
                            <RenderMessageDetail data={data} />
                        </div>
                        <MessageChat data={data} />
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
        cacheTime: Infinity,
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
            {isLoading && <Loading />}
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

    return (
        <div
            className={cn('w-full col-flex gap-2', {
                'mr-auto ': message.is_replied,
                'ml-auto ': message?.attributes?.sent_by,
            })}
        >
            {component ? (
                <div className='flex flex-row-reverse gap-2 items-end'>
                    <RenderSeenUnseen message={message} />

                    <MessageSectionPreview
                        sampleContent={sampleContent}
                        configuration={message?.template_button_configurations}
                        title={message?.template_title}
                        footer={message?.template_footer}
                        body={message?.template_body}
                        className='max-w-[50%] bg-green-200'
                        showTime={false}
                    />
                    <MessageBubbleTimePopper message={message} />
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

                    <RenderSeenUnseen message={message} />
                    <RenderInnerTextMessage message={message} />
                    <MessageBubbleTimePopper message={message} />
                </div>
            ) : (
                <></>
            )}

            {message?.is_replied && (
                <RenderUserMessageBubble message={message} />
            )}
        </div>
    );
};

const openAddInbox = (options?: {
    contact_id?: number;
    disableContact?: boolean;
    callback?: () => void;
}) => {
    Modal.open({
        component: AddInboxModal,
        modalSize: 'lg',
        props: { ...options },
    });
};

const AddInboxModal = ({
    contact_id,
    disableContact = false,
    callback,
}: {
    contact_id: number;
    disableContact?: boolean;
    callback?: any;
}) => {
    const [templateData, setTemplateData] = useState<any>();
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
            disabled: disableContact,
        },
        template_id: {
            type: 'reference_select',
            controller: CommunicationTemplateController,
            label: 'Template',
            placeholder: 'Select Template',
            required: true,
            autoSelectZeroth: true,
        },
    };

    const isAllAttributesFilled = useMemo(() => {
        if (IsEmptyObject(templateData?.sample_contents)) return false;
        if (IsEmptyObject(attributes)) return false;

        const sample_contents = Object.values(templateData?.sample_contents);
        const att = RemoveEmptyArray(Object.values(attributes));

        if (sample_contents.length === att.length) return true;
        return false;
    }, [attributes, templateData?.sample_contents]);

    const onSubmit: FormBuilderSubmitType = async (
        values: ObjectDto,
        { setError, isCreateAnother }
    ) => {
        const { success, response } = await FetchData({
            className: TeamInboxController,
            method: 'create',
            classParams: { ...values, custom_attributes: attributes },
        });

        Modal.closeAll();
        if (!success) return toastBackendError(response);

        Navigation.navigate({ url: `${TEAM_INBOX_SPLIT_LIST}/${response.id}` });
        callback?.(response);
    };

    const { renderFormFields, hasError, handleFormData, watch, handleSubmit } =
        useFormBuilder({
            formSchema,
            onSubmit,
            initValues: { contact_id },
        });

    return (
        <ModalContainer title='Send Message'>
            <ModalBody className='grid flex-1 grid-cols-2 gap-6'>
                <div className='col-flex'>
                    <div className='w-full col-flex'>
                        {renderFormFields('contact_id')}
                        {!disableContact && (
                            <Button
                                size='xs'
                                appearance='plain'
                                outline
                                className='justify-end ml-auto text-right w-fit'
                                onClick={() =>
                                    openAddContactForm(undefined, {
                                        callback: (data) => {
                                            handleFormData(
                                                'contact_id',
                                                data?.id
                                            );
                                        },
                                    })
                                }
                            >
                                Add Contact
                            </Button>
                        )}
                    </div>
                    {renderFormFields('template_id')}
                    {!IsUndefinedOrNull(templateData) && (
                        <DisplayAttributesField
                            template_id={watch('template_id')}
                            setAttributes={setAttributes}
                            attributes={attributes}
                        />
                    )}
                </div>
                <div className='flex justify-center items-center p-4 rounded bg-primary h-[650px]'>
                    <AsyncTemplateViewer
                        getData={(data) => {
                            setTemplateData(data);
                        }}
                        id={watch('template_id')}
                        sample_contents={attributes}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='py-4 justify'>
                <div className='flex-1 gap-4 row-flex'>
                    <Button
                        appearance='errorHover'
                        onClick={() => Modal.close()}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance='primary'
                        defaultMinWidth
                        onClick={handleSubmit}
                        disabled={!isAllAttributesFilled || hasError()}
                    >
                        Send
                    </Button>
                </div>
            </ModalFooter>
        </ModalContainer>
    );
};

const DisplayAttributesField = ({
    template_id,
    setAttributes,
    attributes,
}: {
    template_id: number;
    setAttributes: (data: any) => void;
    attributes: any;
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
            <div className='flex justify-center items-center mt-4'>
                <Loading size='lg' color='primary' />
            </div>
        );

    return (
        <div className='gap-2 items-center p-2 mt-4 w-full rounded col-flex bg-base-300'>
            {Object.entries(data?.sample_contents)?.map(([key, value]) => {
                return (
                    <InputField
                        label={key}
                        size='sm'
                        required
                        key={key}
                        placeholder={key}
                        className='w-full'
                        value={attributes?.[key]}
                        onChange={(e) => {
                            setAttributes((prev) => ({ ...prev, [key]: e }));
                        }}
                    />
                );
            })}
        </div>
    );
};

const MessageChat = ({ data }) => {
    const queryClient = useQueryClient();

    const emojiRef = useRef(null);

    const [input, setInput] = useState('');
    const [files, { removeAt, set: setFiles, push: addFiles }] =
        useList<any[]>();

    const isSendButtonDisabled = useMemo(() => {
        return input.length <= 0;
    }, [input.length]);

    const invalidateMessage = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: ['team_inbox_messages'],
        });
    }, [queryClient]);

    const sendMessage = useCallback(async () => {
        const doc: any = files?.[0];

        if (isSendButtonDisabled) return;

        const { success, response } = await FetchData({
            className: TeamInboxController,
            method: 'sendMessage',
            methodParams: data?.id,
            classParams: {
                ignore_dto_all: true,
                data: input,
                attachment: doc && {
                    type: doc?.type,
                    name: doc?.name,
                    link: doc?.serverUrl,
                },
            },
        });

        if (!success) return toastBackendError(response);

        setInput('');
        setFiles([]);
        invalidateMessage();
    }, [
        data?.id,
        files,
        input,
        invalidateMessage,
        isSendButtonDisabled,
        setFiles,
    ]);

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                !e.altKey
            ) {
                e.preventDefault();
                sendMessage();
            }
        },
        [sendMessage]
    );

    const sendTemplateMessage = () => {
        openAddInbox({
            contact_id: data?.contact_id,
            disableContact: true,
            callback: invalidateMessage,
        });
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    if (data?.expired_at) {
        return (
            <div className='p-3 rounded bg-primary col-flex'>
                <h3 className='text-lg font-semibold text-primary-content'>
                    This is a broadcast only chat.{' '}
                </h3>
                <p className='text-sm text-primary-content'>
                    Until you receive a message from the customer, WhatsApp
                    allows only template messages to be sent in these chats.
                </p>
                <Button
                    onClick={sendTemplateMessage}
                    className='mt-2'
                    appearance='polaris-info'
                >
                    Send Template Message
                </Button>
            </div>
        );
    }

    const setQuickReplyData = (quickReplyData: any) => {
        const documents = [];
        const attributes = {};

        (quickReplyData?.document as any[]).forEach((doc) => {
            documents.push({
                ...doc?.attributes,
                serverUrl: doc?.document_url,
            });
        });

        data?.contact?.custom_attributes?.forEach((quickReplyData) => {
            attributes[quickReplyData?.key] = quickReplyData?.value;
        });

        addFiles(...documents);

        const withVariable = replaceVariablesInString(quickReplyData?.message, {
            name: data?.contact?.display_name,
            mobile: data?.contact?.mobile,
            ...attributes,
        });

        setInput((prev) => `${prev} ${withVariable}`);
    };

    return (
        <div className='sticky right-0 bottom-0 left-0 gap-1 col-flex'>
            <ChatTextareaComponent
                input={input}
                setInput={setInput}
                onSelect={setQuickReplyData}
            />
            {!IsEmptyArray(files) && (
                <div className='gap-2 w-full col-flex'>
                    {files?.map((file: any, index): any => {
                        return (
                            <UploadedFileCard
                                key={`${file?.serverUrl}-${index}`}
                                file={file}
                                handleRemoveFile={() => {
                                    removeAt(index);
                                }}
                                hideDelete={false}
                                imageViwer={() =>
                                    openResourceViewerModal([], {
                                        document_url: file?.serverUrl,
                                        ...file,
                                    })
                                }
                            />
                        );
                    })}
                </div>
            )}

            <div className='flex gap-2 items-center'>
                <div className='flex flex-1 items-center'>
                    <IconButton
                        name='Template Message'
                        icon={ArcMessageSvgIcon}
                        onClick={sendTemplateMessage}
                        outline
                        appearance='polaris-transparent'
                    />

                    <CommonFileUploader
                        is_multiple={false}
                        onFileUpload={(data) => {
                            setFiles(data as any);
                        }}
                    >
                        {({ uploading }) => {
                            return (
                                <div>
                                    <IconButton
                                        icon={AttachmentsSvgIcon}
                                        outline
                                        appearance='polaris-transparent'
                                    />
                                </div>
                            );
                        }}
                    </CommonFileUploader>

                    <IconButton
                        name='Quick Reply'
                        icon={ReplySvgICon}
                        onClick={() => {
                            openQuickReplySelect({
                                getData: setQuickReplyData,
                            });
                        }}
                        outline
                        appearance='polaris-transparent'
                    />

                    <Popover
                        ref={emojiRef}
                        element={
                            <EmojiPicker
                                className='absolute'
                                allowExpandReactions
                                onEmojiClick={({ emoji }) => {
                                    setInput((prev) => prev + emoji);
                                    emojiRef.current.toggle(false);
                                }}
                            />
                        }
                    >
                        <IconButton
                            name='Add Emoji'
                            icon={EmojiSvgIcon}
                            appearance='plain'
                        />
                    </Popover>
                </div>
                <Button onClick={sendMessage} disabled={isSendButtonDisabled}>
                    Send
                </Button>
            </div>
        </div>
    );
};

const UploadedFileCard = ({
    file,
    handleRemoveFile,
    imageViwer,
    hideDelete,
}: any) => {
    const isDeleteOptionShow = useMemo(() => {
        if (hideDelete && file?.id) return false;
        if (AccessManager.hasRoleIdentifier('ua_document_manager')) return true;
        let activeFile: any = file;
        if (activeFile?.attributes?.no_edit) return false;
        if (!activeFile?.created_by) return true;
        const business = UserBusiness.getCurrentBusiness();
        const loggedUserObj: any = UserBusiness.getIdObject();

        if (!business?.owner_id || !loggedUserObj?.user_id) return true; //business information initially not set
        return (
            AccessManager.isAuthUser(activeFile?.created_by) ||
            AccessManager.isBusinessOwner(activeFile?.created_by)
        );
    }, [file, hideDelete]);
    const actions = [
        { name: 'View', action: imageViwer },
        {
            name: 'delete',
            action: handleRemoveFile,
            isCancel: true,
            visible: isDeleteOptionShow,
        },
    ];

    return (
        <div className='flex overflow-hidden gap-4 justify-between items-center px-4 py-2 text-xs rounded border bg-base-100 border-base-300'>
            <div className='flex overflow-hidden gap-3 items-center'>
                <Icon
                    source={handleDocumentIcon(
                        file?.document_url || file?.serverUrl
                    )}
                    isSvg
                    size={20}
                    iconColor='text-base-tertiary -mt-1'
                />
                <div className='overflow-hidden font-medium text-left col-flex text-base-primary'>
                    <Typography className='overflow-hidden w-full text-xs truncate text-ellipsis'>
                        {file?.name}
                    </Typography>

                    <Typography className='text-[10px] font-normal uppercase text-base-tertiary '>
                        {Math.round(file?.size / 1024)}KB
                    </Typography>
                </div>
            </div>

            <DropdownMenu hideOnNoAction={false} actions={actions}>
                <div className='btn btn-square btn-ghost btn-xs hover:bg-primary/10 hover:text-primary'>
                    <Icon
                        source={MoreIcon}
                        size={22}
                        isSvg
                        iconClass='rotate-90'
                    />
                </div>
            </DropdownMenu>
        </div>
    );
};

const RenderInnerTextMessage = ({ message }: any) => {
    const payload = message?.payload;

    const renderComponent = () => {
        if (!IsEmptyObject(payload?.image)) {
            return (
                <div className='flex flex-col gap-2'>
                    <Image
                        height={300}
                        width={300}
                        alt='image'
                        src={payload?.image.link}
                    />

                    <span className='text-sm text-primary-950'>
                        {payload?.image?.caption}
                    </span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.document)) {
            const isNotPdf = !(payload?.document?.link as string).endsWith(
                '.pdf'
            );
            return (
                <div className='flex flex-col gap-2'>
                    {isNotPdf ? (
                        <div className='flex gap-2 items-center px-3 py-1 rounded bg-base-200'>
                            <Icon source={DocumentSvgIcon} isSvg />
                            <span className='text-sm'>
                                {Ellipsis({ text: payload?.document?.link })}
                            </span>
                            <Link
                                href={payload?.document?.link}
                                target='_blank'
                            >
                                <IconButton
                                    icon={FileDownloadSvgIcon}
                                    size='xs'
                                    appearance='base'
                                />
                            </Link>
                        </div>
                    ) : (
                        <iframe
                            src={payload?.document?.link}
                            width='100%'
                            height='100%'
                        />
                    )}

                    <span className='text-sm text-primary-950'>
                        {payload?.document?.caption}
                    </span>
                </div>
            );
        }

        return (
            <div className='flex flex-col gap-2'>
                <span className='text-sm text-primary-950'>
                    {payload?.text?.body}
                </span>
            </div>
        );
    };

    return (
        <div
            className={cn(
                'rounded-md p-3 shadow-md  self-end flex flex-col gap-1 text-black max-w-[50%] bg-green-200'
            )}
        >
            {renderComponent()}
        </div>
    );
};

const RenderUserMessageBubble = ({ message }) => {
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

        if (success) RefetchGenericListing();
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

const ChatTextareaComponent = ({
    setInput,
    input,
    onSelect,
}: {
    input: string;
    setInput: any;
    onSelect: (data: any) => void;
}) => {
    const ref = useRef<any>(null);
    const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);

    useClickAway(ref, () => {
        setIsQuickReplyOpen(false);
    });

    const { type: osType } = useOperatingSystem();

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            const isMac = osType === 'mac';

            const hasPressed = isMac ? e.metaKey : e.ctrlKey;

            //ctrl+l or ctrl+shift+l
            if (e?.key === '/' && hasPressed) {
                setIsQuickReplyOpen((prev) => !prev);
            }
        },
        [osType]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return (
        <Popover
            trigger='manual'
            side='top'
            offsetY={120}
            offsetX={10}
            align='start'
            visible={isQuickReplyOpen}
            element={
                <QuickReplySelectBox
                    ref={ref}
                    onSelect={(data) => {
                        onSelect(data);
                        setIsQuickReplyOpen(false);
                    }}
                />
            }
        >
            <TextareaField
                inputClassName='leading-5 py-2'
                rows={5}
                value={input}
                onChange={(val) => setInput(val)}
                placeholder={
                    'Type your message here or press (⌘ + /) for the quick replies.'
                }
                className='w-full'
                size='lg'
            />
        </Popover>
    );
};
const QuickReplySelectBox = React.forwardRef<
    HTMLDivElement,
    { onSelect: (data: any) => void }
>(({ onSelect }, ref) => {
    const [input, setInput] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['find', 'quick_reply'],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: QuickReplyController,
                method: 'find',
                classParams: { str: input },
            });

            if (success) return response;
        },
    });

    return (
        <div
            ref={ref}
            className='gap-2 items-center p-3 rounded shadow-lg bg-base-100 col-flex'
        >
            <InputField
                placeholder={'search here..'}
                size='sm'
                value={input}
                onChange={(e) => setInput(e)}
            />
            <div className='w-full'>
                {isLoading ? (
                    <div className='p-2 text-sm'>Loading...</div>
                ) : (
                    <div className='overflow-y-auto max-h-60'>
                        {data?.map((val) => (
                            <div
                                key={val?.id}
                                onClick={() => onSelect(val)}
                                className='p-2 text-sm rounded cursor-pointer hover:bg-primary hover:text-primary-content'
                            >
                                {val?.name}{' '}
                                <span className='text-accent'>
                                    (/{val?.shortcut})
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

QuickReplySelectBox.displayName = 'QuickReplySelectBox';

const MessageBubbleTimePopper = ({ message }: { message: any }) => {
    return (
        <div className='flex gap-1'>
            <div>
                <span className='text-base-secondary text-[10px]'>
                    {message.creator}
                </span>
                {FormatDisplayDateStyled({
                    value: message?.created_at,
                    size: 'xs',
                    className: 'text-base-secondary',
                    containerClass: 'text-[10px]',
                })}
            </div>
        </div>
    );
};

const RenderSeenUnseen = ({ message }: any) => {
    return message?.is_error ? (
        <Tooltip message={'Error Sending the message'}>
            <Info size={14} color='red' />
        </Tooltip>
    ) : (
        <div className='flex items-center'>
            {message?.read_at ? (
                <CheckCheck size={10} color='green' />
            ) : message?.delivered_at ? (
                <CheckCheck size={10} />
            ) : message?.sent_at ? (
                <Check size={10} />
            ) : (
                <Clock1 size={10} />
            )}
        </div>
    );
};
