import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
    FetchData,
    GetObjectFromArray,
    IsUndefinedOrNull,
    Navigation,
    StoreEvent,
    SubscribeToEvent,
    TEAM_INBOX_LISTING_REFETCH,
    TEAM_INBOX_SPLIT_LIST,
    UnsubscribeEvent,
    useFetchParams,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import { useFilterContext } from '@finnoto/design-system';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { NEW_MESSAGE_RECEIVED_SOCKET_EVENT } from '../../../Constants/socket.constant';
import { useSocket } from '../../../Utils/socket/socket.context.main';
import { playNotificationSound } from './useNotificationSound.hook';

export const TeamInboxTabFilter = [
    {
        title: 'Unread',
        key: 'unread',
        customFilterValue: {
            unread: true,
        },
    },
    {
        title: 'Assigned to me',
        key: 'assign_me',
        customFilterValue: {
            assign_me: true,
        },
    },
    {
        title: 'Bot Mode',
        key: 'is_assigned_to_bot',
        customFilterValue: {
            is_assigned_to_bot: true,
        },
    },
];

export const useTeamInboxMessageListing = () => {
    const { id: teamInboxId } = useFetchParams();

    const { filterData, queryString } = useFilterContext();
    const { subscribeEvent, unsubscribeEvent } = useSocket();

    const tabFilter = useMemo(() => queryString['tab'] || 'All', [queryString]);

    const tabFilterData = useMemo(() => {
        if (!tabFilter || tabFilter === 'all') {
            return undefined;
        }
        const activeTab = GetObjectFromArray(
            TeamInboxTabFilter,
            'key',
            tabFilter
        );
        if (activeTab?.customFilterValue) {
            return activeTab.customFilterValue;
        }

        return { [tabFilter]: true };
    }, [tabFilter]);

    const queryClient = useQueryClient();

    const client_key = useMemo(
        () => ['team_inbox_chat_list', filterData, tabFilterData],
        [filterData, tabFilterData]
    );

    const PAGE_LIMIT = 20;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery({
            cacheTime: Infinity,
            queryKey: client_key,
            queryFn: async ({ pageParam = 1 }) => {
                const filters: Record<string, any> = {
                    limit: PAGE_LIMIT,
                    page: pageParam,
                    ...filterData,
                    ...tabFilterData,
                };

                const { success, response } = await FetchData({
                    className: TeamInboxController,
                    method: 'list',
                    methodParams: 1,
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

    // Fetch every 1 second
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const flatData = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data?.pages]);

    const fetchMessage = useCallback(
        (data?: any) => {
            if (!IsUndefinedOrNull(data) && data?.id !== +teamInboxId) {
                playNotificationSound();
            }

            queryClient.invalidateQueries({
                queryKey: client_key,
            });
        },
        [client_key, queryClient, teamInboxId]
    );

    useEffect(() => {
        if (!teamInboxId && flatData?.length > 0) {
            Navigation.navigate({
                url: `${TEAM_INBOX_SPLIT_LIST}/${flatData[0].id}`,
            });
        }
    }, [flatData, teamInboxId]);

    useEffect(() => {
        if (flatData) {
            intervalRef.current = setInterval(() => {
                fetchMessage();
            }, 5000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchMessage, flatData]);

    useEffect(() => {
        subscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, fetchMessage);
        SubscribeToEvent({
            eventName: TEAM_INBOX_LISTING_REFETCH,
            callback: fetchMessage,
        });
        return () => {
            UnsubscribeEvent({
                eventName: TEAM_INBOX_LISTING_REFETCH,
                callback: fetchMessage,
            });
            unsubscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT);
        };
    }, [fetchMessage, subscribeEvent, unsubscribeEvent]);

    return {
        flatData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchMessage,
        queryClient,
        teamInboxId,
    };
};

export const RefetchTeamInboxListing = () => {
    StoreEvent({ eventName: TEAM_INBOX_LISTING_REFETCH });
};
