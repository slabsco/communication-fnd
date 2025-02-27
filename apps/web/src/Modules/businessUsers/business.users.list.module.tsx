import {
    RefetchGenericListing,
    useBusinessUserHook,
    useUserHook,
} from '@finnoto/core';
import { Badge, ConfirmUtil } from '@finnoto/design-system';

import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import GenericAnimatedTabListing from '../../Components/GenericDocumentListing/genericTabAnimation.component';
import { openBusinessUserInviteModal } from './business.user.invite.modal';

import { DeleteSvgIcon } from 'assets';

const BusinessUsersListModule = () => {
    const { removeUser, removeBusinessUser } = useBusinessUserHook({
        refetch: () => {
            RefetchGenericListing();
        },
    });

    const { isOwner, user } = useUserHook();

    const props: GenericDocumentListingProps = {
        name: 'Business Users',
        type: 'business_users',
        table: [
            {
                name: 'Name',
                key: 'name',
                renderValue: (data) => {
                    return (
                        <div className='flex gap-2 items-center'>
                            {data?.name}
                            {isOwner(data.user_id) && (
                                <Badge
                                    size='xs'
                                    appearance='polaris-info'
                                    label={'owner'}
                                />
                            )}
                        </div>
                    );
                },
            },
            { name: 'Email', key: 'email' },
            { name: 'Status', key: 'active', type: 'activate' },
            { name: 'Dialling Code', key: 'dialing_code' },
            { name: 'Mobile', key: 'mobile' },
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
                    if (user.id === data?.user_id) return false;
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
                        onConfirmPress: () => removeBusinessUser(data?.id),
                    });
                },
            },
        ],
    };
    const inviteUserProps: GenericDocumentListingProps = {
        name: 'Invite Users',
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
        ],
    };
    return (
        <GenericAnimatedTabListing
            tabs_item={[
                {
                    tabName: 'Business Users',
                    tabKey: 'business_user',
                    listingProps: props,
                },
                {
                    tabName: 'Invited Users',
                    tabKey: 'invited_users',
                    listingProps: inviteUserProps,
                },
            ]}
        />
    );
};

export default BusinessUsersListModule;
