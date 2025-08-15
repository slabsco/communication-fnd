import { useCallback, useEffect, useMemo } from 'react';

import {
    FetchData,
    GetObjectFromArray,
    Navigation,
    StoreEvent,
    SubscribeToEvent,
    TEAM_INBOX_LISTING_REFETCH,
    TEAM_INBOX_SPLIT_LIST,
    useFetchParams,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import { useFilterContext } from '@finnoto/design-system';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { NEW_MESSAGE_RECEIVED_SOCKET_EVENT } from '../../../Constants/socket.constant';
import { useSocket } from '../../../Utils/socket/socket.context.main';
import { useNotificationSound } from './useNotificationSound.hook';

export const TeamInboxTabFilter = [
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
    const { subscribeEvent, unsubscribeEvent } = useSocket();
    const { playSound } = useNotificationSound();

    const { filterData, queryString } = useFilterContext();

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

    const flatData = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data?.pages]);

    const fetchMessage = useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: client_key,
        });
    }, [client_key, queryClient]);

    const fetchDataFromSocket = useCallback(() => {
        fetchMessage();
        playSound();
    }, [fetchMessage, playSound]);

    useEffect(() => {
        if (!teamInboxId && flatData.length > 0) {
            Navigation.navigate({
                url: `${TEAM_INBOX_SPLIT_LIST}/${flatData[0].id}`,
            });
        }
    }, [flatData, teamInboxId]);

    useEffect(() => {
        subscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, fetchDataFromSocket);
        SubscribeToEvent({
            eventName: TEAM_INBOX_LISTING_REFETCH,
            callback: fetchMessage,
        });

        return () => {
            unsubscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT);
            SubscribeToEvent({
                eventName: TEAM_INBOX_LISTING_REFETCH,
                callback: fetchMessage,
            });
        };
    }, [subscribeEvent, unsubscribeEvent, fetchDataFromSocket, fetchMessage]);

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
