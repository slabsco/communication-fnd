import React from 'react';

import { cn } from '@finnoto/design-system';

interface ILabelItemProps {
    label: string | React.ReactNode;
    color: string;
    onClick?: () => void;
    rightValue?: string;
    labelClassName?: string;
}

const DashboardChartLabels = ({
    data,
    type = 'horizontal',
}: { data: ILabelItemProps[] } & {
    type?: 'horizontal' | 'vertical';
}) => {
    return (
        <div
            className={cn('flex flex-wrap gap-4 gap-y-2', {
                'flex-col gap-y-4': type === 'vertical',
            })}
        >
            {data.map((item, index) => (
                <DashboardChartLabelItem key={index} {...item} />
            ))}
        </div>
    );
};

export const DashboardChartLabelItem = ({
    label,
    color,
    onClick,
    rightValue,
    labelClassName,
}: ILabelItemProps) => {
    return (
        <div className='flex gap-2 items-center' onClick={onClick}>
            {color && (
                <div
                    className={cn('w-3 h-3 rounded-full')}
                    style={{
                        backgroundColor: color,
                    }}
                ></div>
            )}
            <p
                className={cn(
                    'flex gap-3 items-center font-medium capitalize text-polaris-size-325 text-polaris-text',
                    labelClassName
                )}
            >
                {label}
                {rightValue && (
                    <span className='text-xs font-medium'>{rightValue}</span>
                )}
            </p>
        </div>
    );
};

export default DashboardChartLabels;
