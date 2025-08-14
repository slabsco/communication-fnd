import { ObjectDto } from '@finnoto/core';

import { FilterProps } from '../Filter/filter.types';

export interface IndexFilterProps
    extends Omit<
        FilterProps,
        | 'tabs'
        | 'addFilterComponent'
        | 'renderFilterList'
        | 'sortableColumns'
        | 'sort'
        | 'defaultSort'
        | 'sortColumns'
        | 'onSortChange'
        | 'hasNoQueryFilters'
    > {
    filterTabs?: FilterProps['tabs'];
    tabFilterQueryKey?: string;
    definitionKey?: string;
    defaultActiveTab?: string;
    disableNav?: boolean;
    onlyDisplayQueryFilter?: boolean;
    hideFilter?: boolean;
    hideSaveFilter?: boolean;
    filterTitle?: string;
    withLegacyFilter?: boolean;
    showSearchFilter?:
        | {
              placeholder?: string;
          }
        | false;
    defaultSaveFilter?: ObjectDto;
}
