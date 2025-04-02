import { useQuery } from '@tanstack/react-query';

import { BusinessReportController } from '../../backend/ap/business/controllers/business.report.controller';
import { FetchData } from '../useFetchData.hook';

export const useFetchReport = (slug: string) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['business_report', slug],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: BusinessReportController,
                method: 'fetchData',
                classParams: {
                    slug,
                },
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });
    return { data, isLoading };
};
