import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
    FetchData,
    StoreEvent,
    SubscribeToEvent,
    TEAM_INBOX_CHAT_REFETCH,
    UnsubscribeEvent,
    useFetchParams,
    useQueryClient,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';

import { useInfiniteQuery } from '@tanstack/react-query';

export const useTeamInboxChatListing = () => {
    const { id: teamInboxId } = useFetchParams();
    const { asPath } = useRouter();
    const PAGE_LIMIT = 20;

    const queryClient = useQueryClient();
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const isPreviewChat = asPath.includes('preview-chat');

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
                    method: isPreviewChat ? 'previewChat' : 'messages',
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
    // Fetch every 1 second
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (flatData) {
            intervalRef.current = setInterval(() => {
                fetchMessage();
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [flatData, fetchMessage]);

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
