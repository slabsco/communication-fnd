import Link from 'next/link';

import {
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    IsUndefinedOrNull,
    Navigation,
    RefetchGenericListing,
    SCHEDULE_BROADCAST_LIST_ROUTE,
    toastBackendError,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { ScheduleBroadcastController } from '@finnoto/core/src/backend/communication/controller/schedule.broadcast.controller';
import {
    Button,
    FormBuilder,
    Modal,
    ModalBody,
    ModalContainer,
} from '@finnoto/design-system';

import { useQueryClient } from '@tanstack/react-query';

import { openTemplateViewer } from '../../your-templates/components/TemplateViewer.component';

const ScheduleBroadcastForm = ({ initialData }: any) => {
    const queryClient = useQueryClient();

    const schema: FormBuilderFormSchema = {
        name: {
            type: 'text',
            placeholder: 'Enter the name here',
            label: 'Name',
            required: true,
        },
        // sendNow: {
        //     type: 'radio_group',
        //     label: 'Send Now',
        //     options: [
        //         { label: 'Yes', value: true },
        //         { label: 'No', value: false },
        //     ],
        //     required: true,
        // },
        // scheduled_at: {
        //     type: 'date_time_separate',
        //     label: 'Schedule At',
        //     required: true,
        //     message:
        //         'Setting a date/time in the past will send the messages immediately',
        // },
        template_id: {
            type: 'reference_select',
            controller: CommunicationTemplateController,
            label: 'Template',
            placeholder: 'Select Template',
            required: true,
            displayMessage: (value) => {
                const data = value?.data;

                if (!data) return;
                return (
                    <div className='flex flex-col gap-2 py-3'>
                        <Button
                            onClick={() => openTemplateViewer(data?.id)}
                            size={'xs'}
                            appearance='accent'
                            outline
                        >
                            View Template
                        </Button>
                        <div className='flex gap-2 items-center'>
                            <p className='text-sm text-muted-foreground'>
                                Download the sample CSV file, fill it in the
                                required format, then upload it.{' '}
                                <Link
                                    href={data?.csv_url || '#'}
                                    className='text-sm font-medium text-primary hover:underline'
                                >
                                    Download Sample
                                </Link>
                            </p>
                        </div>
                    </div>
                );
            },
        },
        csv_link: {
            type: 'single_file_upload',
            label: 'Upload File',
            placeholder: 'Please upload your csv.',
            required: false,
        },
        description: {
            type: 'textarea',
            placeholder: 'Enter the description here',
            label: 'Description',
        },
    };

    const onSubmit: FormBuilderSubmitType = async (
        value: any,
        { setError }
    ) => {
        const { success, response } = await FetchData({
            className: ScheduleBroadcastController,
            method: 'create',
            classParams: {
                ...value,
                id: initialData?.id,
                csv_link: !IsUndefinedOrNull(value?.csv_link)
                    ? value?.csv_link?.[0]?.document_url
                    : initialData?.csv,
            },
        });

        if (!success) return toastBackendError(response);

        Navigation.navigate({
            url: `${SCHEDULE_BROADCAST_LIST_ROUTE}/${response.id}`,
        });
        RefetchGenericListing();

        queryClient.invalidateQueries({
            queryKey: ['schedule_detail'],
        });

        Modal.close();
    };

    return (
        <ModalContainer title={'Broadcast Message'}>
            <ModalBody className=''>
                <FormBuilder
                    initValues={{
                        name: initialData?.name,
                        scheduled_at: initialData?.scheduled_at || new Date(),
                        template_id: initialData?.template_id,
                        description: initialData?.description,
                    }}
                    onSubmit={onSubmit}
                    formSchema={schema}
                    buttonLabel='Send'
                />
            </ModalBody>
        </ModalContainer>
    );
};

export default ScheduleBroadcastForm;
