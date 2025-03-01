'use client';

import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Debounce,
    EmptyFunction,
    IsFunction,
    IsUndefinedOrNull,
    IsValidString,
    useApp,
} from '@finnoto/core';

import { cn } from '../../../Utils/common.ui.utils';
import { FormControl } from './formControl.component';
import { InputErrorMessage, InputMessage } from './inputMessage.component';
import { Label } from './label.component';
import {
    textAreaConatinerVariants,
    TextAreaInterface,
    textAreaVariants,
} from './textarea.types';

/**
 * Renders a textarea field for a form with customizable properties such as label, size, required, etc.
 *
 * @param {string} [name] - The name of the textarea field.
 * @param {string} [type] - The type of the textarea field. Can be 'tel' or 'number'.
 * @param {string} [size] - The size of the textarea field. Can be 'sm', 'md', or 'lg'.
 * @param {string} [value] - The value of the textarea field.
 * @param {string} [defaultValue] - The default value of the textarea field.
 * @param {string} [label] - The label of the textarea field.
 * @param {string} [placeholder] - The placeholder of the textarea field.
 * @param {number} [min] - The minimum value for number type textarea field.
 * @param {number} [max] = 255 - The maximum value for number type textarea field.
 * @param {string} [message] - The message shown below the textarea field.
 * @param {React.ReactNode} [messageComponent] - The message component shown below the textarea field.
 * @param {string} [error] - The error message shown below the textarea field.
 * @param {boolean} [readOnly] - Whether the textarea field is read-only.
 * @param {boolean} [disabled] - Whether the textarea field is disabled.
 * @param {boolean} [autoFocus] - Whether the textarea field is auto focused.
 * @param {boolean} [required] - Whether the textarea field is required.
 * @param {string} [inputClassName] - The class name of the textarea field.
 * @param {string} [labelClassName] - The class name of the label.
 * @param {object} [debounceParams] - The debounce parameters for the textarea field.
 * @param {number} [debounceParams.wait] - The wait time in ms for debouncing.
 * @param {boolean} [debounceParams.immediate] - Whether the onChange function is called immediately or not.
 * @param {number} [rows=3] - The number of rows for the textarea field.
 * @param {function} [onChange=EmptyFunction] - The onChange function for the textarea field.
 * @param {function} [onDebounceChange] - The onDebounceChange function for the textarea field.
 * @param {function} [onBlur=EmptyFunction] - The onBlur function for the textarea field.
 * @param {function} [onKeyDown] - The onKeyDown function for handling key events.
 * @return {JSX.Element} A textarea field component.
 */
export const TextareaField = forwardRef(
    (
        {
            name,
            type = 'textarea',
            size = 'md',
            value: propsValue,
            defaultValue,
            label,
            placeholder,
            min,
            max = 255,
            message,
            messageComponent,
            error,
            readOnly,
            disabled,
            autoFocus,
            required,
            inputClassName,
            debounceParams,
            onChange = EmptyFunction,
            onDebounceChange,
            className,
            onBlur = EmptyFunction,
            enableCount = true,
            labelClassName,
            onFocus,
            onKeyDown,
            ...props
        }: TextAreaInterface,
        ref: any
    ) => {
        const { isArc } = useApp();

        const rows = useMemo(() => {
            if (props.rows) return props.rows;
            return isArc ? 2 : 3;
        }, [isArc, props.rows]);

        const [value, setValue] = useState(propsValue);

        useEffect(() => {
            if (!IsUndefinedOrNull(propsValue)) {
                setValue(propsValue);
            }
        }, [propsValue]);

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (
                    (e.metaKey || e.ctrlKey) &&
                    e.shiftKey &&
                    e.key === 'Enter'
                ) {
                    const target = e.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const newValue =
                        value.substring(0, start) + '\n' + value.substring(end);
                    setValue(newValue);
                    onChange(newValue);
                    e.preventDefault();
                }
                onKeyDown?.(e);
            },
            [onChange, onKeyDown, value]
        );

        const textAreaInputclasses = cn(
            textAreaVariants({
                size,
                isError: !!error,
            }),
            inputClassName
        );

        const getValue = useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (['tel', 'number'].includes(type || '')) {
                    return Number(e.target.value);
                }
                return e.target.value;
            },
            [type]
        );

        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setValue(e.target.value);

                if (onChange && IsFunction(onChange)) onChange(getValue(e));

                if (onDebounceChange && IsFunction(onDebounceChange)) {
                    Debounce(
                        onDebounceChange,
                        debounceParams?.wait || 1000,
                        debounceParams?.immediate || false
                    )(getValue(e));
                }
            },
            [
                debounceParams?.immediate,
                debounceParams?.wait,
                getValue,
                onChange,
                onDebounceChange,
            ]
        );

        const renderInput = useMemo(() => {
            return (
                <textarea
                    data-gramm={false}
                    data-enable-grammarly={false}
                    data-gramm_editor={false}
                    className={textAreaInputclasses}
                    id={name}
                    {...{
                        name,
                        type,
                        value,
                        defaultValue,
                        placeholder,
                        min,
                        max,
                        autoFocus,
                        readOnly,
                        disabled,
                        required,
                        rows,
                    }}
                    minLength={min}
                    maxLength={max}
                    ref={ref}
                    onChange={(e) => handleChange(e)}
                    onBlur={(e) => onBlur(getValue(e))}
                    onFocus={(e) => onFocus?.(getValue(e))}
                    onKeyDown={handleKeyDown}
                />
            );
        }, [
            textAreaInputclasses,
            name,
            type,
            value,
            defaultValue,
            placeholder,
            min,
            max,
            autoFocus,
            readOnly,
            disabled,
            required,
            rows,
            ref,
            handleChange,
            onBlur,
            getValue,
            onFocus,
            handleKeyDown,
        ]);

        const containerClass = cn(
            textAreaConatinerVariants({
                disabled,
                isValidString: IsValidString(value),
                containerSize: size,
            }),
            {
                countEnable: enableCount,
            }
        );

        const renderCount = useCallback(() => {
            return (
                <div className='text-xs font-normal text-base-tertiary'>
                    {value?.length || 0}/{max}
                </div>
            );
        }, [max, value?.length]);

        return (
            <FormControl className={className} {...{ containerClass }}>
                <Label
                    {...{
                        label,
                        error,
                        name,
                        required,
                    }}
                    className={labelClassName}
                    rightComponent={
                        enableCount && !disabled ? renderCount() : <></>
                    }
                />
                {renderInput}
                <InputErrorMessage {...{ error }} />
                <InputMessage {...{ message, messageComponent, error }} />
            </FormControl>
        );
    }
);
