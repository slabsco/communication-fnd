import { createContext, useContext } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';

import {
    FetchData,
    Navigation,
    TEAM_INBOX_SPLIT_LIST,
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

    const { data: response, isLoading } = useQuery({
        cacheTime: Infinity,
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

    return (
        <TeamInboxContext.Provider
            value={{ teamInboxId, currentInboxDetail: response, isLoading }}
        >
            {children}
        </TeamInboxContext.Provider>
    );
};
