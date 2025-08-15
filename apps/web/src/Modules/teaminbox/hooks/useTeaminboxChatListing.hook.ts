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

import { MESSAGE_STATUS_UPDATE_SOCKET_EVENT } from '../../../Constants/socket.constant';
import { useSocket } from '../../../Utils/socket/socket.context.main';

export const useTeamInboxChatListing = () => {
    const { id: teamInboxId } = useFetchParams();
    const PAGE_LIMIT = 20;

    const { subscribeEvent, unsubscribeEvent } = useSocket();
    const queryClient = useQueryClient();
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const { pathname } = useRouter();

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
                    method: 'messages',
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

    const updateData = useCallback(
        ({ team_inbox_id }: { team_inbox_id: number }) => {
            if (team_inbox_id !== +teamInboxId) return;
            fetchMessage();
        },
        [fetchMessage, teamInboxId]
    );

    const fetchDataFromSocket = useCallback(
        ({ team_inbox_id }: { team_inbox_id: number }) => {
            if (team_inbox_id === +teamInboxId) {
                fetchMessage();
            }
        },
        [fetchMessage, teamInboxId]
    );

    useEffect(() => {
        subscribeEvent(MESSAGE_STATUS_UPDATE_SOCKET_EVENT, updateData);
        SubscribeToEvent({
            eventName: TEAM_INBOX_CHAT_REFETCH,
            callback: fetchMessage,
        });

        return () => {
            unsubscribeEvent(MESSAGE_STATUS_UPDATE_SOCKET_EVENT);
            UnsubscribeEvent({
                eventName: TEAM_INBOX_CHAT_REFETCH,
                callback: fetchMessage,
            });
        };
    }, [
        subscribeEvent,
        unsubscribeEvent,
        fetchDataFromSocket,
        updateData,
        pathname,
        fetchMessage,
    ]);

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
