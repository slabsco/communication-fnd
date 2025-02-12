'use client';

import { ChevronsLeftRight, SearchIcon } from 'lucide-react';
import * as React from 'react';
import { useUpdateEffect } from 'react-use';

import {
    Debounce,
    EmptyFunction,
    IsValidString,
    useUncontrolled,
} from '@finnoto/core';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

import { cn } from '../../../Utils/common.ui.utils';
import { Badge } from '../../Data-display/Badge/badge.component';
import { Tooltip } from '../../Data-display/Tooltip/Tooltip.component';
import { CheckBox } from '../CheckBox/checkBox.component';
import { InputField } from '../InputField/input.component';
import { MultiSelectInterface } from './multiSelectFilter.types';

export const MultiSelectFilter = ({
    options,
    label,
    isSearchable = true,
    value,
    onChangeFilter = EmptyFunction,
    labelClassName,
    footerClassName,
    containerClassName,
    defaultValue,
    align,
    side,
    isLabelShow,
    isAsync,
    isLoading,
    onAsyncSearch = EmptyFunction,
    onChangeSelectedOptions = EmptyFunction,
    placeholder,
    selectedSuffix,
    selectedClassName,
    isCollision = false,
    displayLimit = 1,
    ...rest
}: MultiSelectInterface) => {
    const [selected, setSelected] = useUncontrolled({
        value: value || [],
        defaultValue: value,
        onChange: onChangeFilter,
    });
    const searchRef = React.useRef<any>(null);

    useUpdateEffect(() => {
        if (!isLoading)
            return Debounce(() => searchRef?.current?.focus(), 100)();
    }, [isLoading]);

    const [open, setOpen] = React.useState<boolean>(undefined);
    const [search, setSearch] = React.useState<string>('');

    const selectedOptions = React.useMemo(
        () => options?.filter((option) => selected.includes(option?.value)),
        [options, selected]
    );

    const handleChange = React.useCallback(
        (value: any, is_add: boolean = true) => {
            const newData = is_add
                ? [...(selected || []), value]
                : selected?.filter((el) => el !== value);
            setSelected(newData);
        },
        [selected, setSelected]
    );

    const handleOpen = (isOpen: boolean) => {
        setOpen(isOpen);
    };

    const filterOptions = React.useMemo(() => {
        return [...(options || [])].filter((el) =>
            el?.label?.toLowerCase().includes(search)
        );
    }, [options, search]);

    return (
        <DropdownMenu modal={false} open={open} onOpenChange={handleOpen}>
            <DropdownMenuTrigger disabled={rest?.disabled} asChild>
                <div
                    className={cn(
                        'items-center justify-between cursor-pointer text-base-primary h-[42px] p-2 text-sm bg-base-100 border rounded gap-1 min-w-[200px] row-flex ',
                        labelClassName,
                        {
                            ' bg-base-200 ': rest?.disabled,
                            'hover:border-[--text-base-primary]':
                                !rest?.disabled,
                        }
                    )}
                >
                    <DisplaySelected
                        {...{
                            isLabelShow,
                            label,
                            selected,
                            placeholder,
                            selectedOptions,
                            handleChange,
                            selectedClassName,
                            handleOpen,
                            selectedSuffix,
                            disabled: rest?.disabled,
                            displayLimit,
                        }}
                    />

                    <ChevronsLeftRight className='rotate-90' size={18} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side}
                align={align}
                avoidCollisions={isCollision}
                className={cn(
                    'overflow-hidden flex-1 mt-2 rounded border shadow-lg min-w-[200px] col-flex z-[99999] max-h-[calc(var(--radix-dropdown-menu-content-available-height)-15px)] bg-base-100 w-[var(--radix-dropdown-menu-trigger-width)]',
                    containerClassName
                )}
            >
                {isSearchable && (
                    <div className='p-2 pb-0 w-full'>
                        <InputField
                            addonEnd={<SearchIcon size={18} />}
                            placeholder={'Search Options'}
                            value={search}
                            onDebounceChange={(value) => {
                                onAsyncSearch(value);
                                setSearch(value);
                            }}
                            isLoading={isLoading}
                            autoFocus
                            ref={searchRef}
                            className={rest?.searchClassName}
                            groupClassName='min-w-[100px]'
                        />
                    </div>
                )}

                <div className='overflow-y-auto py-2 max-h-80 col-flex'>
                    {filterOptions.map((option) => {
                        return (
                            <div
                                key={option?.value as any}
                                className='px-2 hover:bg-base-200'
                            >
                                <CheckBox
                                    size='xs'
                                    checked={(selected || []).includes(
                                        option?.value
                                    )}
                                    rightLabel={option?.label}
                                    onChange={(is_checked) => {
                                        handleChange(option?.value, is_checked);
                                    }}
                                    subLabel={option?.subLabel}
                                />
                            </div>
                        );
                    })}
                </div>

                <div
                    className={cn(
                        'justify-between items-center p-3 text-sm border-t row-flex',
                        footerClassName
                    )}
                >
                    <div onClick={() => setSelected([])} className='table-link'>
                        Clear All
                    </div>
                    {!IsValidString(search) ? (
                        <div>
                            {selected?.length || 0} of {filterOptions?.length}
                        </div>
                    ) : (
                        <div>
                            {filterOptions?.length > 1
                                ? `${filterOptions?.length} entries`
                                : `${filterOptions?.length || 0} entry`}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const DisplaySelected = ({
    isLabelShow,
    label,
    selected,
    placeholder,
    selectedOptions,
    handleChange,
    selectedClassName,
    handleOpen,
    selectedSuffix,
    disabled,
    displayLimit,
}) => {
    const elementRef = React.useRef<any>(null);

    const renderLabel = React.useCallback(() => {
        if (isLabelShow) return label;
        return !selected?.length ? label : null;
    }, [isLabelShow, label, selected?.length]);

    const renderSelected = React.useCallback(() => {
        if (!selected?.length)
            return <div className='text-base-secondary'>{placeholder}..</div>;

        const selectedDisplays = [...(selectedOptions || [])].splice(
            0,
            displayLimit
        );
        const moreSelected = [...(selectedOptions || [])].splice(
            displayLimit,
            selectedOptions?.length
        );

        return (
            <div
                ref={elementRef}
                className={cn(
                    'gap-2 items-center w-full cursor-pointer row-flex',
                    {
                        'cursor-not-allowed': disabled,
                    }
                )}
            >
                {isLabelShow ? ':' : ''}{' '}
                {selectedDisplays?.map((option) => {
                    return (
                        <SelectedDisplayInfo
                            key={option?.value}
                            label={option?.label}
                            onClick={() => {
                                handleChange(option?.value, false);
                                handleOpen(true);
                            }}
                            moreSelected={moreSelected?.length > 0}
                        />
                    );
                })}
                {moreSelected?.length > 0 && (
                    <Tooltip
                        asChild={false}
                        message={`${moreSelected
                            ?.map((selected) => selected?.label)
                            .join(', ')}`}
                    >
                        <Badge
                            size='sm'
                            appearance='primary'
                            label={`+${moreSelected?.length} ${
                                selectedSuffix || ''
                            }`}
                        />
                    </Tooltip>
                )}
            </div>
        );
    }, [
        disabled,
        displayLimit,
        handleChange,
        handleOpen,
        isLabelShow,
        placeholder,
        selected?.length,
        selectedOptions,
        selectedSuffix,
    ]);
    return (
        <div className='flex-1 gap-1 items-center whitespace-nowrap row-flex'>
            {renderLabel()} {renderSelected()}
        </div>
    );
};

const SelectedDisplayInfo = ({
    onClick,
    disabled,
    label,
    moreSelected,
}: {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
    moreSelected?: boolean;
}) => {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (disabled) return;
                onClick();
            }}
            className={cn(
                'p-1 px-3 cursor-none text-xs rounded cursor-pointer bg-base-200 truncate ',
                {
                    'hover:line-through hover:text-error': !disabled,
                    'max-w-[calc(100%-34px)]': moreSelected,
                }
            )}
        >
            {label}
        </div>
    );
};
