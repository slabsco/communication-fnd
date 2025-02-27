import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ClientConfigController } from '../../backend/communication/controller/client.config.controller';
import { FetchData } from '../useFetchData.hook';

export const useClientConfig = () => {
    const queryClient = useQueryClient();

    const { data: clientSecrets, isLoading: clientSecretsLoading } = useQuery({
        queryKey: ['client_config'],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: ClientConfigController,
                method: 'list',
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    const { mutateAsync: generateSecret } = useMutation({
        mutationKey: ['client_config'],
        onSuccess: () => {
            refetch();
        },
        mutationFn: async (options: { id: number; name: string }) => {
            const { response, success } = await FetchData({
                className: ClientConfigController,
                method: 'create',
                classParams: options,
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    const { mutate: changeStatus } = useMutation({
        mutationKey: ['client_config_status_change'],
        onSuccess: () => {
            refetch();
        },
        mutationFn: async (options: { id: number; currentStatus: boolean }) => {
            const { response, success } = await FetchData({
                className: ClientConfigController,
                methodParams: options?.id,
                method: options.currentStatus ? 'deactivate' : 'activate',
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    const refetch = () => {
        queryClient.invalidateQueries(['client_config']);
    };

    return {
        clientSecrets,
        clientSecretsLoading,
        generateSecret,
        changeStatus,
        refetch,
    };
};
