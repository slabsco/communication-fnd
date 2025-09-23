import { EventSourcePolyfill } from 'event-source-polyfill';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
    FetchData,
    GetItem,
    StoreEvent,
    SubscribeToEvent,
    TEAM_INBOX_CHAT_REFETCH,
    UnsubscribeEvent,
    useFetchParams,
    useQueryClient,
    UserBusiness,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';

import { useInfiniteQuery } from '@tanstack/react-query';

export const isPreviewChat = () =>
    typeof window !== 'undefined' &&
    window.location.pathname.includes('preview-chat');

export const useTeamInboxChatListing = () => {
    const { id: teamInboxId } = useFetchParams();
    const PAGE_LIMIT = 20;

    const queryClient = useQueryClient();
    const scrollableDivRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery({
            cacheTime: Infinity,
            queryKey: ['team_inbox_message_list', +teamInboxId],
            queryFn: async ({ pageParam = 1 }) => {
                const filters = {
                    limit: PAGE_LIMIT,
                    page: pageParam,
                };

                const { success, response } = await FetchData({
                    className: TeamInboxController,
                    method: isPreviewChat() ? 'previewChat' : 'messages',
                    methodParams: +teamInboxId,
                    classParams: filters,
                });

                if (!success) throw new Error('Failed to fetch messages');

                return {
                    data: response?.records ?? [],
                    page: (response?.stats?.page ?? 0) + 1,
                    totalPages: Math.ceil(
                        (response?.stats?.total ?? 0) / PAGE_LIMIT
                    ),
                };
            },
            getNextPageParam: (lastPage) =>
                lastPage.page <= lastPage.totalPages
                    ? lastPage.page
                    : undefined,
        });

    const flatData = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data?.pages]);

    const fetchMessage = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: ['team_inbox_message_list', +teamInboxId],
        });
    }, [queryClient, teamInboxId]);

    useEffect(() => {
        const businessUrl = UserBusiness.getBusinessAPIUrl();
        const token = GetItem('ACCESS_TOKEN', false);

        const es = new EventSourcePolyfill(
            `${businessUrl}api/b/messages/stream/${teamInboxId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        es.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log({ event: data });

            if (data?.event === 'message_received') return fetchMessage();
        };

        es.onerror = (err: any) => {
            if (es.readyState === 2) return;
        };

        return () => {
            es.close();
        };
    }, [fetchMessage, teamInboxId]);

    useEffect(() => {
        SubscribeToEvent({
            eventName: TEAM_INBOX_CHAT_REFETCH,
            callback: fetchMessage,
        });

        return () => {
            UnsubscribeEvent({
                eventName: TEAM_INBOX_CHAT_REFETCH,
                callback: fetchMessage,
            });
        };
    }, [fetchMessage]);

    return {
        scrollableDivRef,
        fetchNextPage,
        flatData,
        hasNextPage,
        fetchMessage,
        isFetchingNextPage,
        isLoading,
    };
};

export const RefetchTeamInboxChat = () => {
    StoreEvent({ eventName: TEAM_INBOX_CHAT_REFETCH });
};
