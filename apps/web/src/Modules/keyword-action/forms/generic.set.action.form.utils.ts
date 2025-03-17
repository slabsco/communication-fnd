import { ActionDetailsController } from '@finnoto/core/src/backend/communication/controller/action.details.controller';
import { ActionTypeEnum } from '@finnoto/core/src/backend/communication/controller/keyword.details.controller';
import { ApiSchema, ModalFormUtil } from '@finnoto/design-system';

export const genericSetActionForm = (
    data?: any,
    options?: {
        callback?: (data: any) => any;
        otherFormSchema?: any;
        type_id: ActionTypeEnum;
        sanitizeParameter: (data) => {};
    }
) => {
    const isEdit = ModalFormUtil.isEdit(data);

    const formSchema = {
        name: {
            type: 'text',
            label: 'Material name',
            placeholder: 'Enter Material name here',
        },
        ...options?.otherFormSchema,
    };

    const apiSchema: ApiSchema = {
        controller: ActionDetailsController,
        method: 'create',
        sanitizeClassParamsData: (values) => {
            return {
                id: data?.id,
                type_id: options?.type_id,
                name: values?.name,
                parameters: options?.sanitizeParameter(values),
            };
        },
        onSuccess: (data) => {
            options?.callback?.(data);
        },
    };

    return new ModalFormUtil(formSchema, apiSchema).process({
        modal_type: 'slidingPanel',
        title: `${isEdit ? 'Edit' : 'Add'} Action`,
        slidingPanelProps: {},
        formBuilderProps: {
            withSaveAndNew: !isEdit ? true : false,
        },
        initialValues: data,
    });
};
