import { useRouter } from 'next/router';
import { createContext, useContext } from 'react';

import { FetchData, useFetchParams, useQueryClient } from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';

import { useInfiniteQuery } from '@tanstack/react-query';

import { useSocket } from '../../../Utils/socket/socket.context.main';

interface TeamInboxContextType {
    teamInboxId?: number;
}

const TeamInboxContext = createContext<TeamInboxContextType>({});

export const useTeamInbox = () => useContext(TeamInboxContext);

export const TeamInboxProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { pathname } = useRouter();
    const { id: teamInboxId } = useFetchParams();
    const { subscribeEvent } = useSocket();

    const query = useQueryClient();

    // useEffectOnce(() => {
    //     if (!pathname.includes('team-inbox')) return;
    //     subscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, (data) => {
    //         if (data?.team_inbox_id === +teamInboxId) {
    //             query.invalidateQueries(['team_inbox_messages', teamInboxId]);
    //         }
    //     });
    // });

    return (
        <TeamInboxContext.Provider value={{ teamInboxId }}>
            {children}
        </TeamInboxContext.Provider>
    );
};
