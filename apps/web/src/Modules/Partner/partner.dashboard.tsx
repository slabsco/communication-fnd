import {
    differenceInDays,
    differenceInMonths,
    differenceInYears,
} from 'date-fns';

import {
    FetchData,
    RefetchGenericListing,
    authenticateBusiness,
    toastBackendError,
} from '@finnoto/core';
import { BusinessPartnerController } from '@finnoto/core/src/backend/communication/controller/business.partner.controller';
import { ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { addNewBusinessForm } from './forms/create.new.business.form';

const formatActiveDuration = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '-';
    const start = new Date(dateStr);
    const now = new Date();

    const totalDays = differenceInDays(now, start);
    if (totalDays < 1) return 'Today';

    const years = differenceInYears(now, start);
    const afterYears = new Date(
        start.getFullYear() + years,
        start.getMonth(),
        start.getDate()
    );
    const months = differenceInMonths(now, afterYears);
    const afterMonths = new Date(
        afterYears.getFullYear(),
        afterYears.getMonth() + months,
        afterYears.getDate()
    );
    const days = differenceInDays(now, afterMonths);

    if (years > 0) {
        const parts = [`${years}y`];
        if (months > 0) parts.push(`${months}mo`);
        if (days > 0) parts.push(`${days}d`);
        return parts.join(' ');
    }
    if (months > 0) {
        return days > 0 ? `${months}mo ${days}d` : `${months}mo`;
    }
    return `${totalDays}d`;
};

const PartnerDashboard = () => {
    const deleteBusiness = async (id: number) => {
        const { success, response } = await FetchData({
            className: BusinessPartnerController,
            method: 'remove',
            methodParams: id,
        });
        if (!success) return toastBackendError(response);
        RefetchGenericListing();
    };

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
                { name: 'Owner Name', key: 'owner' },
                { name: 'Owner Email', key: 'owner_email' },
                { name: 'Added At', key: 'created_at', type: 'date_time' },
                {
                    name: 'Verified At',
                    key: 'verified_at',
                    type: 'date_time',
                },
                {
                    name: 'First Message Sent At',
                    key: 'first_message_sent_at',
                    type: 'date_time',
                },
                {
                    name: 'Active Since',
                    key: 'first_message_sent_at',
                    renderValue: (data: any) =>
                        formatActiveDuration(data?.first_message_sent_at),
                },
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
                {
                    name: 'Delete',
                    isCancel: true,
                    action: (rowData) => {
                        ConfirmUtil({
                            isArc: true,
                            appearance: 'error',
                            title: 'Delete Business',
                            message:
                                'Are you sure you want to delete this business? This action cannot be undone and will permanently remove the business.',
                            isReverseAction: true,
                            onConfirmPress: () => deleteBusiness(rowData.id),
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
