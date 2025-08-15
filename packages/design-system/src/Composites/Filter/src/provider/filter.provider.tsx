import { createContext, useCallback, useContext, useMemo } from 'react';

import {
    CURRENT_EMPLOYEE,
    CURRENT_USER,
    DATA_OPERATORS,
    EmptyFunction,
    getColumnType,
    getController,
    getMethodParamsValue,
    getReferenceType,
    IsArray,
    IsEmptyObject,
    ObjectDto,
    parseCurrentDate,
    parseCurrentUserIds,
    parseUserEmployeeCurrentIds,
    QueryOperatorList,
    useColumnDefinitions,
} from '@finnoto/core';

import { useDefaultListFilter } from '../hooks';
import { useFilter } from '../hooks/useFilter.hook';
import {
    FilterContextInterface,
    FilterProviderInterface,
} from './filter.provider.types';

const FilterContext = createContext<FilterContextInterface>({
    filterData: {},
    queryString: {},
    filterJson: undefined,
    filterQuery: undefined,
    sqlFilterQuery: undefined,
    handleNavigationSearch: EmptyFunction,
    removeFilterData: EmptyFunction,
    handleFilterData: EmptyFunction,
    pagination: {},
    setPagination: EmptyFunction,
    listFilters: [],
    defaultValues: {},
    hasAnyFilter: () => false,
    definitionFilterColumns: [],
    innerListFilters: [],
    defaultQueries: {},
});

