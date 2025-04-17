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
    const [search, setSearch] = useState<string>('');
    const queryClient = useQueryClient();
    const { id: teamInboxId } = useFetchParams();

    const { playSound } = useNotificationSound();

    const [assignToMe, setAssignToMe] = useState<boolean>(false);

    const { subscribeEvent, unsubscribeEvent } = useSocket();
    const PAGE_LIMIT = 20;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery({
            queryKey: ['team_inbox_chat_list', search, assignToMe],
            queryFn: async ({ pageParam = 1 }) => {
                const filters: any = {
                    limit: PAGE_LIMIT,
                    page: pageParam,
                    assign_me: assignToMe,
                };

                if (search?.length > 3) filters.search = search;

                const { success, response } = await FetchData({
                    className: TeamInboxController,
                    method: 'list',
                    methodParams: 1,
                    classParams: filters,
                });

                if (!success) throw new Error('Failed to fetch messages');
                return {
                    data: response?.records ?? [],
                    page: response?.stats?.page + 1,
                    totalPages: Math.ceil(response?.stats?.total / PAGE_LIMIT),
                };
            },
            getNextPageParam: (lastPage) =>
                lastPage.page <= lastPage.totalPages
                    ? lastPage.page
                    : undefined,
        });

    const fetchMessage = useCallback(() => {
        queryClient.invalidateQueries([
            'team_inbox_chat_list',
            search,
            assignToMe,
        ]);
    }, [assignToMe, queryClient, search]);

    const flatData = useMemo(() => {
        return data?.pages.flatMap((item) => item.data) ?? [];
    }, [data]);

    useEffect(() => {
        if (teamInboxId) return;

        if (flatData?.[0]?.id) {
            Navigation.navigate({
                url: `${TEAM_INBOX_SPLIT_LIST}/${flatData?.[0]?.id}`,
            });
        }
    }, [data, flatData, teamInboxId]);

    const fetchDataFromSocket = useCallback(
        ({ team_inbox_id }) => {
            console.log({ team_inbox_id });

            if (team_inbox_id !== +teamInboxId) {
                fetchMessage();
                playSound();
            }
        },
        [teamInboxId, fetchMessage, playSound]
    );

    useEffect(() => {
        subscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, fetchDataFromSocket);
        return () => {
            unsubscribeEvent(
                NEW_MESSAGE_RECEIVED_SOCKET_EVENT,
                fetchDataFromSocket
            );
        };
    }, [
        teamInboxId,
        fetchMessage,
        playSound,
        subscribeEvent,
        unsubscribeEvent,
        fetchDataFromSocket,
    ]);

    return {
        setSearch,
        search,
        flatData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        teamInboxId,
        isLoading,
        fetchMessage,
        queryClient,
        assignToMe,
        setAssignToMe,
    };
};
