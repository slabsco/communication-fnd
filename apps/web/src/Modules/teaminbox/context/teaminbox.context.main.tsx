import { createContext, useContext, useEffect } from 'react';

import {
    FetchData,
    StoreEvent,
    SubscribeToEvent,
    TEAM_INBOX_DETAIL_REFETCH,
    useFetchParams,
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
        enabled: !!teamInboxId,
        queryKey: ['team_inbox_detail', +teamInboxId],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: TeamInboxController,
                method: 'show',
                methodParams: teamInboxId,
            });

            if (!success) throw new Error('Failed to fetch messages');
            return response;
        },
    });

    useEffect(() => {
        SubscribeToEvent({
            eventName: TEAM_INBOX_DETAIL_REFETCH,
            callback: refetch,
        });

        let interval: NodeJS.Timeout | null = null;
        if (teamInboxId) {
            interval = setInterval(() => {
                refetch();
            }, 10000); // 10 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
            SubscribeToEvent({
                eventName: TEAM_INBOX_DETAIL_REFETCH,
                callback: refetch,
            });
        };
    }, [refetch, teamInboxId]);

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
