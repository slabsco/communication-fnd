import { BusinessUserController } from '@finnoto/core/src/backend/common/controllers/business.user.controller';
import { ActionDetailsController } from '@finnoto/core/src/backend/communication/controller/action.details.controller';
import { ActionTypeEnum } from '@finnoto/core/src/backend/communication/controller/keyword.details.controller';
import { ApiSchema, ModalFormUtil } from '@finnoto/design-system';

export const assignToUserFormUtil = (
    data?: any,
    options?: { callback?: () => any }
) => {
    const isEdit = ModalFormUtil.isEdit(data);

    const formSchema = {
        name: {
            type: 'text',
            label: 'Material name',
            placeholder: 'Enter Material name here',
        },
        user_id: {
            type: 'reference_select',
            controller: BusinessUserController,
            label: 'Assignee',
            placeholder: 'Select Assignee',
            required: true,
            labelKey: 'name',
            sublabelKey: 'email',
        },
    };

    const apiSchema: ApiSchema = {
        controller: ActionDetailsController,
        method: 'create',
        sanitizeClassParamsData: (values) => {
            return {
                id: data?.id,
                type_id: ActionTypeEnum.ASSIGN_TO_USER,
                name: values?.name,
                parameters: {
                    user_id: values?.user_id,
                },
            };
        },
        onSuccess: () => {
            options?.callback?.();
        },
    };

    console.log({ data });

    return new ModalFormUtil(formSchema, apiSchema).process({
        modal_type: 'slidingPanel',
        title: `${isEdit ? 'Edit' : 'Add'} User`,
        slidingPanelProps: {},
        formBuilderProps: {
            withSaveAndNew: !isEdit ? true : false,
        },
        initialValues: { ...data, user_id: data?.parameters?.user_id },
    });
};
