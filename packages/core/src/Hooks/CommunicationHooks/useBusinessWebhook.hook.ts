import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { BusinessWebhookController } from '../../backend/common/controllers/business.webhook.controller';
import { Toast } from '../../Utils/toast.utils';
import { FetchData } from '../useFetchData.hook';

export const useBusinessWebhook = ({
    fetchInitial = true,
}: {
    fetchInitial?: boolean;
}) => {
    const invalidate = useQueryClient();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-business_webhook'],
        enabled: fetchInitial,
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: BusinessWebhookController,
                method: 'list',
            });

            if (success) return response;
        },
    });

    const { mutateAsync: createWebhook } = useMutation({
        onSuccess: () => {
            invalidate?.invalidateQueries(['get-business_webhook']);
        },
        mutationKey: ['create-business_webhook'],
        mutationFn: async (values) => {
            const { success, response } = await FetchData({
                className: BusinessWebhookController,
                method: 'create',
                classParams: values,
            });

            if (success) return response;
        },
    });

    const { mutateAsync: changeStatus } = useMutation({
        mutationKey: ['client_config_status_change'],
        onSuccess: () => {
            invalidate?.invalidateQueries(['get-business_webhook']);
        },
        mutationFn: async (options: { id: number; currentStatus: boolean }) => {
            const { response, success } = await FetchData({
                className: BusinessWebhookController,
                methodParams: options?.id,
                method: options.currentStatus ? 'deactivate' : 'activate',
            });

            if (!success) return Promise.reject('Error');
            Toast.success({ description: 'Status Changed' });
        },
    });

    const { mutate: removeWebhook } = useMutation({
        mutationKey: ['client_config_remove'],
        onSuccess: () => {
            invalidate?.invalidateQueries(['get-business_webhook']);
        },
        mutationFn: async (id) => {
            const { response, success } = await FetchData({
                className: BusinessWebhookController,
                methodParams: id,
                method: 'remove',
            });

            if (!success) return Promise.reject('Error');
            Toast.success({ description: 'Webhook Deleted' });
        },
    });
    return { data, isLoading, createWebhook, changeStatus, removeWebhook };
};
