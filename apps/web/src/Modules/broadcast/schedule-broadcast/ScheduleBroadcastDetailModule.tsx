'use client';

import { addMinutes } from 'date-fns';
import {
    AlertTriangleIcon,
    EyeIcon,
    HelpCircle,
    ListIcon,
    MailCheckIcon,
    SendIcon,
} from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';

import {
    FormatDisplayDate,
    HOME_ROUTE,
    Navigation,
    SCHEDULE_BROADCAST_CREATION_ROUTE,
    useFetchParams,
    USER_PROFILE_ROUTE,
    useUserHook,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import { Breadcrumbs, Button, cn, Container } from '@finnoto/design-system';

import GenericDefinitionListing from '../../../Components/GenericDocumentListing/genericDefinitionListing.component';
import { openTemplateViewer } from '../your-templates/components/TemplateViewer.component';
import { useScheduleBroadCastDetail } from './hooks/useScheduleBroadcastDetail.hook';

import { EyeSvgIcon } from 'assets';

const ScheduleBroadcastDetailModule = () => {
    const { id } = useFetchParams();
    const { data, remainingTimeForSending } = useScheduleBroadCastDetail(id);

    const { user } = useUserHook();

    const rightMetric = [
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
    ];

    const validData = data?.attributes?.sent + data?.attributes?.error;
    const unknown = data?.attributes?.total - validData;

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
            key: 'error',
            count: data?.attributes?.error,
            name: 'Error',
            icon: <AlertTriangleIcon size={16} />,
            className: 'bg-red-100',
            isVisible: data?.attributes?.['error'] ?? false,
        },
        {
            key: 'Unknown',
            count: unknown,
            name: 'Unknown',
            icon: <HelpCircle size={16} />, // Using react-icons/fi for a "help/unknown" icon
            className: 'bg-green-100',
            isVisible: unknown > 0,
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

    const enableEdit = useMemo(() => {
        const time = remainingTimeForSending;
        return time > 120; // Enable edit if more than 3 minutes (180 seconds) remain
    }, [remainingTimeForSending]);

    const isActive = useMemo(() => {
        if (data?.completed_at) return false;
        if (enableEdit) return false;

        // Make active if schedule_at is within 1 minute before or 2 minutes after now
        const now = new Date();
        const scheduleAtRaw = data?.scheduled_at;
        if (!scheduleAtRaw) return false;

        const scheduleAt = new Date(scheduleAtRaw);
        if (isNaN(scheduleAt.getTime())) return false;

        const diffSeconds = (scheduleAt.getTime() - now.getTime()) / 1000;
        if (diffSeconds <= 60 && diffSeconds >= -120) return true;

        return false;
    }, [data?.completed_at, data?.scheduled_at, enableEdit]);

    return (
        <Container
            className={cn('flex flex-col p-6 mx-auto space-y-2', {
                'animate-pulse': isActive,
            })}
        >
            <div className='flex justify-between items-center'>
                <Breadcrumbs
                    route={[
                        { name: 'Home', link: HOME_ROUTE },
                        { name: 'Schedule Detail ' },
                    ]}
                />

                <div className='flex gap-2 items-center'>
                    {!data?.initiated_at && enableEdit && (
                        <Button
                            appearance={'primary'}
                            color={'primary'}
                            onClick={() => {
                                Navigation.navigate({
                                    url: `${SCHEDULE_BROADCAST_CREATION_ROUTE}?id=${data.id}`,
                                });
                            }}
                        >
                            Edit Detail
                        </Button>
                    )}
                </div>
            </div>
            <div className={cn('flex justify-between items-center')}>
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
                <div className='flex flex-wrap gap-2 items-center'>
                    {rightMetric?.map((metric) => {
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
            </div>
            <div className={cn('grid grid-cols-2 gap-3', {})}>
                <div className='p-3 bg-white rounded transition-all hover:shadow'>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-lg font-semibold'>Detail</h3>
                        {!user?.mobile_verified_at && (
                            <Link href={USER_PROFILE_ROUTE}>
                                <span className='text-xs underline text-error'>
                                    ⚠️ Set your mobile number to get real time
                                    updates
                                </span>
                            </Link>
                        )}
                    </div>
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
                            name='Completed At'
                            value={FormatDisplayDate(data?.completed_at, true)}
                        />
                        <DataComponent
                            name={'Creator'}
                            value={
                                <div className='flex gap-2 items-end'>
                                    {data?.updator?.name}
                                </div>
                            }
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
                <GenericDefinitionListing
                    definitionKey='schedule_broadcast_messages'
                    asInnerTable
                    type='schedule_broadcast'
                    searchMethod='messages'
                    searchMethodParams={id}
                    name='Scheduled Broadcast Lists'
                    tableWrapperClassName='overflow-hidden'
                    tabFilterKey='status'
                    enableCsvDownload
                    tabs={[
                        {
                            title: 'Sent',
                            key: 'sent',
                            customFilterValue: { status: 'sent_at' },
                        },
                        {
                            title: 'Delivered',
                            key: 'delivered',
                            customFilterValue: { status: 'delivered_at' },
                        },
                        {
                            title: 'Read',
                            key: 'read',
                            customFilterValue: { status: 'read_at' },
                        },
                        {
                            title: 'Error',
                            key: 'error',
                            customFilterValue: { is_error: true },
                        },
                        {
                            title: 'Success',
                            key: 'success',
                            customFilterValue: { is_error: false },
                        },
                    ]}
                    rowActions={[
                        {
                            name: 'Preview',
                            icon: EyeSvgIcon,
                            action: (data) => {
                                openTemplateViewer(data?.template_id, {
                                    sample_contents: getSampleContent(data),
                                });
                            },
                            key: 'preview',
                            type: 'outer',
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
