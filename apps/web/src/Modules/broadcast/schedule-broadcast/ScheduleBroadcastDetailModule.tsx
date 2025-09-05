'use client';

import {
    AlertTriangleIcon,
    EyeIcon,
    ListIcon,
    MailCheckIcon,
    SendIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import {
    FormatDisplayDate,
    HOME_ROUTE,
    IsUndefinedOrNull,
    Navigation,
    SCHEDULE_BROADCAST_CREATION_ROUTE,
    useFetchParams,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Badge,
    Breadcrumbs,
    Button,
    cn,
    Container,
    Icon,
    Tooltip,
} from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../../Components/GenericDocumentListing/genericDocumentListing.component';
import { getErrorMessageTeamInbox } from '../../teaminbox/utils/teaminbox.utils';
import { openTemplateViewer } from '../your-templates/components/TemplateViewer.component';
import { useScheduleBroadCastDetail } from './hooks/useScheduleBroadcastDetail.hook';

import { ErrorSvgIcon } from 'assets';

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
                                message={getErrorMessageTeamInbox(data)}
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

    // Define the data object for the MetricCard components
    const metricData = [
        {
            key: 'sent',
            count: data?.attributes?.sent,
            name: 'Sent',
            icon: <SendIcon size={16} />,
            className: 'bg-green-100',
            isVisible: data?.attributes?.['sent'] ?? false,
        },
        {
            key: 'delivered',
            count: data?.attributes?.delivered,
            name: 'Delivered',
            icon: <MailCheckIcon size={16} />,
            className: 'bg-blue-100',
            isVisible: data?.attributes?.['delivered'] ?? false,
        },
        {
            key: 'read',
            count: data?.attributes?.read,
            name: 'Read',
            icon: <EyeIcon size={16} />,
            className: 'bg-yellow-100',
            isVisible: data?.attributes?.['read'] ?? false,
        },
        {
            key: 'error',
            count: data?.attributes?.error,
            name: 'Error',
            icon: <AlertTriangleIcon size={16} />,
            className: 'bg-red-100',
            isVisible: data?.attributes?.['error'] ?? false,
        },
        {
            key: 'total',
            count: data?.attributes?.total,
            name: 'Total',
            icon: <ListIcon size={16} />,
            className: 'bg-gray-100',
            isVisible: data?.attributes?.['total'] ?? false,
        },
    ];
    return (
        <Container className='flex flex-col p-6 mx-auto space-y-2'>
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
                        Navigation.navigate({
                            url: `${SCHEDULE_BROADCAST_CREATION_ROUTE}?id=${data.id}`,
                        });
                    }}
                >
                    Edit Detail
                </Button>
            </div>
            <div className='flex flex-wrap gap-2 items-center'>
                {metricData?.map((metric) => {
                    if (metric.isVisible === false) return;
                    return (
                        <MetricCard
                            key={metric.key}
                            count={metric.count}
                            name={metric.name}
                            icon={metric.icon}
                            className={metric.className}
                        />
                    );
                })}
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
            <div className='overflow-hidden flex-1 min-h-[500px]'>
                <GenericDocumentListingComponent
                    table={columns}
                    asInnerTable
                    type='schedule_broadcast'
                    searchMethod='messages'
                    searchMethodParams={id}
                    name='Scheduled Broadcast Lists'
                    tableWrapperClassName='overflow-hidden'
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
        (val) => val?.type === 'header'
    );

    const parameters = [
        ...(body?.parameters || []),
        ...(title?.parameters || []),
    ];

    const sample_contents = new Object();

    parameters.forEach((param) => {
        sample_contents[param?.parameter_name] = param?.text;
    });

    return sample_contents;
};

type MetricCardProps = {
    name: string;
    count: number;
    icon?: React.ReactNode;
    className?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({
    name,
    count,
    icon,
    className,
}) => {
    return (
        <div
            className={cn(
                'flex relative flex-col gap-1 px-2 py-1 bg-white rounded transition-transform min-w-[140px] hover:scale-105 whatsapp-metric-card'
                // className
            )}
        >
            <div className='flex gap-5 justify-between items-center w-full'>
                <span className='text-lg font-bold text-gray-800 drop-shadow-sm'>
                    {count}
                </span>
                <span className='flex justify-center items-center rounded-full shadow-inner text-inherit'>
                    {icon}
                </span>
            </div>
            <span className='text-sm'>{name}</span>
        </div>
    );
};
