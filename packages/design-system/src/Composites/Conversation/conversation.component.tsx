import { useMemo } from 'react';

import {
    FormatDisplayDate,
    GenericListingType,
    getSourceDetails,
    IsEmptyArray,
    IsEmptyObject,
    LISTING_CONTROLLER_ROUTER,
    ObjectDto,
    PRODUCT_IDENTIFIER,
    SOURCEHASH,
    useApp,
    useConversation,
    useUserHook,
} from '@finnoto/core';

import {
    arcBgList,
    highlightMentionMessage,
    withMentionUserProvider,
} from '../../Components';
import { CustomMention } from '../../Components/Inputs/MentionInput/mentionInput.types';
import { cn } from '../../Utils/common.ui.utils';
import { ConversationInputBox } from './conversation-input-box';
import { Message, NotesMessage } from './conversation-message';

export interface ConversationProps {
    id: any;
    methodParams?: ObjectDto;
    type?: GenericListingType;
    controller?: any;
    className?: string;
    messageBoxClassName?: string;
    messageListWrapperClassName?: string;
    insideModal?: boolean;
    users?: any[];
    isAr?: boolean;
    withWrapper?: boolean;
    header?: React.ReactNode;
    onMessageSendCallback?: () => void;
    disableConversation?: boolean;
    hideInput?: boolean;
    messageContainerClassName?: string;
    isPwa?: boolean;
    disableUsers?: boolean;
    userFilterKey?: string;
    userFilterValue?: unknown;
    variant?: 'conversation' | 'notes';
    refetch?: () => void;
    customMentions?: CustomMention[];
}

