import { useCallback, useMemo, useState } from 'react';

import { SelectBoxOption, useFetchReport } from '@finnoto/core';
import { Chart, cn, Loading, SelectBox } from '@finnoto/design-system';
import { ChartOptions } from '@finnoto/design-system/src/Components/Data-display/Chart/chart.types';

import {
    arcChartColors,
    customChartOptions,
    customChartTooltip,
} from '../../Constants/chart-constant/commonChartOption';

// Constants
const DATE_FILTER_OPTIONS: SelectBoxOption[] = [
    { key: '15 Days', label: 'Last 15 Days', value: '15 Days' },
    { key: '1 Month', label: 'Last 1 Month', value: '1 Month' },
    { key: '3 Month', label: 'Last Quarter (3 Months)', value: '3 Month' },
];

const DAYS_MAPPING = {
    '15 Days': 15,
    '1 Month': 30,
    '3 Month': 90,
} as const;

const CHART_COLORS = [arcChartColors.success, arcChartColors.info];
const CHART_SERIES_NAMES = ['Message Sent', 'Message Received'] as const;

// Types
interface MessageData {
    message_date: string;
    is_replied: boolean;
    count: number;
}

interface GroupedData {
    replied: number;
    unreplied: number;
}

interface ProcessedChartData {
    chartData: Array<{ name: string; data: number[] }>;
    chartLabels: string[];
    colors: string[];
}

// Utility functions
const formatDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};

const groupDataByDate = (data: MessageData[]): Record<string, GroupedData> => {
    return data.reduce((acc, item) => {
        if (!acc[item.message_date]) {
            acc[item.message_date] = { replied: 0, unreplied: 0 };
        }

        if (item.is_replied) {
            acc[item.message_date].replied = item.count;
        } else {
            acc[item.message_date].unreplied = item.count;
        }

        return acc;
    }, {} as Record<string, GroupedData>);
};

const processChartData = (
    data: MessageData[],
    dateFilter: string
): ProcessedChartData => {
    if (!data?.length) {
        return { chartData: [], chartLabels: [], colors: CHART_COLORS };
    }

    const daysToShow =
        DAYS_MAPPING[dateFilter as keyof typeof DAYS_MAPPING] || 15;
    const filteredData = data.slice(0, daysToShow * 2); // *2 because we have 2 entries per day
    const groupedData = groupDataByDate(filteredData);

    const dates = Object.keys(groupedData).sort();
    const repliedData = dates.map((date) => groupedData[date].replied);
    const unrepliedData = dates.map((date) => groupedData[date].unreplied);

    const chartData = [
        { name: CHART_SERIES_NAMES[0], data: repliedData },
        { name: CHART_SERIES_NAMES[1], data: unrepliedData },
    ];

    const chartLabels = dates.map(formatDateLabel);

    return { chartData, chartLabels, colors: CHART_COLORS };
};

const createChartOptions = (
    chartLabels: string[],
    colors: string[]
): ChartOptions => ({
    ...customChartOptions,
    colors,
    showLegend: false,
    legendPosition: 'bottom',
    barColumnWidth: '20%',
    barBorderRadius: 4,
    barBorderRadiusApply: 'end',
    stacked: true,
    formatLabelY: (value: number) => String(value),
    tooltipCustom: (data) => {
        const { dataPointIndex, seriesIndex } = data;
        const isReplied = seriesIndex === 0;
        const label = isReplied ? CHART_SERIES_NAMES[0] : CHART_SERIES_NAMES[1];
        const value = data.series[seriesIndex][dataPointIndex];
        const date = chartLabels[dataPointIndex];

        return customChartTooltip(
            [label],
            data,
            'bar',
            undefined,
            'number',
            value,
            undefined,
            `${date} - ${label}`,
            <span className='text-xs text-polaris-text-secondary'>{date}</span>
        );
    },
});

const LegendItem = ({ color, label }: { color: string; label: string }) => (
    <div className='flex gap-2 items-center'>
        <div
            className='w-4 h-4 rounded-full'
            style={{ backgroundColor: color }}
        />
        <span className='text-sm font-medium text-polaris-text'>{label}</span>
    </div>
);

const DayWiseMessageChart = () => {
    const [date, setDate] = useState('15 Days');
    const { data, isLoading } = useFetchReport('day.wise.message.received', {
        params: { day_filter: date },
    });

    const { chartData, chartLabels, colors } = useMemo(
        () => processChartData(data, date),
        [data, date]
    );

    const options = useMemo(
        () => createChartOptions(chartLabels, colors),
        [chartLabels, colors]
    );

    const handleDateChange = useCallback((value: string) => {
        setDate(value);
    }, []);

    return (
        <div className={cn('px-3 py-2 pb-4 rounded-lg shadow-lg bg-base-100')}>
            <div className='flex gap-3 justify-between items-center mb-6'>
                <div className='text-xl font-semibold text-polaris-text'>
                    Message Statistics
                </div>
                <SelectBox
                    value={date}
                    width={300}
                    size='md'
                    onChange={(v) => handleDateChange(v?.value)}
                    options={DATE_FILTER_OPTIONS as any}
                />
            </div>

            <div className='h-[400px]'>
                {isLoading ? (
                    <div className='w-full h-full centralize'>
                        <Loading color='primary' size='lg' />
                    </div>
                ) : (
                    <Chart
                        type='bar'
                        labels={chartLabels}
                        height={400}
                        options={options}
                        datasets={chartData}
                    />
                )}
            </div>

            <div className='flex gap-6 justify-center mt-4'>
                <LegendItem color={colors?.[0]} label={CHART_SERIES_NAMES[0]} />
                <LegendItem color={colors?.[1]} label={CHART_SERIES_NAMES[1]} />
            </div>
        </div>
    );
};

export default DayWiseMessageChart;
