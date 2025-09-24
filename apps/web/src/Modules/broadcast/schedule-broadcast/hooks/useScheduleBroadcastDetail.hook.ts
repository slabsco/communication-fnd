import { useEffect } from 'react';

import { FetchData, useQuery, useRecursiveFetch } from '@finnoto/core';
import { ScheduleBroadcastController } from '@finnoto/core/src/backend/communication/controller/schedule.broadcast.controller';

export const useScheduleBroadCastDetail = (id: number) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['schedule_detail'],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: ScheduleBroadcastController,
                method: 'show',
                methodParams: id,
            });

            if (success) return response;
            Promise.reject();
        },
    });

    const [trigger] = useRecursiveFetch(refetch, {
        delay: 4000,
        repeat: Infinity,
    });

    useEffect(() => {
        if (data?.initiated_at && !data?.completed_at) {
            const initiatedAt = new Date(data.initiated_at).getTime();
            const now = Date.now();
            const diffInMs = now - initiatedAt;
            const oneHourInMs = 60 * 60 * 1000;
            if (diffInMs < oneHourInMs) {
                trigger();
            }
        }
        return () => {};
    }, [trigger, data]);

    return {
        data,
        isLoading,
    };
};
