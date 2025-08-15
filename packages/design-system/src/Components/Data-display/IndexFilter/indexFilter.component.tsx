import { useCallback, useMemo, useRef } from 'react';

import {
    Debounce,
    FetchData,
    getColumnType,
    GetFilterRestrictedFilterQuery,
    IsEmptyObject,
    IsValidString,
    parseJSONString,
    RemoveEmptyObjectKeys,
    RESTRICTED_FILTERS,
    SortArrayObjectBy,
    toastBackendError,
    useApp,
    useFetchParams,
} from '@finnoto/core';
import { ListingPreferenceController } from '@finnoto/core/src/backend/ap/business/controllers/listing.preference.controller';

import {
    ListFilterForm,
    openSaveFilter,
    SaveFilterButton,
    useFilterContext,
    useSaveFilter,
} from '../../../Composites/Filter';
import { ArcFilterListDisplay } from '../../../Composites/Filter/src/components/filterListDisplay/arcFilterList.display.component';
import FilterSelectionList from '../../../Composites/Filter/src/components/FilterSelectionList/filterSelectionList.component';
import { ConfirmUtil, Modal, Toast } from '../../../Utils';
import { Button } from '../../Inputs/Button/button.component';
import { PolarisTabsItem } from '../../Navigation/Tabs/PolarisTab/polarisTab.types';
import { AddFilterButton } from '../Filter/Components/add.filter.button';
import { Filter } from '../Filter/filter.component';
import { FilterTabItem } from '../Filter/filter.types';
import { IndexFilterProps } from './indexFilter.types';

import { DeleteSvgIcon } from 'assets';