export const Conversation = withMentionUserProvider(
    ({
        type,
        controller,
        id,
        methodParams,
        className,
        messageBoxClassName,
        insideModal,
        withWrapper,
        header,
        onMessageSendCallback,
        disableConversation,
        hideInput = false,
        messageContainerClassName,
        isPwa,
        userFilterValue,
        userFilterKey,
        refetch,
        variant = 'conversation',
        customMentions = [],
    }: ConversationProps) => {
        const { isArc } = useApp();

        const controllerRouter = controller ?? LISTING_CONTROLLER_ROUTER[type];
        const { messageData, handleMessageSend, getGroupedMessageByDate } =
            useConversation({
                className: controllerRouter,
                id,
                refetch,
                methodParams,
            });

        const displayMessages = useMemo(() => {
            if (IsEmptyArray(messageData)) return [];

            return structuredClone(messageData).map((conversation) => {
                const context = Object.keys(conversation.context || []).map(
                    (contextKey) => {
                        const ctx = conversation.context[contextKey];
                        return {
                            ...ctx,
                            id: ctx.source_id ?? ctx.id,
                            display: contextKey,
                        };
                    }
                );

                conversation.message = highlightMentionMessage(
                    conversation.message,
                    context,
                    ConversationMention
                );

                return { ...conversation };
            });
        }, [messageData]);

        const displayMessagesWithUniqueAvatar = useMemo(() => {
            const creators = displayMessages.map((message) => message.title);
            const uniqueCreators = [...new Set(creators)];

            let creatorsWithAvatar = {};

            uniqueCreators.forEach((creator, index) => {
                creatorsWithAvatar[creator] = arcBgList[index];
            });

            return displayMessages.map((message) => {
                return {
                    ...message,
                    appearance: creatorsWithAvatar[message.title],
                };
            });
        }, [displayMessages]);

        const groupedMessages = useMemo(() => {
            return getGroupedMessageByDate(displayMessagesWithUniqueAvatar);
        }, [displayMessagesWithUniqueAvatar, getGroupedMessageByDate]);

        return (
            <div
                className={cn(
                    'flex flex-col h-full rounded-lg border bg-base-100 border-polaris-border',
                    {
                        'rounded border-0': !isArc,
                        'bg-polaris-bg-surface': isArc,
                        'px-4 py-3 h-full border': withWrapper,
                        'flex-col-reverse bg-transparent border-none max-h-[79vh] overflow-y-clip':
                            isPwa,
                    },
                    className
                )}
            >
                {!isPwa && header}
                {!hideInput && (
                    <div
                        className={cn('mx-3 py-2 z-[49] sticky ', {
                            'top-0 p-0 m-0': !isArc && !isPwa,
                            'top-[45px]': !isPwa && isArc,
                            'bottom-0 left-0 absolute mx-0 w-full pb-2': isPwa,
                        })}
                    >
                        <ConversationInputBox
                            key={id}
                            messageBoxClassName={messageBoxClassName}
                            onMessage={(message, mentions, files) => {
                                const context = {};
                                mentions.forEach((mention) => {
                                    context[mention.display] = {
                                        source_id: mention.id,
                                        source_type:
                                            mention.source_type ??
                                            SOURCEHASH.user,
                                    };
                                });
                                handleMessageSend(
                                    { message, context, files },
                                    onMessageSendCallback
                                );
                            }}
                            disabled={disableConversation}
                            isPwa={isPwa}
                            userFilterKey={userFilterKey}
                            userFilterValue={userFilterValue}
                            variant={variant}
                            customMentions={customMentions}
                        />
                    </div>
                )}

                {isPwa && header}

                <div
                    className={cn(
                        'flex overflow-y-auto flex-col-reverse gap-6 p-2 px-3 min-h-[63vh]',
                        {
                            'max-h-[450px] min-h-[450px]': insideModal,
                            'px-0': !isArc,
                            'col-flex': !isPwa,
                            'px-4 h-[calc(100vh-280px)] min-h-[20vh]': isPwa,
                        },
                        messageContainerClassName
                    )}
                >
                    {IsEmptyObject(groupedMessages) && (
                        <div className='text-center text-polaris-text-disabled'>
                            No Conversations.
                        </div>
                    )}
                    {Object.keys(groupedMessages).map((key) => {
                        const items = groupedMessages[key];

                        const sortedBasedOnSystemGenerated = items?.toSorted(
                            (item) => (item.isSystemGenerated ? -1 : 1)
                        );

                        return (
                            <div key={key}>
                                <p className='mb-3 text-xs text-center text-polaris-text-secondary'>
                                    {key}
                                </p>
                                <div
                                    className={cn(
                                        'flex flex-col-reverse gap-3',
                                        {
                                            'col-flex': !isPwa,
                                        }
                                    )}
                                >
                                    {sortedBasedOnSystemGenerated?.map(
                                        (item) => {
                                            if (variant === 'notes')
                                                return (
                                                    <NotesMessage
                                                        user={item.title}
                                                        message={item.message}
                                                        date={FormatDisplayDate(
                                                            item.date,
                                                            true
                                                        )}
                                                        files={item.attachments}
                                                    />
                                                );

                                            return (
                                                <Message
                                                    key={item.id}
                                                    {...{
                                                        date: FormatDisplayDate(
                                                            item.date,
                                                            true
                                                        ),
                                                        image_url:
                                                            item.image_url,
                                                        user_name: item.title,
                                                        message: item.message,
                                                        type: item.isSentByMe
                                                            ? 'sent'
                                                            : 'received',
                                                        appearance:
                                                            item.appearance,
                                                        attachments:
                                                            item.attachments,
                                                        platform_id:
                                                            item.platform_id,
                                                        fullWidth: isPwa,
                                                        isSystemGenerated:
                                                            item.isSystemGenerated,
                                                        isPwa,
                                                    }}
                                                />
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
);

export const ConversationMention = ({ text, context }) => {
    const {
        user: { employee_id },
    } = useUserHook();

    const sourceAction = useMemo(() => {
        if (!context) return null;
        if (!context.source_type) return null;

        const { action } = getSourceDetails(context.source_type);
        if (!action) return null;

        return action;
    }, [context]);

    if (!context) return text;
    if (!sourceAction) return text;

    return (
        <button
            className={cn('link rounded p-0.5 link-hover', {
                'bg-secondary text-secondary-content':
                    employee_id === context?.id,
            })}
            onClick={() => sourceAction(context.id)}
        >
            {text}
        </button>
    );
};
