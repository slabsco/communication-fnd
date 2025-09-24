import {
    CheckCircle,
    Clock,
    HeartPulse,
    LayoutTemplate,
    Link2,
    MessageCircle,
    MonitorSpeaker,
    Radio,
    UserIcon,
} from 'lucide-react';
import { useMemo } from 'react';

import {
    CopyToClipBoard,
    HOME_ROUTE,
    IsEmptyArray,
    Navigation,
    SCHEDULE_BROADCAST_LIST_ROUTE,
    useBusinessPreference,
    useFetchReport,
} from '@finnoto/core';
import {
    Breadcrumbs,
    Button,
    Chart,
    cn,
    Container,
    FormatDisplayDateStyled,
    IconButton,
    Loading,
    NoDataFound,
} from '@finnoto/design-system';
import { ChartOptions } from '@finnoto/design-system/src/Components/Data-display/Chart/chart.types';

import DashboardChartLabels from '../../Components/Dashboard/dashboard.chart.labels';
import {
    arcChartColors,
    customChartOptions,
    customChartTooltip,
} from '../../Constants/chart-constant/commonChartOption';
import { MultiColorBroadcastComponent } from '../broadcast/multi.color.broadcast.component';

import { CopySvgIcon } from 'assets';

const MainDashboard = () => {
    const { businessInfo, verifyNumber } = useBusinessPreference();

    return (
        <Container className='flex overflow-hidden relative flex-col gap-5 py-6 h-content-screen'>
            <div className='flex justify-between items-center'>
                <Breadcrumbs
                    route={[
                        { name: 'Home', link: HOME_ROUTE },
                        {
                            name: 'Dashboard',
                        },
                    ]}
                />
            </div>

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
                            businessInfo?.quality_response?.quality_rating ===
                            'GREEN'
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

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Card title='Inbox Stats'>
                    <ExpiredActiveCard />
                </Card>
                <LastFiveBroadCast />
            </div>
        </Container>
    );
};

export default MainDashboard;

const ExpiredActiveCard = () => {
    const { data, isLoading } = useFetchReport('teaminbox.stats.report.data');

    const chartLabels = useMemo(() => ['Active', 'Expired'], []);

    const chartFinalData = [
        { name: 'Count', data: [data?.[0]?.count, data?.[1]?.count] },
    ];

    const colors = useMemo(
        () => [
            arcChartColors.success, // Delivered messages
            arcChartColors.error, // Error messages
        ],
        []
    );
    const options: ChartOptions = {
        ...customChartOptions,
        colors: colors,
        barDistributedColors: true,
        showLegend: false,
        barColumnWidth: '15%',
        barBorderRadiusApply: 'end',
        formatLabelY: (value: number) => {
            return String(value);
        },
        tooltipCustom: (data) => {
            const { dataPointIndex } = data;
            const activeData = chartFinalData[0]?.data[dataPointIndex];

            return customChartTooltip(
                chartLabels,
                data,
                'bar',
                activeData[0]?.count,
                'number',
                activeData[0]?.amount
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
        <Chart
            type='bar'
            labels={chartLabels}
            height={400}
            options={options}
            datasets={chartFinalData}
        />
    );
};

const LastFiveBroadCast = () => {
    const { data, isLoading } = useFetchReport('broadcast.stats.report.data');

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
                'p-3 rounded-lg shadow-lg bg-base-100 hover:-translate-y-0.5 transition-all',
                className
            )}
        >
            <div className='text-lg font-medium'>{title}</div>
            {children}
        </div>
    );
};
