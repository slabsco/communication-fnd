import {
    RefetchGenericListing,
    useBusinessUserHook,
    useUserHook,
} from '@finnoto/core';
import { Badge, ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { openBusinessUserReassignRoleModal } from './business.user.invite.modal';
import { setManager } from './set.manager.form.util';

import { DeleteSvgIcon } from 'assets';

const BusinessUsersListModule = () => {
    const { removeBusinessUser } = useBusinessUserHook({
        refetch: () => {
            RefetchGenericListing();
        },
    });

    const { isOwner, user } = useUserHook();

    const props: GenericDocumentListingProps = {
        name: 'Team Management',
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
            {
                name: 'Status',
                key: 'active',
                type: 'activate',
                dynamicStatus: (status, item) => {
                    if (isOwner(item.user_id)) return 'activate_badge';
                    if (user.id === item?.user_id) return 'activate_badge';
                    return 'activate';
                },
            },
            { name: 'Role', key: 'role' },
            { name: 'Manager', key: 'manager_name' },
            { name: 'Dialling Code', key: 'dialing_code' },
            { name: 'Mobile', key: 'mobile' },
        ],
        rowActions: [
            {
                name: 'Remove',
                icon: DeleteSvgIcon,
                type: 'inner',
                isCancel: true,
                visible: (data) => {
                    if (user.id === data?.user_id) return false;
                    if (isOwner(data.user_id)) return false;
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
            {
                name: 'Reassign Role',
                type: 'inner',
                visible: (data) => {
                    if (user.id === data?.user_id) return false;
                    if (isOwner(data.user_id)) return false;
                    return true;
                },
                action: (data) => {
                    openBusinessUserReassignRoleModal(data);
                },
            },
            {
                name: 'Set Manager',
                type: 'inner',
                visible: (data) => {
                    if (user.id === data?.user_id) return false;
                    if (isOwner(data.user_id)) return false;
                    return true;
                },
                action: (data) => {
                    setManager(
                        data.id,
                        {
                            assignee_id: data?.manager_id,
                        },
                        RefetchGenericListing
                    );
                },
            },
        ],
        tabFilterKey: 'role',
        tabs: [
            {
                title: 'Chat Agents',
                key: 'chat_agent',
                customFilterValue: {
                    role: 'Chat Agent',
                },
            },
            {
                title: 'Agent Managers',
                key: 'agent_manager',
                customFilterValue: {
                    role: 'Agent Manager',
                },
            },
            {
                title: 'Editors',
                key: 'editor',
                customFilterValue: {
                    role: 'Editor',
                },
            },
            {
                title: 'Admin',
                key: 'admin',
                customFilterValue: {
                    role: 'Admin',
                },
            },
        ],
    };

    return <GenericDocumentListingComponent {...props} />;
};

export default BusinessUsersListModule;
