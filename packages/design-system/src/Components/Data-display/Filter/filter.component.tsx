import { ArrowDownUpIcon, ListFilterIcon, SearchIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Transition } from 'react-transition-group';
import { useUpdateEffect } from 'react-use';

import { Debounce, useApp } from '@finnoto/core';
import { Tooltip } from '@finnoto/design-system';

import { cn } from '../../../Utils/common.ui.utils';
import { Button } from '../../Inputs/Button/button.component';
import PolarisTab from '../../Navigation/Tabs/PolarisTab/polarisTab.component';
import { Popover } from '../../Surfaces/Popover/popover.component';
import { AddFilterButton } from './Components/add.filter.button';
import { SortColumnPopover } from './Components/sortColumnPopover';
import { FilterProps } from './filter.types';
import { useFilter } from './Hooks/useFilter.hook';

const TRANSITION_DURATION = 300;

const defaultStyle = {
    transition: `opacity ${TRANSITION_DURATION}ms cubic-bezier(0.25,0.1,0.25,1)`,
    opacity: 0,
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: { opacity: 0 },
};

const Filter = forwardRef<any, FilterProps>(
    (
        {
            className,
            searchFilter,
            activeTab,
            filters,
            rightTabContent,
            leftTabContent,
            rightFilterContent,
            onAddFilterClick,
            addFilterComponent,
            renderFilterList,
            sortColumns,
            sort,
            defaultSort,
            onSortChange,
            tabFilterQueryKey,
            filterSaveButton,
            tabSaveFilterButton,
            shouldShowSaveTabFilter,
            hideSaveFilter,
            isLegacyFilter,
            disableSort,
            ...rest
        },
        ref
    ) => {
        const {
            tabElementRef,
            filterElementRef,
            currentMode,
            handleToggleMode,
            searchQuery,
            handleSearchQueryChange,
            tabs,
            onTabChange,
            isFiltersAvailable,
        } = useFilter({ ...rest, filters });

        const { isArc } = useApp();

        useImperativeHandle(
            ref,
            () => ({
                tabElementRef,
                filterElementRef,
                handleToggleMode,
            }),
            [filterElementRef, handleToggleMode, tabElementRef]
        );

        return (
            <div
                className={cn(
                    'p-1 px-0 rounded-lg border filter bg-base-100 border-polaris-border',
                    {
                        '!rounded border-base-300': !isArc,
                        'bg-polaris-bg-surface': isArc,
                    },
                    className
                )}
            >
                <Transition
                    nodeRef={tabElementRef}
                    in={currentMode === 'tab'}
                    timeout={TRANSITION_DURATION}
                >
                    {(state) => (
                        <div
                            ref={tabElementRef}
                            style={{
                                ...defaultStyle,
                                ...transitionStyles[state],
                            }}
                        >
                            {currentMode === 'tab' ? (
                                <div className='gap-2 items-center mx-1 row-flex'>
                                    <div className='overflow-hidden flex-1 max-w-full'>
                                        {!shouldShowSaveTabFilter &&
                                        !hideSaveFilter ? (
                                            <PolarisTab
                                                listContainerClass='overflow-x-auto scrollbar-none'
                                                active={activeTab}
                                                tabs={tabs}
                                                disableNav
                                                onTabChange={onTabChange}
                                                querykey={tabFilterQueryKey}
                                            />
                                        ) : (
                                            <div className='gap-2 p-1 rounded row-flex'>
                                                <div className='gap-2 row-flex'>
                                                    {renderFilterList}
                                                </div>
                                                {!hideSaveFilter
                                                    ? tabSaveFilterButton
                                                    : null}
                                            </div>
                                        )}
                                    </div>
                                    <div className='gap-2 row-flex'>
                                        {leftTabContent}
                                    </div>
                                    {(isFiltersAvailable ||
                                        searchFilter !== false) && (
                                        <Tooltip message='Search/Filter'>
                                            <Button
                                                className='gap-0 !px-2'
                                                appearance={
                                                    isArc
                                                        ? 'polaris-white'
                                                        : 'primary'
                                                }
                                                outline={!isArc}
                                                onClick={() =>
                                                    handleToggleMode('filter')
                                                }
                                                size='sm'
                                            >
                                                <SearchIcon className='w-4 h-4' />
                                                <ListFilterIcon className='w-4 h-4' />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {sortColumns?.length && !disableSort ? (
                                        <Popover
                                            element={
                                                <SortColumnPopover
                                                    value={sort}
                                                    defaultValue={defaultSort}
                                                    columns={sortColumns}
                                                    onSortChange={onSortChange}
                                                />
                                            }
                                        >
                                            <Tooltip message='Sort'>
                                                <Button
                                                    className='gap-0 !px-2'
                                                    appearance={
                                                        isArc
                                                            ? 'polaris-white'
                                                            : 'primary'
                                                    }
                                                    outline={!isArc}
                                                    size='sm'
                                                    shape='square'
                                                >
                                                    <ArrowDownUpIcon className='min-w-[16px] h-auto' />
                                                </Button>
                                            </Tooltip>
                                        </Popover>
                                    ) : null}
                                    <div className='gap-2 row-flex'>
                                        {rightTabContent}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </Transition>
                <Transition
                    nodeRef={filterElementRef}
                    in={currentMode === 'filter'}
                    timeout={TRANSITION_DURATION}
                >
                    {(state) => (
                        <div
                            ref={filterElementRef}
                            style={{
                                ...defaultStyle,
                                ...transitionStyles[state],
                            }}
                        >
                            {currentMode === 'filter' ? (
                                <div className='gap-1 col-flex'>
                                    <div className='gap-2 justify-end items-center mx-1 row-flex'>
                                        {searchFilter !== false && (
                                            <FilterInput
                                                className='flex-1'
                                                {...{
                                                    searchQuery,
                                                    searchPlaceholder:
                                                        searchFilter?.placeholder,
                                                    handleSearchQueryChange,
                                                }}
                                            />
                                        )}
                                        <div className='gap-2 items-center row-flex'>
                                            <Button
                                                className='font-medium'
                                                appearance='polaris-transparent'
                                                size='sm'
                                                onClick={() =>
                                                    handleToggleMode()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            {rightFilterContent}
                                            {!hideSaveFilter
                                                ? filterSaveButton
                                                : null}
                                            {sortColumns?.length &&
                                            !disableSort ? (
                                                <Popover
                                                    element={
                                                        <SortColumnPopover
                                                            value={sort}
                                                            defaultValue={
                                                                defaultSort
                                                            }
                                                            columns={
                                                                sortColumns
                                                            }
                                                            onSortChange={
                                                                onSortChange
                                                            }
                                                        />
                                                    }
                                                >
                                                    <Button
                                                        className='gap-0 !px-2'
                                                        appearance={
                                                            isArc
                                                                ? 'polaris-white'
                                                                : 'primary'
                                                        }
                                                        outline={!isArc}
                                                        size='sm'
                                                    >
                                                        <ArrowDownUpIcon className='w-4 h-4' />
                                                    </Button>
                                                </Popover>
                                            ) : null}
                                        </div>
                                    </div>
                                    {isFiltersAvailable ? (
                                        <>
                                            <div className='w-full border-b'></div>
                                            <div className='gap-2 mx-1 row-flex'>
                                                {isLegacyFilter
                                                    ? renderFilterList
                                                    : null}
                                                {addFilterComponent ?? (
                                                    <AddFilterButton
                                                        onClick={
                                                            onAddFilterClick
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    )}
                </Transition>
            </div>
        );
    }
);

const FilterInput = forwardRef<
    HTMLInputElement,
    {
        className?: string;
        searchQuery: string;
        searchPlaceholder?: string;
        handleSearchQueryChange: (value: string) => void;
    }
>(
    (
        { className, searchQuery, searchPlaceholder, handleSearchQueryChange },
        ref
    ) => {
        const [value, setValue] = useState(searchQuery);

        const { isArc } = useApp();

        useUpdateEffect(() => {
            setValue(searchQuery);
        }, [searchQuery]);

        const handleValueChange = (val: string) => {
            setValue(val);

            Debounce(handleSearchQueryChange, 1000, false)(val);
        };

        return (
            <label
                className={cn(
                    'flex gap-2 items-center outline-none input focus-within:input-bordered bg-polaris-bg-surface-hover input-sm focus-within:outline-0 focus-within:border-base-primary',
                    {
                        'bg-base-200': !isArc,
                    },
                    className
                )}
            >
                <SearchIcon className='w-4 h-4 text-base-tertiary' />
                <input
                    name='filter search'
                    type='search'
                    className={cn('flex-1 h-7 bg-polaris-bg-surface-hover', {
                        'bg-base-200': !isArc,
                    })}
                    value={value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    placeholder={
                        searchPlaceholder ?? 'Search ( min: 3 characters )'
                    }
                    ref={ref}
                    autoFocus
                />
            </label>
        );
    }
);

export { Filter };
