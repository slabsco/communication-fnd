import { addMinutes } from 'date-fns';

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

            const hasTemMinPassed =
                addMinutes(new Date(data?.created_at), 10) < new Date();
            if (hasTemMinPassed) return false;

            return !data?.completed_at ? 2000 : false;
        },
        refetchIntervalInBackground: false,
    });

    return {
        data,
        isFetching,
        isLoading,
    };
};
