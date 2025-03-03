import { ColorMode } from 'react-terminal-ui';

import {
    FormBuilderFormSchema,
    HOME_ROUTE,
    useBusinessWebhook,
    useFormBuilder,
    useLogs,
} from '@finnoto/core';
import { BusinessWebhookController } from '@finnoto/core/src/backend/common/controllers/business.webhook.controller';
import {
    ArcBreadcrumbs,
    Badge,
    Button,
    ConfirmUtil,
    Container,
    Loading,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    Table,
} from '@finnoto/design-system';

import LogTerminal from '../../Components/LogTerminal/logTerminal.component';

import { DeleteSvgIcon, EditSvgIcon } from 'assets';

const WebhookConfigModule = () => {
    const { data, isLoading, changeStatus, removeWebhook } = useBusinessWebhook(
        {}
    );
    return (
        <Container className='overflow-hidden gap-3 py-5 col-flex h-content-screen'>
            <ArcBreadcrumbs
                mainClassName='rounded py-4 rounded-none pb-2'
                title={'Configure Client'}
                route={[
                    { name: 'Home', link: HOME_ROUTE },
                    { name: 'Developers' },
                    { name: 'Webhook Config' },
                ]}
            />

            <div className='flex-1 gap-4 p-4 rounded col-flex bg-polaris-bg-surface'>
                <div className='flex justify-between'>
                    <div className='gap-1 col-flex'>
                        <h3 className='text-xl font-semibold'>Webhooks</h3>
                        <p className='text-base-secondary'>
                            You can add a webhook to receive event callbacks for
                            events such as new message received, when a message
                            is read, etc.
                        </p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <Button outline onClick={() => openLogModal()}>
                            Logs
                        </Button>
                        <Button
                            onClick={() => {
                                openAddWebhook();
                            }}
                        >
                            Add Webhook
                        </Button>
                    </div>
                </div>

                <div className='h-[500px] mt-4'>
                    <Table
                        loading={isLoading}
                        pagination={{ display: false }}
                        rowNumbering={false}
                        handleStatus={(
                            id: number,
                            isActive: boolean,
                            undefined,
                            callback: () => void
                        ) => {
                            changeStatus({ id, currentStatus: !isActive });
                            callback();
                        }}
                        column={[
                            { name: 'Url', key: 'url' },
                            { key: 'active', name: 'status', type: 'activate' },
                            {
                                name: 'Event Type',
                                key: 'event_type',
                                renderValue: (rowData) => {
                                    return (
                                        <div className='flex flex-wrap gap-1 items-center'>
                                            {rowData?.event_type?.map((val) => {
                                                return (
                                                    <Badge
                                                        label={val}
                                                        appearance='polaris-employee'
                                                        size='xs'
                                                        key={val}
                                                    />
                                                );
                                            })}
                                        </div>
                                    );
                                },
                            },
                            {
                                name: 'Last Updated',
                                key: 'updated_at',
                                type: 'date_time',
                            },
                        ]}
                        rowAction={{
                            menuActions: [
                                {
                                    name: 'Edit',
                                    type: 'outer',
                                    icon: EditSvgIcon,
                                    action: (rowData) => {
                                        openAddWebhook({
                                            initValues: rowData,
                                        });
                                    },
                                },
                                {
                                    name: 'Delete',
                                    type: 'inner',
                                    icon: DeleteSvgIcon,
                                    isCancel: true,
                                    action: (rowData) => {
                                        ConfirmUtil({
                                            isArc: true,
                                            appearance: 'error',
                                            title: 'Delete Webhook',
                                            message:
                                                'Are you sure you want to delete this webhook? This action cannot be undone and will permanently remove the webhook configuration.',
                                            isReverseAction: true,
                                            onConfirmPress: () =>
                                                removeWebhook(rowData.id),
                                        });
                                    },
                                },
                            ],
                        }}
                        data={data}
                    />
                </div>
            </div>
        </Container>
    );
};

export default WebhookConfigModule;

const openAddWebhook = (props?: any) => {
    Modal.open({ component: AddWebhookModal, props });
};

const AddWebhookModal = ({ initValues }: { initValues: any }) => {
    const { createWebhook } = useBusinessWebhook({});
    const schema: FormBuilderFormSchema = {
        url: {
            type: 'text',
            label: 'Webhook Url',
            name: 'url',
            placeholder: 'Enter Url Here',
        },
        events: {
            label: 'Events',
            type: 'reference_multi_select',
            controller_type: 'business_webhook',
            method: 'find',
            placeholder: 'Select the events here',
            valueKey: 'identifier',
        },
    };

    const onSubmit = async (values: any) => {
        await createWebhook({ ...values, id: initValues?.id });
        Modal.close();
    };
    const { renderFormFields, handleSubmit } = useFormBuilder({
        formSchema: schema,
        onSubmit,
        initValues: { url: initValues?.url, events: initValues?.event_type },
    });

    return (
        <ModalContainer title='Configure Webhook'>
            <ModalBody className='gap-3 col-flex'>
                {renderFormFields('url')}
                {renderFormFields('events')}
            </ModalBody>
            <ModalFooter>
                <Button defaultMinWidth onClick={handleSubmit}>
                    Save
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};

const LogModal = () => {
    const { logs, isLoading } = useLogs({
        controller: BusinessWebhookController,
    });
    if (isLoading)
        return (
            <div className='min-h-[500px] min-w-[500px] centralize'>
                <Loading color='primary' />;
            </div>
        );

    const items = logs?.map((val) => {
        return {
            type: 'log',
            time: new Date(val?.created_at),
            message: `${val?.response_code} /${val?.event?.identifier} / ${val?.attributes?.webhook_state?.url}  `,
            dropdownComponent: (
                <div className='mt-2'>
                    <h2 className='text-info'>Payload:</h2>
                    <p>URL: {val?.attributes?.webhook_state?.url}</p>

                    <ul className='list-item list-disc'>
                        {Object.entries(val?.payload || {}).map(
                            ([key, value]) => {
                                return (
                                    <div key={key} className='flex'>
                                        {key}:{' '}
                                        <p className='whitespace-pre-line'>
                                            {JSON.stringify(value)}
                                        </p>
                                    </div>
                                );
                            }
                        )}
                    </ul>
                    <h2 className='mt-2 text-success'>Response</h2>
                    <ul className='list-item list-disc'>
                        {JSON.stringify(val?.response_body)}
                    </ul>
                </div>
            ),
        };
    });
    return <LogTerminal theme={ColorMode.Dark} items={items} />;
};

const openLogModal = () => {
    Modal.open({ component: LogModal, modalSize: 'lg' });
};
