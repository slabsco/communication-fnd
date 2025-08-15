import { createContext, useContext, useEffect } from 'react';

import {
    FetchData,
    StoreEvent,
    SubscribeToEvent,
    TEAM_INBOX_DETAIL_REFETCH,
    useFetchParams,
    useRecursiveFetch,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';

import { useQuery } from '@tanstack/react-query';

interface TeamInboxContextType {
    teamInboxId?: number;
    currentInboxDetail?: any;
    isLoading?: boolean;
}

const TeamInboxContext = createContext<TeamInboxContextType>({});

export const useTeamInbox = () => useContext(TeamInboxContext);

export const TeamInboxProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { id: teamInboxId } = useFetchParams();

    const {
        data: response,
        isLoading,
        refetch,
    } = useQuery({
        cacheTime: Infinity,
        queryKey: ['team_inbox_detail', +teamInboxId],
        queryFn: async () => {
            if (!teamInboxId) return;
            const { success, response } = await FetchData({
                className: TeamInboxController,
                method: 'show',
                methodParams: teamInboxId,
            });

            if (!success) throw new Error('Failed to fetch messages');
            return response;
        },
    });

    const [startRefetching] = useRecursiveFetch(refetch, {
        delay: 10000,
        repeat: Infinity,
    });

    useEffect(() => {
        startRefetching();
        SubscribeToEvent({
            eventName: TEAM_INBOX_DETAIL_REFETCH,
            callback: refetch,
        });

        () => {
            SubscribeToEvent({
                eventName: TEAM_INBOX_DETAIL_REFETCH,
                callback: refetch,
            });
        };
    }, [refetch, startRefetching]);

    return (
        <TeamInboxContext.Provider
            value={{ teamInboxId, currentInboxDetail: response, isLoading }}
        >
            {children}
        </TeamInboxContext.Provider>
    );
};

export const RefetchTeamInboxDetail = () => {
    StoreEvent({ eventName: TEAM_INBOX_DETAIL_REFETCH });
};
