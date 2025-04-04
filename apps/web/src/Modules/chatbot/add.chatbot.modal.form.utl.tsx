import { FormBuilderFormSchema, RefetchGenericListing } from '@finnoto/core';
import { ChatbotFLowController } from '@finnoto/core/src/backend/communication/controller/chatbot.flow.controller';
import { ApiSchema, ModalFormUtil, Toast } from '@finnoto/design-system';

export const addChatbotFormUtil = (
    callback?: (res: any) => void,
    id?: number
) => {
    const schema: FormBuilderFormSchema = {
        name: {
            type: 'text',
            label: 'Name',
            placeholder: 'Enter name here',
            required: true,
        },
        description: {
            type: 'textarea',
            label: 'Description',
            placeholder: 'description here',
            required: false,
        },
    };

    const apiSchema: ApiSchema = {
        controller: ChatbotFLowController,
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
        title: id ? 'Edit Chatbot Detail' : 'Create Chatbot',
        modal_type: 'slidingPanel',
        initialValueId: id,
        slidingPanelProps: {},
        formBuilderProps: {
            layout: 'one-column',
            withSaveAndNew: false,
        },
    });
};