export const IndexFilter = ({
    filterTabs,
    tabFilterQueryKey = 'tab',
    defaultActiveTab = 'all',
    disableNav,
    onlyDisplayQueryFilter,
    hideFilter,
    hideSaveFilter,
    filterTitle,
    withLegacyFilter,
    showSearchFilter,
    defaultSaveFilter,
    disableSort,
    ...props
}: IndexFilterProps) => {
    const filterRef = useRef(null);
    const { definitionKey } = props;
    const { isArc } = useApp();
    const { filter } = useFetchParams();

    const enableInlineFilters = true;

    const {
        listFilters: tableFilters,
        filterData,
        filterQuery,
        queryString,
        removeFilterData,
        clearAllFilter,
        handleFilterData,
        handleNavigationSearch,
        isFilterButtonVisible,
        hasAnyFilter,
        defaultQueries,
        definitionFilterColumns,
    } = useFilterContext();

    const {
        saved_filter,
        [RESTRICTED_FILTERS]: restricted_filters,
        filter: _filter,
        filter_query: _filter_query,
        ...restQueries
    } = queryString || {};

    const {
        saveFilter,
        column_definitions,
        getSanitizedPreferences,
        refetch: refetchPreferences,
        isShowSaveFilter,
    } = useSaveFilter({
        saved_filter,
        definitionKey,
        defaultSaveFilter,
    });

    const currentFilterTab =
        queryString[tabFilterQueryKey] || saved_filter?.toString();

    const sortableColumns = useMemo(() => {
        return column_definitions
            .filter((def) => def.is_db_sortable)
            .map((def) => ({
                label: def.name,
                value: def.identifier,
                type: getColumnType(def.column_type_id),
            }));
    }, [column_definitions]);

    const tabActions = useMemo<PolarisTabsItem['actions']>(
        () => [
            {
                name: 'Edit',
                icon: 'PencilSvgIcon',
                onClick(item) {
                    const { filter_query, ...rest } =
                        item?.query_definition || {};
                    openSaveFilter({
                        data: {
                            ...item,
                            is_global: !item?.user_id,
                        },
                        definitionKey,
                        filterData: rest,
                        listFilters: tableFilters,
                        saveFilter,
                        definitionFilterColumns,
                        defaultSaveFilter,

                        filter_query,
                        callback: () => {
                            refetchPreferences();
                            Modal.close();
                        },
                    });
                },
            },
            {
                name: 'Duplicate',
                icon: 'CopySvgIcon',
                onClick(item) {
                    const { filter_query, ...rest } =
                        item?.query_definition || {};
                    openSaveFilter({
                        data: {
                            ...item,
                            id: undefined,
                            is_global: !item?.user_id,
                        },
                        filterData: rest,
                        listFilters: tableFilters,
                        defaultSaveFilter,
                        saveFilter,
                        definitionFilterColumns,
                        filter_query,
                        callback: () => {
                            refetchPreferences();
                            Modal.close();
                        },
                    });
                },
            },
            {
                name: 'Remove',
                icon: 'DeleteSvgIcon',
                type: 'error',
                onClick: (item) => {
                    ConfirmUtil({
                        message: 'Are you sure you want to delete?',
                        iconAppearance: 'error',
                        icon: DeleteSvgIcon,
                        onConfirmPress: () => {
                            onRemoveFilter(item?.id, definitionKey, () => {
                                clearAllFilter();
                                refetchPreferences();
                            });
                        },
                        confirmAppearance: 'error',
                        appearance: 'error',
                        isArc,
                    });
                },
            },
        ],
        [
            clearAllFilter,
            defaultSaveFilter,
            definitionFilterColumns,
            definitionKey,
            isArc,
            refetchPreferences,
            saveFilter,
            tableFilters,
        ]
    );

    const tabs = useMemo(() => {
        const filterTabList = (filterTabs || []).map((tab) => ({
            ...tab,
            isStatic: true,
        }));

        const prefTabs: FilterTabItem[] = getSanitizedPreferences().map(
            (pref): FilterTabItem => ({
                ...(pref.data || {}),
                key: pref.value.toString(),
                title: pref.label,
                isStatic: false,
                data: pref.data,
                actions: pref?.data?.business_id ? tabActions : [],
            })
        );

        const sortedPrefTabs = SortArrayObjectBy(
            prefTabs,
            'created_at',
            'desc',
            true
        );

        return [...filterTabList, ...sortedPrefTabs];
    }, [filterTabs, getSanitizedPreferences, tabActions]);

    const sort = useMemo(() => {
        const order = filterData?.order;
        if (!order) return {};
        if (IsEmptyObject(order)) return {};

        return {
            column: Object.keys(order)[0],
            order: Object.values(order)[0] as any,
        };
    }, [filterData?.order]);

    const isFilterAvailable = useMemo(() => {
        if (onlyDisplayQueryFilter && !filterQuery) return false;

        const rules = parseJSONString(filterQuery)?.rules;

        const restrictedFilters = restricted_filters?.split(',');
        const isQueryFilterAvailable =
            rules?.filter((rule) => !restrictedFilters?.includes(rule?.field))
                ?.length > 0;

        if (onlyDisplayQueryFilter && !isQueryFilterAvailable) return false;

        const outerFiltersKeys = tableFilters.map((item) => {
            if (item?.isOuterFilter) {
                return item?.key;
            }
        });
        const showOuterFilterSave = !filter
            ? hasAnyFilter(outerFiltersKeys)
            : hasAnyFilter();

        return isQueryFilterAvailable || showOuterFilterSave;
    }, [
        filter,
        filterQuery,
        hasAnyFilter,
        onlyDisplayQueryFilter,
        restricted_filters,
        tableFilters,
    ]);

    const removeQueryFilter = useCallback(
        (forceClean?: boolean) => {
            const queries = { ...queryString };

            const restrictedFilterQuery = GetFilterRestrictedFilterQuery(
                queries.filter_query,
                restricted_filters
            );
            if (restricted_filters)
                queries[RESTRICTED_FILTERS] = restricted_filters;
            if (forceClean) {
                delete queries.filter;
            }

            if (queries?.filter && !forceClean) {
                let jsonObject = JSON.parse(queries?.filter);

                if (jsonObject.hasOwnProperty('filter_query')) {
                    delete jsonObject.filter_query;
                }
                const { page, limit, ...rest } = jsonObject || {};
                if (IsEmptyObject(rest)) delete queries.filter;
                else queries.filter = JSON.stringify(jsonObject);
            }
            queries.filter_query = restrictedFilterQuery;
            if (!queries.filter_query && !queries.filter)
                return clearAllFilter();
            handleNavigationSearch(queries, false);
        },
        [
            clearAllFilter,
            handleNavigationSearch,
            queryString,
            restricted_filters,
        ]
    );

    return (
        <Filter
            activeTab={currentFilterTab ?? defaultActiveTab}
            tabFilterQueryKey={tabFilterQueryKey}
            tabs={tabs}
            hideFilter={hideFilter || !isFilterButtonVisible}
            searchString={filterData?.search || ''}
            searchFilter={showSearchFilter}
            disableSort={disableSort}
            onSearchChange={(value) => {
                handleFilterData({
                    search: IsValidString(value) ? value : undefined,
                });
            }}
            {...props}
            defaultSort={{
                column: sort.column,
                order: sort.order || 'asc',
            }}
            sortColumns={sortableColumns}
            onSortChange={(sort) => {
                if (!sort.column) return;

                Debounce(({ column, order }) => {
                    handleFilterData({ order: { [column]: order } });
                }, 100)(sort);
            }}
            onTabChange={(tab) => {
                if (!tab.key)
                    return handleNavigationSearch({ ...restQueries }, false, {
                        reset: true,
                    });
                if (tab.isStatic) {
                    return handleNavigationSearch(
                        RemoveEmptyObjectKeys({
                            ...restQueries,
                            [tabFilterQueryKey]: tab.key,
                            filter_query: GetFilterRestrictedFilterQuery(
                                defaultQueries?.filter_query,
                                restricted_filters
                            ),
                            [RESTRICTED_FILTERS]: restricted_filters,
                        }),
                        false,
                        { reset: true }
                    );
                }

                const { filter_query, ...restFilters } =
                    (tab as any)?.query_definition || {};

                handleNavigationSearch(
                    {
                        ...restQueries,
                        saved_filter: tab.key,
                        filter_query,
                        filter: JSON.stringify(restFilters),
                        [RESTRICTED_FILTERS]:
                            defaultQueries?.[RESTRICTED_FILTERS],
                    },
                    false,
                    { reset: true }
                );
            }}
            addFilterComponent={
                <>
                    {enableInlineFilters && !withLegacyFilter ? (
                        <FilterSelectionList>
                            <AddFilterButton />
                        </FilterSelectionList>
                    ) : (
                        <ListFilterForm definitionKey={definitionKey}>
                            <AddFilterButton />
                        </ListFilterForm>
                    )}
                </>
            }
            renderFilterList={
                <>
                    {!!filterTitle && (
                        <div className='items-center text-sm font-medium row-flex'>
                            {filterTitle}
                        </div>
                    )}
                    {isFilterAvailable && !filterTitle ? (
                        <ArcFilterListDisplay
                            data={filterData}
                            listFilters={tableFilters}
                            // removeFilterKey={hideDisplayFilterKeys}
                            onlyDisplayQueryFilter={onlyDisplayQueryFilter}
                            removeFilterData={removeFilterData}
                            filterQuery={filterQuery}
                            removeQueryFilter={removeQueryFilter}
                        />
                    ) : null}
                </>
            }
            filterSaveButton={
                isFilterAvailable ? (
                    <SaveFilterButton
                        definitionKey={definitionKey}
                        buttonProps={{
                            size: 'sm',
                            appearance: isArc ? 'polaris-white' : 'primary',
                            outline: !isArc,
                        }}
                        onSave={() =>
                            filterRef?.current?.handleToggleMode('tab')
                        }
                        onApply={() =>
                            filterRef?.current?.handleToggleMode('tab')
                        }
                        definitionFilterColumns={definitionFilterColumns}
                        defaultSaveFilter={defaultSaveFilter}
                    />
                ) : null
            }
            tabSaveFilterButton={
                isFilterAvailable ? (
                    <div className='gap-2 justify-end row-flex'>
                        <Button
                            className='font-normal'
                            appearance={isArc ? 'polaris-white' : 'error'}
                            size='xs'
                            onClick={() => removeQueryFilter(true)}
                            outline
                        >
                            Clear
                        </Button>
                        <SaveFilterButton
                            definitionKey={definitionKey}
                            buttonProps={{
                                size: 'xs',
                                outline: true,
                            }}
                            buttonText='Save'
                            onSave={() =>
                                filterRef?.current?.handleToggleMode('tab')
                            }
                            definitionFilterColumns={definitionFilterColumns}
                            defaultSaveFilter={defaultSaveFilter}
                        />
                    </div>
                ) : null
            }
            shouldShowSaveTabFilter={isShowSaveFilter && isFilterAvailable}
            hideSaveFilter={hideSaveFilter}
            hasNoQueryFilters={!definitionKey}
            isLegacyFilter={!enableInlineFilters || withLegacyFilter}
            ref={filterRef}
        />
    );
};

const onRemoveFilter = async (
    id: number,
    definitionKey: string,
    callback: () => void
) => {
    const { response, success } = await FetchData({
        className: ListingPreferenceController,
        method: 'remove',
        methodParams: {
            identifier: definitionKey,
            id: id,
        },
    });
    if (!success) {
        toastBackendError(response);
        return;
    }
    Toast.success({
        description: 'Successfully removed',
    });
    callback();
};
