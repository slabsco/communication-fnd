import { Toast } from '@finnoto/design-system';

import { useMutation, useQuery } from '@tanstack/react-query';

import { BusinessSettingsController } from '../../backend/common/controllers/business.settings.controller';
import { SetBusinessSettingsDto } from '../../backend/common/dtos/business.settings.dto';
import { toastBackendError } from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useBusinessSetting = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['business_setting'],
        cacheTime: Infinity,
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: BusinessSettingsController,
                method: 'getData',
            });

            if (success) return response;
            return toastBackendError(response);
        },
    });

    const { mutateAsync: setSettings } = useMutation({
        mutationKey: ['business_setting'],
        onSuccess: () => {
            refetch();
        },
        mutationFn: async (data: SetBusinessSettingsDto) => {
            const loading = Toast.loading({
                description: 'Updating settings....',
            });
            const { response, success } = await FetchData({
                className: BusinessSettingsController,
                method: 'set',
                classParams: data,
            });

            loading.hide();
            if (success)
                return Toast.success({ description: 'Settings Updated...' });
            return toastBackendError(response);
        },
    });

    return { data, isLoading, setSettings };
};
