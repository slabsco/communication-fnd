import { format, isToday, isYesterday } from 'date-fns';
import { useEffect, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ObjectDto } from '../../backend/Dtos';
import {
    CommentTypeEnum,
    PRODUCT_IDENTIFIER,
    SOURCEHASH,
} from '../../Constants';
import { ChatDataPayload, FileUploadDto } from '../../Types';
import {
    AccessValueOnNestedObjectByKey,
    SortArrayObjectBy,
} from '../../Utils/common.utils';
import {
    StoreEvent,
    SubscribeToEvent,
    UnsubscribeEvent,
} from '../../Utils/stateManager.utils';
import { Toast } from '../../Utils/toast.utils';
import { useApp } from '../useApp.hook';
import { FetchData } from '../useFetchData.hook';
import { useUserHook } from '../user.hook';

const GENERIC_CONVERSATION_REFETCH = 'GENERIC_CONVERSATION_REFETCH';

export const useConversation = ({
    className,
    id,
    disableNetwork,
    methodParams,
    refetch,
}: {
    className: any;
    id: any;
    disableNetwork?: boolean;
    methodParams?: ObjectDto;
    refetch?: () => void;
}) => {
    const { product_id } = useApp();

    const { user } = useUserHook();
    const {
        data: conversations,
        isLoading: conversationLoading,
        refetch: refetchConversations,
    } = useQuery({
        queryKey: ['comments', 'messages', id],
        retry: 2,
        queryFn: () => fetchData('getConversations'),
        enabled: !!id && !disableNetwork,
    });

    useEffect(() => {
        SubscribeToEvent({
            eventName: GENERIC_CONVERSATION_REFETCH,
            callback: refetchConversations,
        });
        return () => {
            UnsubscribeEvent({
                eventName: GENERIC_CONVERSATION_REFETCH,
                callback: refetchConversations,
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [className]);

    const fetchData = async (method: string) => {
        const { success, response } = await FetchData({
            className: className,
            method: method,
            methodParams: methodParams ?? id,
        });

        if (success) {
            refetch?.();
            return response;
        }

        return [];
    };

    const addConversation = async (
        comments: string,
        context?: any,
        files?: FileUploadDto
    ) => {
        const classParams: any = { comments, context, files };

        const sourceType = AccessValueOnNestedObjectByKey(
            context,
            'source_type'
        );

        if (
            product_id === PRODUCT_IDENTIFIER.VENDOR ||
            sourceType === SOURCEHASH.billing
        ) {
            classParams.type_id = CommentTypeEnum.VENDOR;
        }

        const { success, response } = await FetchData({
            className,
            method: 'createConversation',
            methodParams: methodParams ?? id,
            classParams,
        });

        if (!success) {
            Toast.error({ description: response.message });
            return false;
        }

        return true;
    };

    const getGroupedMessageByDate = (data: ChatDataPayload[]) => {
        return data.reduce((acc, item) => {
            const itemDate = new Date(item.date);
            let date = format(itemDate, 'dd/MM/yyyy');
            if (isToday(itemDate)) {
                date = 'Today';
            }
            if (isYesterday(itemDate)) {
                date = 'Yesterday';
            }
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
    };

    const handleMessageSend = async (
        value: { message?: string; context?: any; files?: FileUploadDto },
        next = () => {}
    ) => {
        const success = await addConversation(
            value.message,
            value.context,
            value.files
        );
        if (!success) return next();

        refetchConversations();
        next();
    };

    const messageData = useMemo(() => {
        if (!Array.isArray(conversations)) return [];

        let chatData: ChatDataPayload[] = [];

        conversations.forEach((data: ObjectDto) => {
            const chat: ChatDataPayload = {
                isSentByMe:
                    user.id === data.created_by && !data.is_system_generated,
            };

            // If comment message.
            chat.id = data.id;
            chat.message = data.comments;
            chat.date = data.created_at;
            chat.title = data.creator?.name;
            chat.context = data.context;
            chat.email = data.creator?.email;
            chat.image_url = data.creator?.image_url;
            chat.attachments = data.documents;
            chat.platform_id =
                data.attributes?.platform_id || data?.platform_id;
            chat.isSystemGenerated = data.is_system_generated;
            return chatData.push(chat);
        });

        chatData = SortArrayObjectBy(chatData, 'date', 'desc', true);
        return chatData;
    }, [conversations, user.id]);

    return {
        conversationLoading,
        messageData,
        handleMessageSend,
        refetchConversations,
        getGroupedMessageByDate,
    };
};

export const fetchConversationList = () => {
    StoreEvent({
        eventName: GENERIC_CONVERSATION_REFETCH,
    });
};
