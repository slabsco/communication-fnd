import {
    RefetchGenericListing,
    useBusinessUserHook,
    useUserHook,
} from '@finnoto/core';
import { Badge, ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';

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
            { name: 'Status', key: 'active', type: 'activate' },
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

    return <GenericDocumentListingComponent {...props} />;
};

export default BusinessUsersListModule;
