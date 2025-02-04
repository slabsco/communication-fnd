import { IsEmptyArray } from '@finnoto/core';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { openAddContactForm } from './add.contact.modal.form';

import { EditSvgIcon } from 'assets';

const ContactListModule = () => {
    const props: GenericDocumentListingProps = {
        name: 'Contacts',
        type: 'contact',
        table: [
            { name: 'Name', key: 'name' },
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
            { name: 'Managed By', key: 'creator' },
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
        ],

        actions: [
            { name: 'Add Contact', type: 'create', action: openAddContactForm },
        ],
    };
    return <GenericDocumentListingComponent {...props} />;
};

export default ContactListModule;
