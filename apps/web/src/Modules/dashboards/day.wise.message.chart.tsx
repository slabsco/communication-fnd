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
    label: string;
    sortKey: number;
}

interface ProcessedChartData {
    chartData: Array<{ name: string; data: number[] }>;
    chartLabels: string[];
    colors: string[];
}

type Granularity = 'day' | 'week' | 'month';

// Granularity helpers
const getGranularity = (dateFilter: string): Granularity => {
    if (dateFilter === '15 Days') return 'day';
    if (dateFilter === '1 Month') return 'week';
    return 'month'; // '3 Month'
};

const toUTCDate = (dateString: string) => {
    // Normalize to UTC midnight for stable grouping across timezones
    const d = new Date(dateString);
    return new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
};

const getISOWeek = (date: Date): { year: number; week: number } => {
    // Copy date, set to nearest Thursday: current date + 4 - current day number
    const d = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
    return { year: d.getUTCFullYear(), week };
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const getGroupKeyAndLabel = (dateString: string, granularity: Granularity) => {
    const d = toUTCDate(dateString);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate();

    if (granularity === 'day') {
        const sortKey = +d; // timestamp
        const label = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
        const key = `${y}-${pad2(m)}-${pad2(day)}`;
        return { key, label, sortKey };
    }

    if (granularity === 'week') {
        // Week within the month, with day range like "Week 1 (1-7)"
        const dayOfMonth = day; // 1..31
        const weekInMonth = Math.floor((dayOfMonth - 1) / 7) + 1;
        const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate(); // last day of month
        const startDay = (weekInMonth - 1) * 7 + 1;
        const endDay = Math.min(weekInMonth * 7, daysInMonth);

        const sortKey = y * 10000 + m * 100 + weekInMonth; // YYYYMMWW
        const key = `${y}-${pad2(m)}-W${weekInMonth}`;
        const label = `Week ${weekInMonth} (${startDay}-${endDay})`;
        return { key, label, sortKey };
    }

    // month
    const sortKey = y * 100 + m;
    const key = `${y}-${pad2(m)}`;
    const label = d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
    return { key, label, sortKey };
};

// Utility functions
const groupData = (
    data: MessageData[],
    granularity: Granularity
): Record<string, GroupedData> => {
    return data.reduce((acc, item) => {
        const { key, label, sortKey } = getGroupKeyAndLabel(
            item.message_date,
            granularity
        );

        if (!acc[key]) {
            acc[key] = { replied: 0, unreplied: 0, label, sortKey };
        }

        if (item.is_replied) {
            acc[key].replied += item.count;
        } else {
            acc[key].unreplied += item.count;
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

    // Limit raw rows roughly by days requested; backend returns 2 rows per day
    const filteredData = data.slice(0, daysToShow * 2);

    const granularity = getGranularity(dateFilter);
    const grouped = groupData(filteredData, granularity);

    const buckets = Object.values(grouped).sort(
        (a, b) => a.sortKey - b.sortKey
    );

    const repliedData = buckets.map((b) => b.replied);
    const unrepliedData = buckets.map((b) => b.unreplied);

    const chartData = [
        { name: CHART_SERIES_NAMES[0], data: repliedData },
        { name: CHART_SERIES_NAMES[1], data: unrepliedData },
    ];

    const chartLabels = buckets.map((b) => b.label);

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
