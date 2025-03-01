import { Toast } from '@finnoto/design-system';

import { useMutation, useQuery } from '@tanstack/react-query';

import { BusinessController } from '../../backend/communication/controller/business.controller';
import { toastBackendError } from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useBusinessPreference = (options?: {
    enableWhatsappProfileInfo: boolean;
}) => {
    const {
        data: businessInfo,
        isLoading: isBusinessInfoLoading,
        refetch: refetchBusinessInfo,
    } = useQuery({
        queryKey: ['business_info'],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: BusinessController,
                method: 'show',
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    const { mutateAsync: verifyNumber } = useMutation({
        onSuccess: () => {
            refetchBusinessInfo();
        },
        mutationFn: async (id: string) => {
            const { response, success } = await FetchData({
                className: BusinessController,
                method: 'verifyNumber',
                methodParams: id,
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    const { data: healthStatusData } = useQuery({
        queryKey: ['wa-health'],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: BusinessController,
                method: 'getWaHealth',
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    const { data: whatsappProfileInfo, refetch: getWaProfileData } = useQuery({
        queryKey: ['wa-profile'],
        enabled: options?.enableWhatsappProfileInfo || true,
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: BusinessController,
                method: 'getWaProfile',
            });

            if (success) return response;
            return Promise.reject('Error');
        },
    });

    const { mutateAsync: changeProfileData, isLoading: changingProfile } =
        useMutation({
            onSuccess: () => {
                getWaProfileData();
            },
            mutationFn: async (values: any) => {
                const { response, success } = await FetchData({
                    className: BusinessController,
                    method: 'updateWaProfile',
                    classParams: { data: values },
                });

                if (response?.data?.error)
                    return toastBackendError(
                        undefined,
                        response?.data?.error?.error_user_msg
                    );

                Toast.success({ description: 'Profile Uploaded Successfully' });
            },
        });

    return {
        businessInfo,
        isBusinessInfoLoading,
        verifyNumber,
        healthStatusData,
        whatsappProfileInfo,
        changeProfileData,
        changingProfile,
    };
};
