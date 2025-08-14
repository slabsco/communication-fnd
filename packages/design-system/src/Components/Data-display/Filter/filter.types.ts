import { HTMLAttributes, ReactNode } from 'react';

import { ObjectDto } from '@finnoto/core';

import { ListFormFilterProps } from '../../../Composites/Filter/index';
import { PolarisTabsItem } from '../../Navigation/Tabs/PolarisTab/polarisTab.types';

export interface FilterTabItem extends PolarisTabsItem {
    isStatic?: boolean;
    customFilterValue?: ObjectDto;
}

export interface FilterProps {
    tabs?: FilterTabItem[];
    className?: string;
    activeTab?: string;
    tabFilterQueryKey?: string;
    searchString?: string;
    defaultSearchString?: string;
    searchFilter?:
        | {
              placeholder?: string;
          }
        | false;
    filters?: ListFormFilterProps[] | false;
    appliedFilters?: ObjectDto[];
    defaultAppliedFilters?: ObjectDto[];
    onFiltersChange?: (filters: ObjectDto[]) => void;
    onTabChange?: (tab: FilterTabItem) => void;
    onSearchChange?: (value: string) => void;
    onAddFilterClick?: () => void;
    rightTabContent?: ReactNode;
    leftTabContent?: ReactNode;
    rightFilterContent?: ReactNode;
    filterSaveButton?: ReactNode;
    tabSaveFilterButton?: ReactNode;
    addFilterComponent?: ReactNode;
    renderFilterList?: ReactNode;
    sortColumns?: SortColumnsItem[];
    sort?: SortValue;
    defaultSort?: SortValue;
    onSortChange?: (sort: SortValue) => void;
    shouldShowSaveTabFilter?: boolean;
    hasNoQueryFilters?: boolean;
    hideFilter?: boolean;
    hideSaveFilter?: boolean;
    isLegacyFilter?: boolean;
    onModeToggle?: (mode: 'tab' | 'filter') => void;
    disableSort?: boolean;
}

export interface FilterHookProps
    extends Pick<
        FilterProps,
        | 'tabs'
        | 'filters'
        | 'searchString'
        | 'defaultSearchString'
        | 'onSearchChange'
        | 'appliedFilters'
        | 'defaultAppliedFilters'
        | 'onFiltersChange'
        | 'onTabChange'
        | 'hasNoQueryFilters'
        | 'hideFilter'
    > {}

export interface SortColumnsItem {
    label: string;
    value: string;
    type: string;
}

export interface SortColumnPopoverProps {
    value?: SortValue;
    defaultValue?: SortValue;
    columns: SortColumnsItem[];
    onSortChange?: (sort: SortValue) => void;
}

export interface SortValue {
    column: string;
    order: 'asc' | 'desc';
}
