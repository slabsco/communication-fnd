import { useCallback, useMemo } from 'react';

import {
    getDefaultFilterQueries,
    GetItem,
    IsArray,
    IsEmptyObject,
    IsValidString,
    ObjectDto,
    parseFilterQueryString,
    parseFilterQueryToSql,
    parseJSONString,
    PRODUCT_IDENTIFIER,
    RemoveEmptyObjectKeys,
    SetItem,
    useApp,
    useQueryState,
} from '@finnoto/core';

export const useFilter = ({
    defaultValues = {},
    defaultFilterQueries,
    defaultRestrictedQueries,
    filterAliasKey = 'filter',
    filterStoreKey,
    disableNav,
}: {
    defaultValues?: ObjectDto;
    defaultFilterQueries?: ObjectDto;
    defaultRestrictedQueries?: string;
    filterAliasKey?: string;
    filterStoreKey?: string;
    disableNav?: boolean;
}) => {
    const defaultQueries = getDefaultFilterQueries(
        defaultFilterQueries,
        defaultRestrictedQueries
    );

    const [queryString, setQueryString] = useQueryState<ObjectDto>({
        defaultQueries,
        disableQuery: disableNav,
    });

    const { filter_query: paramsFilterQuery, [filterAliasKey]: filterParams } =
        queryString || {};

    const { product_id } = useApp();

    const setStoreFilter = useCallback(
        (data: any) => {
            if (!filterStoreKey) return;
            SetItem(filterStoreKey, data);
        },
        [filterStoreKey]
    );
    const getStoreFilters = useCallback(
        (filterAliasKey?: string) => {
            if (!filterStoreKey) return {};
            if (!filterAliasKey) return GetItem(filterStoreKey);
            try {
                return (
                    JSON.parse(GetItem(filterStoreKey)[filterAliasKey]) || {}
                );
            } catch (e) {
                return {};
            }
        },
        [filterStoreKey]
    );

    const filterData = useMemo(() => {
        const storeFilters = getStoreFilters(filterAliasKey) || {};

        try {
            const jsonFilters = filterParams ? JSON.parse(filterParams) : {};

            return {
                ...defaultValues,
                ...storeFilters,
                ...jsonFilters,
            };
        } catch (error) {
            return {
                ...defaultValues,
            };
        }
    }, [defaultValues, filterAliasKey, filterParams, getStoreFilters]);

    const filterQuery = useMemo(() => {
        if (paramsFilterQuery) {
            return paramsFilterQuery;
        }

        const storeFilters = getStoreFilters() || {};
        return storeFilters?.filter_query;
    }, [getStoreFilters, paramsFilterQuery]);

    const filterJson = useMemo(() => {
        const filterJson = parseJSONString(filterQuery);
        if (!filterJson || IsEmptyObject(filterJson)) return;

        return filterJson;
    }, [filterQuery]);

    const sqlFilterQuery = useMemo(() => {
        return parseFilterQueryToSql(parseFilterQueryString(filterQuery));
    }, [filterQuery]);

    const clearAllFilter = useCallback(
        (queries = queryString) => {
            const newQueryString = { ...queries };
            delete newQueryString.filter;
            delete newQueryString.filter_query;
            delete newQueryString.saved_filter;

            setQueryString(newQueryString, true);
        },
        [queryString, setQueryString]
    );

    const isAnyFilterApplied = useMemo(() => {
        const { page, limit, ...rest } = filterData || {};

        if (!rest) return null;
        const filterKeys = Object.keys(rest);
        return filterKeys.length > 0 || IsValidString(filterQuery);
    }, [filterData, filterQuery]);

    //it helps to maintain the state by navigating the state in url
    const handleNavigationSearch = useCallback(
        (
            data: ObjectDto,
            isAliasing: boolean = true,
            options?: {
                isPaginationChanged?: boolean;
                reset?: boolean;
            }
        ) => {
            const newQueryString = { ...queryString };
            const { page, limit, ...rest } = data || {};
            if (IsEmptyObject(rest) && !options?.isPaginationChanged) {
                setStoreFilter(null);
                if (!paramsFilterQuery) return clearAllFilter();
                delete newQueryString[filterAliasKey];
                return setQueryString(newQueryString);
            }

            if (!isAliasing) {
                setStoreFilter(data);
                return setQueryString(data, options?.reset);
            }

            const query = {
                [filterAliasKey]: JSON.stringify(data),
            };

            setStoreFilter(query);
            setQueryString(query, options?.reset);
        },
        [
            clearAllFilter,
            filterAliasKey,
            paramsFilterQuery,
            queryString,
            setQueryString,
            setStoreFilter,
        ]
    );

    const handleFilterData = useCallback(
        (data: ObjectDto) => {
            const newData = {
                ...filterData,
                ...data,
            };

            if (newData?.page) {
                newData.page = 1;
            }

            handleNavigationSearch(RemoveEmptyObjectKeys(newData));
        },
        [filterData, handleNavigationSearch]
    );

    const removeFilterData = (key: string | string[]) => {
        const newData = { ...filterData };
        if (filterQuery) {
            newData.filter_query = filterQuery;
        }
        if (IsArray(key)) {
            for (const valueKey of key) delete newData[valueKey];
        } else delete newData[key];

        handleNavigationSearch(newData);
    };

    return {
        handleFilterData,
        handleNavigationSearch,
        filterData,
        filterQuery,
        sqlFilterQuery,
        filterJson,
        removeFilterData,
        clearAllFilter,
        setStoreFilter,
        queryString,
        isAnyFilterApplied,
        defaultQueries,
    };
};
