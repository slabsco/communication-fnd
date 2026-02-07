import { useMutation, useQuery } from '@tanstack/react-query';

import { SubscriptionController } from '../backend/communication/controller/subscription.controller';
import { toastBackendError } from '../Utils/common.utils';
import { FetchData } from './useFetchData.hook';

export const useSubscription = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['subscription'],
        cacheTime: Infinity,
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: SubscriptionController,
                method: 'mySubscription',
            });
            if (!success) return toastBackendError(response);
            return response;
        },
    });

    const { mutateAsync: renewSubscription } = useMutation({
        mutationFn: async (id: number) => {
            const { response, success } = await FetchData({
                className: SubscriptionController,
                method: 'renew',
                methodParams: id,
            });

            if (!success) return toastBackendError(response);
            return response;
        },
    });

    return { data, isLoading, error, renewSubscription };
};
