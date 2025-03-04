import { FormBuilderFormSchema, RefetchGenericListing } from '@finnoto/core';
import { BusinessUserController } from '@finnoto/core/src/backend/common/controllers/business.user.controller';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import { ApiSchema, ModalFormUtil, Toast } from '@finnoto/design-system';

export const addAssignee = (teamInboxId: number, initial_data?: any) => {
    const schema: FormBuilderFormSchema = {
        assignee_id: {
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
        controller: TeamInboxController,
        method: 'addAssignee',
        methodParams: teamInboxId,
        onSuccess: () => {
            Toast.success({
                description: 'Added Assignee!!',
            });
            RefetchGenericListing();
        },
    };

    return new ModalFormUtil(schema, apiSchema).process({
        title: 'Set Assignee',
        modal_type: 'slidingPanel',
        slidingPanelProps: {},
        formBuilderProps: {
            layout: 'one-column',
            withSaveAndNew: false,
        },
        initialValues: initial_data,
    });
};
