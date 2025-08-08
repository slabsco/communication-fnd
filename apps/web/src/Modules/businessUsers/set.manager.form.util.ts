import { FormBuilderFormSchema } from '@finnoto/core';
import { BusinessUserController } from '@finnoto/core/src/backend/common/controllers/business.user.controller';
import { ApiSchema, ModalFormUtil, Toast } from '@finnoto/design-system';

export const setManager = (
    buId: number,
    initial_data?: any,
    callback?: () => void
) => {
    const schema: FormBuilderFormSchema = {
        assignee_id: {
            type: 'reference_select',
            controller: BusinessUserController,
            label: 'Manager',
            placeholder: 'Select Manager',
            required: false,
            labelKey: 'name',
            sublabelKey: 'email',
            isClearable: true,
        },
    };

    const apiSchema: ApiSchema = {
        controller: BusinessUserController,
        method: 'addManager',
        methodParams: buId,
        onSuccess: () => {
            Toast.success({
                description: 'Manager Changed!!',
            });
            callback?.();
        },
    };

    return new ModalFormUtil(schema, apiSchema).process({
        title: 'Set Manager',
        modal_type: 'slidingPanel',
        slidingPanelProps: {},
        formBuilderProps: {
            layout: 'one-column',
            withSaveAndNew: false,
        },
        initialValues: initial_data,
    });
};
