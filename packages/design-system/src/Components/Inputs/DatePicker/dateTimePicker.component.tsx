import { addMinutes, format, startOfDay } from 'date-fns';
import { forwardRef, useMemo } from 'react';

import {
    DEFAULT_DATE_FORMAT,
    EmptyFunction,
    GetDateValue,
} from '@finnoto/core';

import { cn } from '../../../Utils/common.ui.utils';
import { InputField } from '../InputField/input.component';
import {
    MaskedDatePickerInput,
    MaskedDatePickerInputProps,
} from '../MaskedInput';

export const DateTimePicker = forwardRef(
    (
        { onChange = EmptyFunction, ...rest }: MaskedDatePickerInputProps,
        ref: any
    ) => {
        const value = useMemo(
            () => (rest?.value ? GetDateValue(rest?.value) : undefined),
            [rest?.value]
        );

        return (
            <div ref={ref} className='gap-4 items-center row-flex'>
                <MaskedDatePickerInput
                    {...rest}
                    value={value}
                    className={cn('w-full', rest?.className)}
                    inputAddOnClassName={'min-w-[220px]'}
                    dateFormat={DEFAULT_DATE_FORMAT}
                    label={rest?.label || 'Date'}
                    isRequired={rest?.isRequired}
                    onChange={(date_value) => {
                        if (!date_value) return;
                        const minutes = getCurrentDateMinutes(date_value);

                        onChange(addMinutes(startOfDay(date_value), minutes));
                    }}
                    hideClear
                />
                <InputField
                    type='time'
                    label='Time'
                    groupClassName='min-w-0'
                    inputClassName='min-w-0'
                    disabled={!value}
                    value={value ? format(value, 'HH:mm') : ''}
                    onChange={(time_value) => {
                        const minutes = convert24HourToMinutes(time_value);

                        onChange(addMinutes(startOfDay(value), minutes));
                    }}
                    required={rest?.isRequired}
                />
            </div>
        );
    }
);

const getCurrentDateMinutes = (date: Date) => {
    const minute = date.getMinutes();
    const hour = date.getHours();
    return hour * 60 + minute;
};

const convert24HourToMinutes = (value: string) => {
    if (!value) return 0;
    const [hour, minute] = value.split(':');
    return Number(hour) * 60 + Number(minute);
};
