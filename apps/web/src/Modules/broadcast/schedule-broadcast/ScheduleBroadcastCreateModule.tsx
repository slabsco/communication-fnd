import Link from 'next/link';
import { useState } from 'react';

import {
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    HOME_ROUTE,
    IsUndefinedOrNull,
    Navigation,
    RefetchGenericListing,
    SCHEDULE_BROADCAST_LIST_ROUTE,
    toastBackendError,
    useFetchParams,
    useFormBuilder,
    useQuery,
    useQueryClient,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { ScheduleBroadcastController } from '@finnoto/core/src/backend/communication/controller/schedule.broadcast.controller';
import { Toast } from '@finnoto/core/src/Utils/toast.utils';
import {
    Breadcrumbs,
    Button,
    Container,
    Loading,
    Switch,
} from '@finnoto/design-system';
import { Label } from '@finnoto/design-system/src/Components/Inputs/InputField/label.component';

import { AsyncTemplateViewer } from '../your-templates/components/TemplateViewer.component';

const ScheduleBroadcastCreateModule = () => {
    const { id } = useFetchParams();

    const { data: initialData, isSuccess } = useQuery({
        queryKey: ['schedule_message_detail', id],
        enabled: !IsUndefinedOrNull(id),
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: ScheduleBroadcastController,
                method: 'show',
                methodParams: id,
            });

            if (success) return response; // Ensure to return the response for further use
            return Promise.reject();
        },
    });

    if (!IsUndefinedOrNull(id) && !isSuccess)
        return (
            <div className='flex justify-center items-center h-content-screen'>
                <Loading color='primary' size='xl' />
            </div>
        );

    if (IsUndefinedOrNull(id)) return <DetailPage />;
    return <DetailPage initialData={initialData} />;
};

const DetailPage = ({ initialData }: any) => {
    const queryClient = useQueryClient();

    const [isNow, setIsNow] = useState<any>(false);
    const [templateData, setTemplateData] = useState<any>();

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
        },
        csv_link: {
            type: 'single_file_upload',
            label: 'Upload File',
            placeholder: 'Please upload your csv.',
            fileSupportText: 'CSV',
            required: true,
        },
        description: {
            type: 'textarea',
            placeholder: 'Enter the description here',
            label: 'Description',
            required: false,
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

        Toast.success({ description: 'Successful !!' });

        Navigation.navigate({
            url: `${SCHEDULE_BROADCAST_LIST_ROUTE}/${response.id}`,
        });

        RefetchGenericListing();
        queryClient.invalidateQueries({
            queryKey: ['schedule_detail'],
        });
    };

    const { renderFormFields, handleSubmit, watch, hasError } = useFormBuilder({
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
        <Container className='overflow-hidden gap-4 py-6 h-content-screen col-flex'>
            <Breadcrumbs
                title={'Broadcast Mesage'}
                route={[
                    { name: 'Home', link: HOME_ROUTE },
                    {
                        name: 'Broadcast Messages',
                        link: SCHEDULE_BROADCAST_LIST_ROUTE,
                    },
                    {
                        name: 'Create',
                    },
                ]}
            />

            <div className='grid flex-1 grid-cols-3 gap-6 p-1 rounded bg-polaris-bg-surface'>
                <div className='overflow-y-auto col-span-2 gap-3 p-3 col-flex bg-polaris-bg-surface-secondary'>
                    {renderFormFields('name')}
                    <div className='gap-2 col-flex'>
                        {!isNow && renderFormFields('scheduled_at')}
                        <div className='col-flex'>
                            <Label label='Send Now' />
                            <Switch
                                checked={isNow}
                                onChange={(e) => setIsNow(e)}
                            />
                        </div>
                    </div>
                    <div className='gap-2 p-4 rounded col-flex bg-polaris-bg-surface'>
                        {renderFormFields('template_id')}
                        {templateData?.csv_url && (
                            <div className='flex gap-2 items-center'>
                                <p className='text-sm text-muted-foreground'>
                                    Download the sample CSV file, fill it in the
                                    required format, then upload it.{' '}
                                    <Link
                                        href={templateData?.csv_url || '#'}
                                        className='text-sm font-medium text-primary hover:underline'
                                    >
                                        Download Sample
                                    </Link>
                                </p>
                            </div>
                        )}
                        <div>
                            {renderFormFields('csv_link')}
                            <div className='p-2 mt-3 text-xs bg-warning text-warning-content'>
                                Note* Please very the csv before you upload and
                                save
                            </div>
                        </div>
                    </div>

                    {renderFormFields('description')}
                </div>
                <div className='flex justify-center items-center p-3 rounded bg-primary'>
                    <AsyncTemplateViewer
                        getData={(data) => {
                            setTemplateData(data);
                        }}
                        id={watch('template_id')}
                    />
                </div>
            </div>

            <div className='gap-4 justify-end p-2 row-flex bg-polaris-bg-surface'>
                <Button
                    appearance='errorHover'
                    onClick={() => Navigation.back()}
                >
                    Cancel
                </Button>
                <Button
                    defaultMinWidth
                    disabled={hasError()}
                    appearance='primary'
                    progress
                    onClick={async (next) => {
                        await handleSubmit(next);
                        next();
                    }}
                >
                    Save
                </Button>
            </div>
        </Container>
    );
};

export default ScheduleBroadcastCreateModule;
