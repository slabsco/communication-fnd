'use client';

import Link from 'next/link';

import {
    FormatDisplayDate,
    GetDateValue,
    HOME_ROUTE,
    IsUndefinedOrNull,
    useFetchParams,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Badge,
    Breadcrumbs,
    Button,
    Container,
    Icon,
    Tooltip,
} from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../../Components/GenericDocumentListing/genericDocumentListing.component';
import { openTemplateViewer } from '../your-templates/components/TemplateViewer.component';
import { useScheduleBroadCastDetail } from './hooks/useScheduleBroadcastDetail.hook';
import { openScheduleBroadcast } from './ScheduleBroadcastTemplateListModule';

import { ErrorSvgIcon, InfoCircleSvgIcon } from 'assets';

const ScheduleBroadcastDetailModule = () => {
    const { id } = useFetchParams();
    const { data } = useScheduleBroadCastDetail(id);
    const columns: any = [
        {
            name: 'Dialing Code',
            key: 'dialing_code',
        },
        {
            name: 'Mobile',
            key: 'mobile',
        },
        {
            name: 'Send At',
            key: 'sent_at',
            type: 'date_time',
        },
        {
            name: 'Delivered At',
            key: 'delivered_at',
            type: 'date_time',
        },
        {
            name: 'Read At',
            key: 'read_at',
            type: 'date_time',
        },
        {
            name: 'Success',
            key: 'is_error',
            renderValue: (data) => {
                const isSuccess = !data?.is_error;
                return (
                    <div className='flex gap-2 items-center'>
                        <Badge
                            label={isSuccess ? 'Success' : 'Error'}
                            appearance={isSuccess ? 'success' : 'error'}
                        />
                        {!isSuccess && (
                            <Tooltip
                                asChild
                                message={data?.response?.error?.message}
                            >
                                <div className='cursor-pointer'>
                                    <Icon
                                        isSvg
                                        source={ErrorSvgIcon}
                                        iconColor='text-error'
                                    />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];
    return (
        <Container className='flex overflow-hidden flex-col p-6 mx-auto space-y-3 h-content-screen'>
            <div className='flex justify-between items-center'>
                <Breadcrumbs
                    route={[
                        { name: 'Home', link: HOME_ROUTE },
                        { name: 'Schedule Detail ' },
                    ]}
                />
                <Button
                    appearance={'primary'}
                    disabled={!IsUndefinedOrNull(data?.initiated_at)}
                    color={'primary'}
                    onClick={() => {
                        openScheduleBroadcast(data);
                    }}
                >
                    Edit Detail
                </Button>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <div className='p-3 bg-white rounded transition-all hover:shadow'>
                    <h3 className='text-lg font-semibold'>Detail</h3>
                    <div className='flex flex-col gap-2 p-2 mt-2 border-t'>
                        <DataComponent name={'Name'} value={data?.name} />
                        <DataComponent
                            name={'Description'}
                            value={data?.description}
                        />
                        <DataComponent
                            name={'File'}
                            value={
                                <Link className='link' href={data?.csv || ''}>
                                    Download Csv
                                </Link>
                            }
                        />
                        <DataComponent
                            name={'Schedule At'}
                            value={FormatDisplayDate(data?.scheduled_at, true)}
                        />
                        <DataComponent
                            name='Initiated At'
                            value={FormatDisplayDate(data?.initiated_at, true)}
                        />
                        <DataComponent
                            name='Completed_at'
                            value={FormatDisplayDate(data?.completed_at, true)}
                        />
                        <DataComponent
                            name={'Creator'}
                            value={data?.updator?.name}
                        />
                    </div>
                </div>
                <div className='p-3 bg-white rounded transition-all hover:shadow'>
                    <h3 className='text-lg font-semibold'>Template Detail</h3>
                    <div className='flex flex-col gap-2 p-2 mt-2 border-t'>
                        <DataComponent
                            name={'Name'}
                            value={
                                <Link
                                    className='link'
                                    href={`${WHATSAPP_TEMPLATE_LIST_ROUTE}/${data?.template_id}`}
                                >
                                    {data?.template?.name}
                                </Link>
                            }
                        />
                        <DataComponent
                            name={'Language'}
                            value={data?.template?.language?.name}
                        />
                        <DataComponent
                            name={'Category'}
                            value={data?.template?.category?.name}
                        />
                        <DataComponent
                            name={'Preview'}
                            value={
                                <Button
                                    size={'xs'}
                                    onClick={() => {
                                        openTemplateViewer(data?.template_id);
                                    }}
                                >
                                    See Here
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
            <div className='overflow-hidden flex-1'>
                <GenericDocumentListingComponent
                    table={columns}
                    asInnerTable
                    type='schedule_broadcast'
                    searchMethod='messages'
                    searchMethodParams={id}
                    name='Scheduled Broadcast Lists'
                    rowActions={[
                        {
                            name: 'Preview',
                            action: (data) => {
                                openTemplateViewer(data?.template_id, {
                                    sample_contents: getSampleContent(data),
                                });
                            },
                            key: 'preview',
                        },
                    ]}
                />
            </div>
        </Container>
    );
};

export default ScheduleBroadcastDetailModule;

const DataComponent = ({ name, value }: any) => {
    return (
        <p className='flex gap-2 justify-between items-center text-sm'>
            <span>{name}</span>
            <span className='text-secondary-foreground'>{value || '-'}</span>
        </p>
    );
};

const getSampleContent = (data: any) => {
    const body = data?.payload?.template?.components?.find(
        (val) => val?.type === 'body'
    );
    const title = data?.payload?.template?.components?.find(
        (val) => val?.type === 'title'
    );

    const parameters = [
        ...(body.parameters || []),
        ...(title?.parameters || []),
    ];

    const sample_contents = new Object();

    parameters.forEach((param) => {
        sample_contents[param?.parameter_name] = param?.text;
    });

    return sample_contents;
};
