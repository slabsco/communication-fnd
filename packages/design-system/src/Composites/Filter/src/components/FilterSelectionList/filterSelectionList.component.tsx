import React, { useCallback, useMemo } from 'react';

import { Debounce, GetObjectFromArray } from '@finnoto/core';

import { DropdownMenu } from '../../../../../Components';
import FilterSelectionBox from './Components/filterSelectionBox.component';
import { useFilterSelectionList } from './Hooks/useFilterSelectionList.hook';

const FilterSelectionList = ({ children }: { children?: React.ReactNode }) => {
    const {
        listFilters,
        remainingListFilters,
        appliedFilters,
        tempSelectedFilter,
        setTempSelectedFilter,
        handleFilterChange,
        removeFilter,
        restricted_filters,
    } = useFilterSelectionList();

    const menuActions = useMemo(() => {
        if (!remainingListFilters?.length) return [];
        const actions = [];

        remainingListFilters.forEach((filter) => {
            actions.push({
                name: filter.title,
                // Needed to debounce this action to avoid `FilterSelectionBox` defaultOpen being close
                action: () => Debounce(setTempSelectedFilter, 100)(filter.key),
            });
        });
        return actions;
    }, [remainingListFilters, setTempSelectedFilter]);

    const selectedFilterConfig = useMemo(() => {
        const config = GetObjectFromArray(
            listFilters,
            'key',
            tempSelectedFilter
        );

        if (!config) return null;

        const applied = GetObjectFromArray(
            appliedFilters,
            'key',
            tempSelectedFilter
        );

        return {
            key: config.key,
            value: applied?.value,
            config: { ...config, ...applied?.config },
        };
    }, [appliedFilters, listFilters, tempSelectedFilter]);

    const checkIsDeletable = useCallback(
        (filter: any) => {
            return (
                !filter.config.isDefinitionQueryFilter ||
                !restricted_filters?.split(',')?.includes(filter.key)
            );
        },
        [restricted_filters]
    );

    return (
        <div className='flex flex-wrap gap-2'>
            {appliedFilters.map((appliedFilter) => {
                if (appliedFilter.key === tempSelectedFilter) return null;

                return (
                    <FilterSelectionBox
                        {...appliedFilter}
                        key={
                            appliedFilter.key +
                            (appliedFilter.config?.id ?? 'id')
                        }
                        onDelete={
                            checkIsDeletable(appliedFilter)
                                ? () => {
                                      removeFilter(appliedFilter.key);
                                  }
                                : null
                        }
                        onChange={(value: any, operator?: string) => {
                            handleFilterChange(value, {
                                ...appliedFilter.config,
                                selectedOperator:
                                    operator ??
                                    appliedFilter.config?.selectedOperator,
                            });
                        }}
                    />
                );
            })}
            {selectedFilterConfig && (
                <FilterSelectionBox
                    {...selectedFilterConfig}
                    key={selectedFilterConfig.key + 'id'}
                    onChange={(value: any, operator?: string) => {
                        handleFilterChange(value, {
                            ...selectedFilterConfig.config,
                            selectedOperator:
                                operator ??
                                selectedFilterConfig.config?.selectedOperator,
                        });
                    }}
                    onDelete={
                        checkIsDeletable(selectedFilterConfig)
                            ? () => {
                                  removeFilter(selectedFilterConfig.key);
                                  setTempSelectedFilter(null);
                              }
                            : null
                    }
                    onClose={() => setTempSelectedFilter(null)}
                    defaultOpen
                />
            )}
            <DropdownMenu
                className='min-w-[100px] [--radix-popper-available-height:320px]'
                actions={menuActions}
                align='start'
            >
                {children}
            </DropdownMenu>
        </div>
    );
};

export default FilterSelectionList;
