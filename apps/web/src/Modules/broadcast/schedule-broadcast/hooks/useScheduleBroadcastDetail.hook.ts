import { addMinutes } from 'date-fns';
import { useMemo } from 'react';

import { FetchData, RefetchGenericListing, useQuery } from '@finnoto/core';
import { ScheduleBroadcastController } from '@finnoto/core/src/backend/communication/controller/schedule.broadcast.controller';

export const useScheduleBroadCastDetail = (id: number) => {
    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['schedule_detail'],
        onSuccess: () => {
            RefetchGenericListing();
        },
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: ScheduleBroadcastController,
                method: 'show',
                methodParams: id,
            });

            if (success) return response;
            Promise.reject();
        },
        refetchInterval: (data) => {
            if (!data) return;
            return !data?.completed_at ? 2000 : false;
        },
        refetchIntervalInBackground: false,
    });

    const remainingTimeForSending = useMemo(() => {
        if (!data?.scheduled_at) return 0;
        const scheduleTime = new Date(data.scheduled_at);
        const now = new Date();
        const diffMs = scheduleTime.getTime() - now.getTime();
        return Math.max(0, Math.floor(diffMs / 1000)); // return in seconds, never negative
    }, [data?.scheduled_at]);

    return {
        data,
        isFetching,
        isLoading,
        remainingTimeForSending,
    };
};
