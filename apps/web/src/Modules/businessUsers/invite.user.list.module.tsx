import { RefetchGenericListing, useBusinessUserHook } from '@finnoto/core';
import { ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { openBusinessUserInviteModal } from './business.user.invite.modal';

import { DeleteSvgIcon } from 'assets';

const InviteUserListModule = () => {
    const { removeUser, reInviteUser } = useBusinessUserHook({
        refetch: () => {
            RefetchGenericListing();
        },
    });
    const inviteUserProps: GenericDocumentListingProps = {
        name: 'Invited Users',
        type: 'invite_users',
        table: [
            { name: 'Email', key: 'email' },
            { name: 'Invited At', key: 'created_at', type: 'date_time' },
            { name: 'Accepted At', key: 'accepted_at', type: 'date_time' },
            { name: 'Rejected At', key: 'rejected_at', type: 'date_time' },
        ],
        actions: [
            {
                name: 'Invite User',
                type: 'create',
                action: openBusinessUserInviteModal,
            },
        ],
        rowActions: [
            {
                name: 'Remove',
                icon: DeleteSvgIcon,
                type: 'inner',
                isCancel: true,
                visible: (data) => {
                    if (data?.accepted_at || data?.rejected_at) return false;
                    return true;
                },
                action: (data) => {
                    ConfirmUtil({
                        isArc: true,
                        appearance: 'error',
                        title: `Remove ${data?.name} from the system ?`,
                        message:
                            'Are you sure you want to remove this user? This action cannot be undone and will permanently remove the user from the system.',
                        isReverseAction: true,
                        onConfirmPress: () => removeUser(data?.id),
                    });
                },
            },
            {
                name: 'Resend Invitation',
                type: 'inner',
                action: (data) => {
                    ConfirmUtil({
                        isArc: true,
                        appearance: 'success',
                        title: `Re invite user ?`,
                        message:
                            'Are you sure you want to re invite this user? This action cannot be undone ?',
                        isReverseAction: false,
                        onConfirmPress: () => reInviteUser(data?.id),
                    });
                },
            },
        ],
    };
    return <GenericDocumentListingComponent {...inviteUserProps} />;
};

export default InviteUserListModule;