export const FilterProvider = ({
    children,
    filterAliasKey = 'filter',
    filters,
    dateFilter = false,
    amountFilter = false,
    name,
    definitionKey,
    filterStoreKey,
    disableNav,
    defaultFilterParams,
    defaultFilterQueries,
    defaultRestrictedQueries,
    defaultSaveFilter,
}: FilterProviderInterface) => {
    const { listFilters, getDefaultValues } = useDefaultListFilter({
        filters,
        dateFilter,
        amountFilter,
        name,
    });

    const getOperators = useCallback(
        (type?: string) =>
            QueryOperatorList.filter((value) => {
                if (!type) return true;
                return DATA_OPERATORS[type]?.includes(value.name);
            }),
        []
    );
    const { filter_column_definitions, filter_column_definitions_outer } =
        useColumnDefinitions({
            definitionKey,
            defaultSaveFilter,
        });

    const definitionFilterColumns = useMemo(() => {
        return filter_column_definitions.map((column) => {
            const columnType = getColumnType(column.column_type_id);
            return {
                label: column.name,
                name: column?.filter_identifier,
                type: columnType,
                inputType: columnType,
                dataType: columnType,
                operators: getOperators(columnType),
                controller: getController(column.reference_model?.identifier),
                controller_type: column.reference_model?.identifier,
                method: column.reference_model?.method_name || 'find',
                methodParams: getMethodParamsValue(
                    column.reference_model?.method_params
                ),
                classParams: column.reference_model?.class_params,
                attributes: column?.reference_model?.attributes,
            };
        });
    }, [filter_column_definitions, getOperators]);

    const {
        handleFilterData,
        handleNavigationSearch,
        removeFilterData,
        filterData,
        filterJson,
        filterQuery,
        sqlFilterQuery,
        clearAllFilter,
        queryString,
        isAnyFilterApplied,
        defaultQueries,
    } = useFilter({
        filterAliasKey,
        defaultValues: defaultFilterParams ?? getDefaultValues(),
        defaultRestrictedQueries,
        defaultFilterQueries,
        filterStoreKey,
        disableNav,
    });

    const innerListFilters = useMemo(() => {
        const filtersIN = listFilters?.filter(
            (filter) =>
                filter?.isVisible !== false &&
                filter?.type !== 'customize_group' &&
                filter?.isOuterFilter !== true
        );

        if (filter_column_definitions_outer?.length) {
            filter_column_definitions_outer?.forEach((fil) => {
                filtersIN.push({
                    title: fil?.filter_name,
                    controller: getController(fil.reference_model?.identifier),
                    controller_type: fil.reference_model?.identifier,
                    key: fil?.filter_identifier,
                    type: getReferenceType(fil.column_type_id),
                    methodParams: getMethodParamsValue(
                        fil?.reference_model?.method_params
                    ),
                    classParams: fil.reference_model?.class_params,
                    ...fil?.reference_model?.attributes,
                });
            });
        }
        return filtersIN;
    }, [filter_column_definitions_outer, listFilters]);

    const sanitizeInnerFilter = useMemo(() => {
        const filtersIN = listFilters;

        if (filter_column_definitions_outer?.length) {
            filter_column_definitions_outer?.forEach((fil) => {
                filtersIN.push({
                    title: fil?.filter_name,
                    controller: getController(fil.reference_model?.identifier),
                    controller_type: fil.reference_model?.identifier,
                    key: fil?.filter_identifier,
                    type: getReferenceType(fil.column_type_id),
                    methodParams: getMethodParamsValue(
                        fil?.reference_model?.method_params
                    ),
                    classParams: fil.reference_model?.class_params,
                    ...fil?.reference_model?.attributes,
                });
            });
        }

        return filtersIN;
    }, [filter_column_definitions_outer, listFilters]);

    const isFilterButtonVisible = useMemo(() => {
        return (
            innerListFilters?.length > 0 || definitionFilterColumns?.length > 0
        );
    }, [definitionFilterColumns?.length, innerListFilters?.length]);

    const hasAnyFilter = useCallback(
        (ignore_filter?: string[]) => {
            const newData = { ...filterData };
            const { page, limit, ...appliedFilters } = newData;
            if (ignore_filter) {
                for (const key of ignore_filter) {
                    delete (appliedFilters || {})[key];
                }
            }

            return !IsEmptyObject(appliedFilters);
        },
        [filterData]
    );
    const hasVisibleFilterBtn = useMemo(() => {
        return (
            listFilters.filter((filter) => filter?.isOuterFilter !== true)
                .length > 0
        );
    }, [listFilters]);

    const setPagination = useCallback(
        ({ page, limit }) => {
            handleNavigationSearch(
                {
                    ...filterData,
                    page: Number(page),
                    limit: Number(limit),
                },
                true,
                {
                    isPaginationChanged: true,
                }
            );
        },
        [filterData, handleNavigationSearch]
    );

    const pagination = useMemo(
        () => ({
            page: filterData.page || 1,
            limit: filterData.limit,
        }),
        [filterData.limit, filterData.page]
    );

    const values: FilterContextInterface = useMemo(
        () => ({
            handleFilterData,
            handleNavigationSearch,
            removeFilterData,
            filterData,
            filterJson,
            filterQuery,
            sqlFilterQuery,
            queryString,
            pagination,
            setPagination,
            listFilters: sanitizeInnerFilter,
            defaultValues: getDefaultValues(),
            defaultQueries,
            hasAnyFilter,
            clearAllFilter,
            definitionFilterColumns,
            isFilterButtonVisible,
            innerListFilters,
            hasVisibleFilterBtn,
            filterAliasKey,
            isAnyFilterApplied,
        }),
        [
            handleFilterData,
            handleNavigationSearch,
            removeFilterData,
            filterData,
            filterJson,
            filterQuery,
            sqlFilterQuery,
            queryString,
            pagination,
            setPagination,
            sanitizeInnerFilter,
            getDefaultValues,
            defaultQueries,
            hasAnyFilter,
            clearAllFilter,
            definitionFilterColumns,
            isFilterButtonVisible,
            innerListFilters,
            hasVisibleFilterBtn,
            filterAliasKey,
            isAnyFilterApplied,
        ]
    );

    return (
        <FilterContext.Provider value={values}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = () => {
    return useContext(FilterContext);
};

export const withFilterProviderExport = <TProps extends ObjectDto>(
    Component: React.ComponentType<TProps>
): React.ComponentType<TProps> => {
    return (props) => {
        return (
            <FilterProvider
                dateFilter={props?.dateFilter}
                filters={props?.filters}
                amountFilter={props?.amountFilter}
                name={props?.name}
                definitionKey={props?.definitionKey}
                disableNav={props?.disableNav}
                defaultFilterParams={props?.defaultFilterParams}
                defaultFilterQueries={props?.defaultFilterQueries}
                defaultRestrictedQueries={props?.defaultRestrictedQueries}
                defaultSaveFilter={props?.defaultSaveFilter}
            >
                <Component {...props} />
            </FilterProvider>
        );
    };
};

export const sanitizeFilterData = (data: any) => {
    const newData = { ...data };

    if (newData.amount && Object.keys(newData.amount).length < 2) {
        newData.amount = undefined;
    }
    if (newData?.date?.range?.min) {
        newData['date']['range']['min'] = parseCurrentDate(
            newData?.date?.range?.min
        );
    }
    if (newData?.date?.range?.max) {
        newData['date']['range']['max'] = parseCurrentDate(
            newData?.date?.range?.max
        );
    }
    for (let [key, value] of Object.entries(data)) {
        if (value && IsArray(value)) {
            //parse current user
            if (value.includes(CURRENT_USER))
                newData[key] = parseCurrentUserIds(value);
            //parse current employee
            else if (value.includes(CURRENT_EMPLOYEE))
                newData[key] = parseUserEmployeeCurrentIds(value);
        }
    }

    return newData;
};
