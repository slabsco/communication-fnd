import {
    CheckCircle,
    Clock,
    HeartPulse,
    LayoutTemplate,
    Link2,
    MessageCircle,
    Radio,
    UserIcon,
} from 'lucide-react';
import { useMemo } from 'react';

import {
    CopyToClipBoard,
    IsEmptyArray,
    Navigation,
    SCHEDULE_BROADCAST_LIST_ROUTE,
    useBusinessPreference,
    useFetchReport,
} from '@finnoto/core';
import {
    Button,
    Chart,
    cn,
    Container,
    FormatDisplayDateStyled,
    IconButton,
    Loading,
    NoDataFound,
    PageLoader,
} from '@finnoto/design-system';
import { ChartOptions } from '@finnoto/design-system/src/Components/Data-display/Chart/chart.types';

import {
    arcChartColors,
    customChartOptions,
    customChartTooltip,
} from '../../Constants/chart-constant/commonChartOption';
import LandingModule from '../landing/landing.module';
import { MultiColorBroadcastComponent } from '../template/components/multi.color.broadcast.component';
import DayWiseMessageChart from './day.wise.message.chart';

import { CopySvgIcon } from 'assets';

const MainDashboard = () => {
    const { businessInfo, verifyNumber, isBusinessInfoLoading } =
        useBusinessPreference();
    if (isBusinessInfoLoading) return <PageLoader />;

    return (
        <Container className='flex overflow-hidden relative flex-col py-4 transition-all'>
            <div className='gap-2 my-3 col-flex'>
                <LandingModule />
            </div>
            <div className='gap-3 col-flex'>
                <div className='grid grid-cols-1 gap-4 justify-center sm:grid-cols-2 lg:grid-cols-3'>
                    <Card title='Phone Number Status'>
                        <div className='flex gap-2 items-center my-2'>
                            <div
                                className={cn(
                                    'flex flex-1 gap-2 items-center text-error',
                                    {
                                        'text-success':
                                            businessInfo?.phone_registered_at,
                                    }
                                )}
                            >
                                <CheckCircle />
                                <p className='flex-1'>Connected</p>
                                {!businessInfo?.phone_registered_at ? (
                                    <Button
                                        onClick={async (next) => {
                                            await verifyNumber(
                                                businessInfo?.internal_number
                                            );
                                            next();
                                        }}
                                        progress
                                        size='xs'
                                        appearance='success'
                                    >
                                        Connect Number
                                    </Button>
                                ) : (
                                    <div className='flex gap-3 items-center p-1 rounded bg-base-200'>
                                        <IconButton
                                            size='xs'
                                            onClick={() => {
                                                CopyToClipBoard(
                                                    businessInfo?.default_mobile
                                                );
                                            }}
                                            name='Copy Mobile'
                                            icon={CopySvgIcon}
                                            outline
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {businessInfo?.default_mobile && (
                            <div className='flex gap-2 items-center p-1 rounded bg-base-200'>
                                <Link2 /> wa.me/{businessInfo?.default_mobile}{' '}
                                <IconButton
                                    size='xs'
                                    name='Copy Message link'
                                    onClick={() => {
                                        CopyToClipBoard(
                                            `https://wa.me/${businessInfo?.default_mobile}?text=Hello%20there!`
                                        );
                                    }}
                                    icon={CopySvgIcon}
                                    outline
                                />
                            </div>
                        )}
                    </Card>
                    <Card title='Total Messaging Limit'>
                        <div className='flex gap-2 items-center my-2'>
                            <MessageCircle />
                            <p className='flex-1'>
                                {businessInfo?.quality_response
                                    ?.messaging_limit_tier || 0}
                            </p>
                        </div>
                        <div className='flex gap-3 items-center p-1 rounded bg-base-200'>
                            {businessInfo?.total_message_limit || 0} Contacts/24
                            Hours
                        </div>
                    </Card>
                    <Card title='Health Status'>
                        <div className='flex gap-2 items-center my-2'>
                            <HeartPulse />
                            <p className='flex-1'>Quality Rating</p>
                        </div>
                        <div
                            className={`flex gap-3 rounded items-center p-1 ${
                                businessInfo?.quality_response
                                    ?.quality_rating === 'GREEN'
                                    ? 'bg-success/80 text-white'
                                    : businessInfo?.quality_response
                                          ?.quality_rating === 'YELLOW'
                                    ? 'bg-warning text-white'
                                    : 'bg-error text-white'
                            }`}
                        >
                            {businessInfo?.quality_response?.quality_rating ||
                                'ERROR'}
                        </div>
                    </Card>
                </div>
                <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
                    <Card title='Inbox Stats'>
                        <ExpiredActiveCard />
                    </Card>
                    <LastFiveBroadCast />
                </div>
                <DayWiseMessageChart />
            </div>
        </Container>
    );
};

export default MainDashboard;

const ExpiredActiveCard = () => {
    const { data, isLoading } = useFetchReport('teaminbox.stats.report.data', {
        params: {},
    });

    const finalData = useMemo(() => {
        if (!data) return;

        const activeData = data?.find((_data) => _data?.name === 'active_chat');
        const broadcastChat = data?.find(
            (_data) => _data?.name === 'broadcast_chat'
        );
        const expiredChat = data?.find(
            (_data) => _data?.name === 'expired_chat'
        );

        return {
            data_set: [
                activeData?.count || 0,
                broadcastChat?.count || 0,
                expiredChat?.count || 0,
            ],
            colors: [
                arcChartColors.success,
                arcChartColors.warning,
                arcChartColors.error,
            ],
            name: ['Active', 'Only Broadcast', 'Expired'],
        };
    }, [data]);

    const chartLabels = finalData?.name;
    const chartFinalData = finalData?.data_set;

    const options: ChartOptions = {
        ...customChartOptions,
        colors: finalData?.colors,
        barDistributedColors: true,
        showLegend: true,
        barBorderRadiusApply: 'end',
        formatLabelY: (value: number) => {
            return String(value);
        },
        tooltipCustom: (data) => {
            const { seriesIndex } = data;
            const activeData = chartFinalData[seriesIndex];
            return customChartTooltip(
                chartLabels,
                data,
                'pie',
                undefined,
                'number',
                activeData
            );
        },
    };

    if (isLoading)
        return (
            <div className='centralize h-[400px]'>
                <Loading color='primary' size='xl' />
            </div>
        );
    if (IsEmptyArray(data))
        return (
            <div className='centralize h-[400px]'>
                <NoDataFound />
            </div>
        );

    return (
        <div className='gap-3 p-4 w-full h-full col-flex'>
            <Chart
                type='pie'
                labels={chartLabels}
                height={'100%'}
                options={options}
                datasets={chartFinalData}
            />
        </div>
    );
};

const LastFiveBroadCast = () => {
    const { data } = useFetchReport('broadcast.stats.report.data', {
        params: {},
    });
    if (!data?.length) return <></>;

    return (
        <div className='grid grid-cols-2 gap-3'>
            {data?.map((_val) => {
                return (
                    <div
                        className='gap-4 col-flex cursor-pointer justify-between p-3 rounded border bg-base-100 hover:-translate-y-0.5 transition-all shadow'
                        onClick={() => {
                            Navigation.navigate({
                                url: `${SCHEDULE_BROADCAST_LIST_ROUTE}/${_val?.id}`,
                            });
                        }}
                        key={_val}
                    >
                        <div className='flex justify-between items-center'>
                            <div className='gap-1 col-flex'>
                                <span className='font-medium'>
                                    {_val?.name}
                                </span>

                                <div className='flex gap-2 items-center text-xs text-base-secondary'>
                                    <UserIcon size={14} />
                                    {_val?.creator}
                                </div>
                                <div className='flex gap-2 items-center text-xs text-base-secondary'>
                                    <LayoutTemplate size={14} />
                                    {_val?.template_name}
                                </div>
                                <div className='flex gap-2 items-center text-xs text-base-secondary'>
                                    <Clock size={14} />
                                    <FormatDisplayDateStyled
                                        value={_val?.initiated_at}
                                    />
                                </div>
                            </div>
                            <div className='flex items-center ml-2'>
                                <Radio />
                            </div>
                        </div>

                        <MultiColorBroadcastComponent data={_val} />
                    </div>
                );
            })}
        </div>
    );
};
const Card = ({
    children,
    className,
    title,
}: {
    children: any;
    className?: string;
    title?: string;
}) => {
    return (
        <div
            className={cn(
                'p-3 rounded-lg shadow-lg transition-all bg-base-100',
                className
            )}
        >
            <div className='text-lg font-medium'>{title}</div>
            {children}
        </div>
    );
};
