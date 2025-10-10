import { authenticateBusiness } from '@finnoto/core';
import { ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { addNewBusinessForm } from './forms/create.new.business.form';

const PartnerDashboard = () => {
    return (
        <GenericDocumentListingComponent
            actions={[
                {
                    name: 'Create Business',
                    action: addNewBusinessForm,
                    type: 'create',
                },
            ]}
            customBreadcrumbData={[{ name: 'Businesses' }]}
            name='Business'
            type='business_parent'
            table={[
                { name: 'Business Name', key: 'name' },

                { name: 'Created At', key: 'created_at', type: 'date_time' },
                {
                    name: 'Verified At',
                    key: 'Verified At',
                    type: 'date_time',
                },
                { name: 'Owner Name', key: 'owner' },
                { name: 'Owner Email', key: 'owner_email' },
            ]}
            rowActions={[
                {
                    name: 'Login',
                    action: (data) => {
                        ConfirmUtil({
                            isArc: true,
                            title: 'Switch to Another Business',
                            message:
                                'Switching businesses will log you into the selected business account. Please confirm to proceed.',
                            onConfirmPress: () => {
                                authenticateBusiness(
                                    {
                                        ...data,
                                        business_id: data?.id,
                                    },
                                    undefined
                                );
                            },
                        });
                    },
                },
            ]}
            customNoData={{
                button: undefined,
                description:
                    'Please create at least one business to see the list.',
            }}
        />
    );
};

export default PartnerDashboard;
