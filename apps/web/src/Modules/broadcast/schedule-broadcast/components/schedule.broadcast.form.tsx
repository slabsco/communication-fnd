import Link from 'next/link';
import { useState } from 'react';

import {
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    IsUndefinedOrNull,
    Navigation,
    RefetchGenericListing,
    SCHEDULE_BROADCAST_LIST_ROUTE,
    toastBackendError,
    useFormBuilder,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { ScheduleBroadcastController } from '@finnoto/core/src/backend/communication/controller/schedule.broadcast.controller';
import {
    Button,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    Switch,
} from '@finnoto/design-system';
import { Label } from '@finnoto/design-system/src/Components/Inputs/InputField/label.component';

import { useQueryClient } from '@tanstack/react-query';

import { openTemplateViewer } from '../../your-templates/components/TemplateViewer.component';

const ScheduleBroadcastForm = ({ initialData }: any) => {
    const queryClient = useQueryClient();

    const [isNow, setIsNow] = useState<any>(false);

    const schema: FormBuilderFormSchema = {
        name: {
            type: 'text',
            placeholder: 'Enter the name here',
            label: 'Name',
            required: true,
        },
        scheduled_at: {
            type: 'date_time_separate',
            label: 'Schedule At',
            name: 'Schedule At',
            required: false,
        },
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

    const { renderFormFields, handleSubmit } = useFormBuilder({
        onSubmit,
        formSchema: schema,
        initValues: {
            name: initialData?.name,
            scheduled_at: initialData?.scheduled_at || new Date(),
            template_id: initialData?.template_id,
            description: initialData?.description,
        },
    });

    return (
        <ModalContainer title={'Broadcast Message'}>
            <ModalBody className='gap-2 col-flex'>
                {renderFormFields('name')}
                <div className='gap-2 col-flex'>
                    {!isNow && renderFormFields('scheduled_at')}
                    <div className='col-flex'>
                        <Label label='Send Now' />
                        <Switch checked={isNow} onChange={(e) => setIsNow(e)} />
                    </div>
                </div>
                {renderFormFields('template_id')}
                {renderFormFields('description')}
            </ModalBody>

            <ModalFooter className='py-4 justify'>
                <div className='flex-1 gap-4 row-flex'>
                    <Button
                        appearance='errorHover'
                        onClick={() => Modal.close()}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance='primary'
                        className='flex-1'
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </div>
            </ModalFooter>
        </ModalContainer>
    );
};

export default ScheduleBroadcastForm;
