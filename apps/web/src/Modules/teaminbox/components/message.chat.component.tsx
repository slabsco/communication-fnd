import EmojiPicker from 'emoji-picker-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useList } from 'react-use';

import {
    FetchData,
    IsEmptyArray,
    IsEmptyString,
    IsUndefinedOrNull,
    replaceVariablesInString,
    toastBackendError,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Button,
    CommonFileUploader,
    IconButton,
    openResourceViewerModal,
    Popover,
} from '@finnoto/design-system';

import { useQueryClient } from '@tanstack/react-query';

import { openQuickReplySelect } from '../../quickreply/quick.reply.select.list';
import { openTriggerChatbotResponse } from '../modal/TriggerChatbotResponse.modal';
import { openAddInbox } from './add.inbox.modal';
import { ChatTextareaComponent } from './chat.text.area.component';
import { UploadedFileCard } from './seen.unseen.component';

import {
    ArcMessageSvgIcon,
    AttachmentsSvgIcon,
    EmojiSvgIcon,
    ReplySvgICon,
    RobotSvgIcon,
} from 'assets';

export const MessageChat = ({ data }) => {
    const queryClient = useQueryClient();

    const emojiRef = useRef(null);

    const [input, setInput] = useState('');
    const [files, { removeAt, set: setFiles, push: addFiles }] =
        useList<any[]>();

    const isSendButtonDisabled = useMemo(() => {
        if (!IsEmptyArray(files)) return false;

        if (IsUndefinedOrNull(input)) return true;
        if (IsEmptyString(input)) return true;

        return input?.length <= 0;
    }, [files, input]);

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
        queryClient.invalidateQueries(['team_inbox_message_list', +data.id]);
    }, [data?.id, files, input, isSendButtonDisabled, queryClient, setFiles]);

    const triggerChatbotAction = useCallback(
        async (chatbot_id: number) => {
            const { success, response } = await FetchData({
                className: TeamInboxController,
                method: 'triggerChatbot',
                methodParams: { id: data?.id, chatbot_id },
            });

            if (!success) return toastBackendError(response);

            setInput('');
            setFiles([]);
            queryClient.invalidateQueries([
                'team_inbox_message_list',
                data?.id,
            ]);
        },
        [data?.id, queryClient, setFiles]
    );

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
            callback: () => {
                queryClient.invalidateQueries([
                    'team_inbox_message_list',
                    +data?.id,
                ]);
            },
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
        <div className='sticky right-0 bottom-0 left-0 gap-1 p-2 rounded col-flex bg-base-100'>
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

                    <IconButton
                        name='Trigger Chatbot'
                        icon={RobotSvgIcon}
                        onClick={() => {
                            openTriggerChatbotResponse({
                                onTrigger: (id) => {
                                    triggerChatbotAction(id);
                                },
                            });
                        }}
                        appearance='plain'
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
