import { FormBuilderFormSchema } from '@finnoto/core';
import { BusinessPreferenceController } from '@finnoto/core/src/backend/ap/business/controllers/business.preference.controller';
import { ApiSchema, ModalFormUtil, Toast } from '@finnoto/design-system';

export const UpdateBusinessPreferenceForm = (
    data?: any,
    callback?: () => void
) => {
    const schema: FormBuilderFormSchema = {
        preference: {
            type: 'json-editor',
            label: 'Preference',
            required: true,
        },
    };

    const apiSchema: ApiSchema = {
        controller: BusinessPreferenceController,
        method: 'create',
        methodParams: data?.name,
        onSuccess: () => {
            Toast.success({
                description: 'Preference Changed',
            });
            callback?.();
        },
    };

    return new ModalFormUtil(schema, apiSchema).process({
        title: 'Update Preference',
        modal_type: 'modal',
        modalProps: {},
        formBuilderProps: {
            layout: 'one-column',
            withSaveAndNew: false,
        },
        initialValues: { preference: data?.preference },
    });
};
