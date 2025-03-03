import { useQuery } from '@tanstack/react-query';

import { FetchData } from '../useFetchData.hook';

export const useLogs = ({ controller }) => {
    const { data: logs, isInitialLoading } = useQuery({
        queryKey: ['logs', controller],
        refetchInterval: 1000,
        initialData: [],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: controller,
                method: 'logs',
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    return { logs, isLoading: isInitialLoading };
};
