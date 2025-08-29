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
    useMutation,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Button,
    CommonFileUploader,
    IconButton,
    openResourceViewerModal,
    Popover,
} from '@finnoto/design-system';

import { openQuickReplySelect } from '../../quickreply/quick.reply.select.list';
import { RefetchTeamInboxDetail } from '../context/teaminbox.context.main';
import { RefetchTeamInboxChat } from '../hooks/useTeaminboxChatListing.hook';
import { openTriggerChatbotResponse } from '../modal/TriggerChatbotResponse.modal';
import { openAddInbox } from './add.inbox.modal';
import AudioRecorderComponent, { RenderAudioRecorded } from './audio.recorder';
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
    const emojiRef = useRef(null);

    const [input, setInput] = useState('');
    const [files, { removeAt, set: setFiles, push: addFiles }] =
        useList<any[]>();
    const [audioUrl, setAudioUrl] = useState(null);

    const isSendButtonDisabled = useMemo(() => {
        if (!IsEmptyArray(files)) return false;

        if (IsUndefinedOrNull(input)) return true;
        if (IsEmptyString(input)) return true;

        return input?.length <= 0;
    }, [files, input]);

    const refetch = useCallback(() => {
        RefetchTeamInboxChat();
        RefetchTeamInboxDetail();
    }, []);

    const handleSendMessage = async (doc: any) => {
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

        if (!success) {
            toastBackendError(response);
            throw new Error('Failed to send message');
        }

        setInput('');
        setFiles([]);
        refetch();
        setAudioUrl(null);

        return response;
    };

    const { mutate: sendMessage, isPending } = useMutation({
        mutationFn: async () => {
            let doc: any = files?.[0];
            if (isSendButtonDisabled)
                throw new Error('Send button is disabled');

            return handleSendMessage(doc);
        },
    });

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
            refetch();
        },
        [data?.id, refetch, setFiles]
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
                if (!isPending) sendMessage();
            }
        },
        [isPending, sendMessage]
    );

    const sendTemplateMessage = () => {
        openAddInbox({
            contact_id: data?.contact_id,
            disableContact: true,
            callback: () => {
                refetch();
            },
        });
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    if (data?.expired_at || data?.only_broadcast) {
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

        quickReplyData?.document?.forEach((doc) => {
            documents.push({
                ...doc?.attributes,
                serverUrl: doc?.document_url,
            });
        });

        data?.contact?.custom_attributes?.forEach((quickReplyData) => {
            attributes[quickReplyData?.key] = quickReplyData?.value;
        });

        if (documents?.length) addFiles(...documents);

        const withVariable = replaceVariablesInString(quickReplyData?.message, {
            name: data?.contact?.display_name,
            mobile: data?.contact?.mobile,
            ...attributes,
        });
        setInput((prev) => `${prev} ${withVariable}`);
    };

    if (audioUrl)
        return (
            <RenderAudioRecorded
                audioUrl={audioUrl}
                onClickSend={async (next) => {
                    await handleSendMessage({
                        type: 'audio',
                        serverUrl: audioUrl,
                    });
                    next();
                }}
                setAudio={setAudioUrl}
            />
        );

    return (
        <div className='sticky right-0 bottom-0 left-0 rounded shadow-inner col-flex'>
            <ChatTextareaComponent
                input={input}
                setInput={setInput}
                onSelect={setQuickReplyData}
            />
            {!IsEmptyArray(files) && (
                <div className='gap-2 my-1 w-full col-flex'>
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
                    <AudioRecorderComponent
                        getAudioUrl={(url) => {
                            setAudioUrl(url);
                        }}
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
                                        size='sm'
                                        icon={AttachmentsSvgIcon}
                                        outline
                                        appearance='polaris-transparent'
                                        name='Send Attachments'
                                    />
                                </div>
                            );
                        }}
                    </CommonFileUploader>
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
                            size='sm'
                        />
                    </Popover>
                    <IconButton
                        name='Template Message'
                        icon={ArcMessageSvgIcon}
                        onClick={sendTemplateMessage}
                        outline
                        size='sm'
                        appearance='polaris-transparent'
                    />

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
                        size='sm'
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
                        size='sm'
                    />
                </div>
                <Button
                    defaultMinWidth
                    loading={isPending}
                    onClick={(next) => sendMessage(next)}
                    disabled={isSendButtonDisabled}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};
