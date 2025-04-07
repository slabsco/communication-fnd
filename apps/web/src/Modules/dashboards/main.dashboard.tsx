import { CheckCircle, HeartPulse, Link2, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';

import {
    CopyToClipBoard,
    HOME_ROUTE,
    IsEmptyArray,
    useBusinessPreference,
    useFetchReport,
} from '@finnoto/core';
import {
    Breadcrumbs,
    Button,
    Chart,
    cn,
    Container,
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

import { CopySvgIcon } from 'assets';

const MainDashboard = () => {
    const { businessInfo, verifyNumber } = useBusinessPreference();

    console.log({ businessInfo });

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
                <Card title='Broadcast Stats'>
                    <BroadcastBarGraph />
                </Card>
                <Card title='Inbox Stats'>
                    <ExpiredActiveCard />
                </Card>
            </div>
        </Container>
    );
};

export default MainDashboard;

const ExpiredActiveCard = () => {
    const { data, isLoading } = useFetchReport('teaminbox.stats.report.data');

    const chartLabels = useMemo(() => ['Expired', 'Active'], []);

    const chartFinalData = [
        { name: 'Count', data: [data?.[0]?.count, data?.[1]?.count] },
    ];

    const colors = useMemo(
        () => [
            arcChartColors.error, // Error messages
            arcChartColors.success, // Delivered messages
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

const BroadcastBarGraph = () => {
    const { data, isLoading } = useFetchReport('broadcast.stats.report.data');
    const colors = useMemo(
        () => [
            arcChartColors.error, // Error messages
            '#4CD4FF', // Sent messages
            arcChartColors.success, // Delivered messages
            '#FFB400', // Read messages
        ],
        []
    );

    const datasets = useMemo(() => {
        return data?.map((item) => item.count);
    }, [data]);

    const labelsWithColor = useMemo(() => {
        return data?.map((item: any, index) => {
            return {
                label: item.type,
                color: colors[index],
                rightValue: item?.count,
            };
        });
    }, [colors, data]);

    const labels = useMemo(() => {
        return data?.map((item) => item.type);
    }, [data]);

    const options: any = {
        colors: colors,
        strokeWidth: 0,
        enableDataLabels: false,
        legendPosition: 'right',
        showLegend: false,
        ledgendFontSize: ['16px'],
        stacked: true,
        ...customChartOptions,
        tooltipCustom: (data) => {
            const mapData = data[data.seriesIndex];

            return customChartTooltip(
                labels,
                data,
                'pie',
                mapData?.count?.[0],
                'number',
                mapData?.data?.[0],
                data.seriesIndex,
                mapData?.name
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
        <div className='flex-col gap-3 items-center'>
            <Chart
                type='pie'
                height={400}
                datasets={datasets}
                labels={labels}
                options={options}
            />

            <DashboardChartLabels type='horizontal' data={labelsWithColor} />
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
