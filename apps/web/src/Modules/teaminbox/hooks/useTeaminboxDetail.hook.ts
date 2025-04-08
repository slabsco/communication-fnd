import { useRouter } from 'next/router';
import React from 'react';
import { useEffectOnce } from 'react-use';

import {
    FetchData,
    RefetchGenericListing,
    useFetchParams,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NEW_MESSAGE_RECEIVED_SOCKET_EVENT } from '../../../Constants/socket.constant';
import { useSocket } from '../../../Utils/socket/socket.context';

export const useTeamInboxDetail = (teamInboxId: number) => {
    const { data: response, isLoading } = useQuery({
        cacheTime: Infinity,
        queryKey: ['team_inbox_messages', teamInboxId],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: TeamInboxController,
                method: 'messages',
                methodParams: teamInboxId,
                classParams: {
                    limit: 1000,
                },
            });

            if (!success) throw new Error('Failed to fetch messages');
            return response;
        },
    });

    return {
        response,
        isLoading,
    };
};
