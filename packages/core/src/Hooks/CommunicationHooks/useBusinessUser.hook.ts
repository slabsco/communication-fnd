import { Toast } from '@finnoto/design-system';

import { useMutation } from '@tanstack/react-query';

import { BusinessUserController } from '../../backend/common/controllers/business.user.controller';
import { BusinessUserInvitationController } from '../../backend/communication/controller/business.user.invitation.controller';
import { toastBackendError } from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useBusinessUserHook = ({
    refetch,
}: {
    refetch: (__: any) => void;
}) => {
    const { mutate: removeUser } = useMutation({
        mutationKey: ['business_user_removal'],

        mutationFn: async (id) => {
            const { response, success } = await FetchData({
                className: BusinessUserInvitationController,
                methodParams: id,
                method: 'remove',
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'User Removed' });

            refetch?.(response);
        },
    });

    const { mutate: inviteUser } = useMutation({
        mutationKey: ['invite_business_user'],
        mutationFn: async (values) => {
            const { response, success } = await FetchData({
                className: BusinessUserInvitationController,
                method: 'create',
                classParams: values,
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'User Invited' });
            refetch?.(response);
        },
    });

    return { removeUser, inviteUser };
};
