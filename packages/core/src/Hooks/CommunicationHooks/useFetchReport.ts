import { useQuery } from '@tanstack/react-query';

import { BusinessReportController } from '../../backend/ap/business/controllers/business.report.controller';
import { FetchData } from '../useFetchData.hook';

export const useFetchReport = (
    slug: string,
    { params = {} }: { params?: any }
) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['business_report', slug, params],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: BusinessReportController,
                method: 'fetchData',
                classParams: {
                    ignore_all_dto: true,
                    slug,
                    ...params,
                },
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });
    return { data, isLoading };
};
