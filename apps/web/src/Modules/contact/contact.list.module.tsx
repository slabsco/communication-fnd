import {
    BulkUploadTypeEnum,
    FetchData,
    IsEmptyArray,
    RefetchGenericListing,
    toastBackendError,
} from '@finnoto/core';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import { ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { openBulkUpload } from '../../Utils/functions.utils';
import { openAddContactForm } from './add.contact.modal.form';

import { AddSvgIcon, DeleteSvgIcon, EditSvgIcon } from 'assets';

const ContactListModule = () => {
    const deleteContact = async (id: number) => {
        const { success, response } = await FetchData({
            className: ContactController,
            method: 'remove',
            methodParams: id,
        });

        if (!success) return toastBackendError(response);
        RefetchGenericListing();
    };

    const props: GenericDocumentListingProps = {
        name: 'Contacts',
        type: 'contact',
        table: [
            { name: 'Name', key: 'display_name' },
            { name: 'Dialling Code', key: 'dialing_code' },
            { name: 'Mobile', key: 'mobile' },
            { name: 'active', key: 'active', type: 'activate' },
            {
                name: 'Custom Attributes',
                key: 'custom_attributes',
                renderValue: (value) => {
                    const att = value?.custom_attributes;
                    if (IsEmptyArray(att)) return '-';

                    return (
                        <div className='flex items-center'>
                            <div className='flex flex-wrap gap-3 items-center'>
                                {att?.map((val) => {
                                    return (
                                        <div
                                            key={val?.key}
                                            className='flex gap-2 items-center px-2 rounded bg-accent'
                                        >
                                            <span className='text-success'>
                                                {val?.key}:
                                            </span>
                                            <span className='text-success-content'>
                                                {val?.value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                },
            },
            { name: 'WA ID', key: 'wa_id' },
            { name: 'Managed By', key: 'manager' },
        ],
        rowActions: [
            {
                name: 'Edit',
                icon: EditSvgIcon,
                type: 'outer',
                action: (data) => {
                    openAddContactForm(data);
                },
            },
            {
                name: 'Delete',
                type: 'inner',
                icon: DeleteSvgIcon,
                isCancel: true,
                action: (rowData) => {
                    ConfirmUtil({
                        isArc: true,
                        appearance: 'error',
                        title: 'Delete Contact',
                        message:
                            'Are you sure you want to delete this contact? This action cannot be undone and will permanently remove the contact.',
                        isReverseAction: true,
                        onConfirmPress: () => deleteContact(rowData.id),
                    });
                },
            },
        ],

        actions: [
            {
                type: 'icon_btn',
                icon: AddSvgIcon,
                action: openAddContactForm,
                name: 'Add Contact',
                outline: true,
            },
            {
                name: 'Add Contact',
                type: 'action_btn',
                buttonActions: [
                    {
                        name: 'Bulk Upload',
                        type: 'action_btn',
                        action: () =>
                            openBulkUpload(BulkUploadTypeEnum.CONTACT, {
                                name: 'Contacts',
                            }),
                    },
                ],
            },
        ],
    };
    return <GenericDocumentListingComponent {...props} />;
};

export default ContactListModule;
