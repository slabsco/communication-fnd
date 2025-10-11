import { FormBuilderFormSchema, RefetchGenericListing } from '@finnoto/core';
import { BusinessPartnerController } from '@finnoto/core/src/backend/communication/controller/business.partner.controller';
import { ApiSchema, ModalFormUtil, Toast } from '@finnoto/design-system';

export const addNewBusinessForm = (
    callback?: (res: any) => void,
    id?: number
) => {
    const schema: FormBuilderFormSchema = {
        business_name: {
            type: 'text',
            label: 'Business Name',
            placeholder: 'Enter Business Name',
            required: true,
        },
        owner_email: {
            type: 'email',
            label: 'Owner Email',
            placeholder: 'Enter Owner Email',
            required: true,
        },
        owner_name: {
            type: 'text',
            label: 'Owner Name',
            placeholder: 'Enter Owner Name',
            required: true,
        },
        password: {
            type: 'password',
            label: 'Password',
            placeholder: 'Enter Password',
            required: true,
        },
    };

    const apiSchema: ApiSchema = {
        controller: BusinessPartnerController,
        method: 'create',
        onSuccess: (res) => {
            Toast.success({
                description: 'Updated Successfully!!',
            });
            RefetchGenericListing();
            callback?.(res);
        },
    };

    return new ModalFormUtil(schema, apiSchema).process({
        title: 'Create New Business',
        modal_type: 'slidingPanel',
        initialValueId: id,
        slidingPanelProps: {},
        formBuilderProps: {
            layout: 'one-column',
            withSaveAndNew: false,
        },
    });
};
