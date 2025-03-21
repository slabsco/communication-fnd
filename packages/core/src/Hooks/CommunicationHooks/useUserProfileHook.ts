import { Toast } from '@finnoto/design-system';

import { useMutation } from '@tanstack/react-query';

import { UserProfileController } from '../../backend/communication/controller/user.profile.controller';
import { Authentication } from '../../Utils/authentication';
import { toastBackendError } from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useUserProfileHook = () => {
    const refetchAuth = () => {
        Authentication.refreshUserData();
    };

    const { mutateAsync: changeProfilePicture } = useMutation({
        mutationFn: async (image_url: string) => {
            const { response, success } = await FetchData({
                className: UserProfileController,
                method: 'updateProfilePicture',
                classParams: {
                    image_url,
                },
            });

            if (!success) return toastBackendError(response);
            refetchAuth();
            Toast.success({ description: 'Updated Profile Picture' });
        },
    });
    const { mutateAsync: changeMobile } = useMutation({
        mutationFn: async (values: {
            otp: string;
            mobile: string;
            dialing_code: string;
        }) => {
            console.log({ values });

            const { response, success } = await FetchData({
                className: UserProfileController,
                method: 'verifyMobile',
                classParams: {
                    ...values,
                },
            });

            if (!success) return toastBackendError(response);

            if (response?.sent_otp) {
                Toast.success({ description: 'Otp Sent Successful' });
            }
            if (response?.mobile_verified_at) {
                Toast.success({
                    description: 'Successfully Change mobile number',
                });
            }

            return response;
        },
    });

    return { changeProfilePicture, changeMobile };
};
