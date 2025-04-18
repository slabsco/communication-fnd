import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    FetchData,
    Navigation,
    TEAM_INBOX_SPLIT_LIST,
    useFetchParams,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { NEW_MESSAGE_RECEIVED_SOCKET_EVENT } from '../../../Constants/socket.constant';
import { useSocket } from '../../../Utils/socket/socket.context.main';
import { useNotificationSound } from './useNotificationSound.hook';

export const useTeamInboxMessageListing = () => {
    const [search, setSearch] = useState('');
    const [assignToMe, setAssignToMe] = useState(false);

    const { id: teamInboxId } = useFetchParams();
    const { subscribeEvent, unsubscribeEvent } = useSocket();
    const { playSound } = useNotificationSound();
    const queryClient = useQueryClient();

    const PAGE_LIMIT = 20;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery({
            queryKey: ['team_inbox_chat_list', search, assignToMe],
            queryFn: async ({ pageParam = 1 }) => {
                const filters: Record<string, any> = {
                    limit: PAGE_LIMIT,
                    page: pageParam,
                    assign_me: assignToMe,
                };

                if (search.length > 3) {
                    filters.search = search;
                }

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
            cacheTime: Infinity,
        });

    const flatData = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data?.pages]);

    const fetchMessage = useCallback(() => {
        queryClient.invalidateQueries([
            'team_inbox_chat_list',
            search,
            assignToMe,
        ]);
    }, [queryClient, search, assignToMe]);

    const fetchDataFromSocket = useCallback(
        ({ team_inbox_id }: { team_inbox_id: number }) => {
            if (team_inbox_id !== +teamInboxId) {
                fetchMessage();
                playSound();
            }
        },
        [fetchMessage, playSound, teamInboxId]
    );

    useEffect(() => {
        if (!teamInboxId && flatData.length > 0) {
            Navigation.navigate({
                url: `${TEAM_INBOX_SPLIT_LIST}/${flatData[0].id}`,
            });
        }
    }, [flatData, teamInboxId]);

    useEffect(() => {
        subscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, fetchDataFromSocket);

        return () => {
            unsubscribeEvent(
                NEW_MESSAGE_RECEIVED_SOCKET_EVENT,
                fetchDataFromSocket
            );
        };
    }, [subscribeEvent, unsubscribeEvent, fetchDataFromSocket]);

    return {
        search,
        setSearch,
        assignToMe,
        setAssignToMe,
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
