import {
    FormBuilderFormSchema,
    IsEmptyObject,
    RefetchGenericListing,
} from '@finnoto/core';
import { QuickReplyController } from '@finnoto/core/src/backend/communication/controller/quick.reply.controller';
import { ApiSchema, ModalFormUtil, Toast } from '@finnoto/design-system';

export const addQuickReplyFormUtil = (initial_data: any) => {
    const schema: FormBuilderFormSchema = {
        name: {
            type: 'text',
            placeholder: 'Morning Greeting',
            label: 'Name',
            required: true,
        },
        shortcut: {
            type: 'text',
            placeholder: 'MrgGreet',
            label: 'Shortcut',
            prefix: <div>/</div>,
            required: true,
            maxLength: 20,
        },
        message: {
            type: 'textarea',
            placeholder: 'Good Morning {{name}}, how are you doing ?',
            label: 'Message',
            required: true,
            maxLength: 200,
            colSpan: 2,
        },
        document: {
            type: 'single_file_upload',
            title: 'Upload Image/Video/Document',
            placeholder: 'Upload your document',
            label: 'Document',
            required: false,
            colSpan: 2,
        },
    };

    const apiSchema: ApiSchema = {
        controller: QuickReplyController,
        method: 'create',
        onSuccess: () => {
            RefetchGenericListing();
            Toast.success({
                description: 'Quick Reply Added Successfully',
            });
        },
    };

    return new ModalFormUtil(schema, apiSchema).process({
        title: 'Add Quick Reply',
        modal_type: 'modal',
        modalProps: {
            modalSize: 'md',
        },
        formBuilderProps: {
            layout: 'two-column',
            withSaveAndNew: IsEmptyObject(initial_data),
        },
        initialValues: initial_data,
    });
};
