import { useCallback, useMemo } from 'react';

import {
    IsUndefinedOrNull,
    IsValidString,
    ObjectDto,
    ParseToSelectBoxOption,
    useColumnDefinitions,
} from '@finnoto/core';

import { useFilterContext } from '../provider';

import { GlobalSvgIcon, UserSquareSvgIcon } from 'assets';

export const useSaveFilter = ({
    saved_filter,
    definitionKey,
    defaultSaveFilter,
}: {
    saved_filter?: any;
    definitionKey?: string;
    defaultSaveFilter?: any;
}) => {
    const {
        isLoading: isColumnDefinitionLoading,
        refetch,
        savePreference,
        filterPreferences,
        currentFilter,
        userPreferenceDefinitions,
        definitionDefaultLayout,
        column_definitions,
    } = useColumnDefinitions({
        definitionKey,
        saved_filter,
        defaultSaveFilter,
    });

    const {
        filterData: queryFilterData,
        filterQuery,
        isAnyFilterApplied,
    } = useFilterContext();

    const isSavedFilterApplied = useMemo(
        () => !!currentFilter,
        [currentFilter]
    );

    const saveFilter = ({
        identifier,
        filterValues,
        is_global,
        id,
        defaultSaveFilter,
        ...rest
    }: {
        identifier: string;
        filterValues?: ObjectDto;
        is_global?: boolean;
        id?: number;
        [key: string]: any;
    }) => {
        const getColumnDefinitions = () => {
            if (userPreferenceDefinitions?.length)
                return userPreferenceDefinitions;
            if (definitionDefaultLayout?.length) return definitionDefaultLayout;
            return [];
        };
        return savePreference({
            ...rest,
            identifier: identifier,
            query_definition: filterValues,
            column_definition: getColumnDefinitions(),
            is_global: is_global || false,
            id,
        });
    };

    //compares filter and remove saved filter
    const isAppliedFilterDifference = useCallback(() => {
        if (!saved_filter && !isAnyFilterApplied) return;
        const { filter_query: saveFilterQuery, ...saveFilterData } =
            currentFilter?.query_definition || {};

        if (JSON.stringify(queryFilterData) != JSON.stringify(saveFilterData))
            return true;

        if (!IsValidString(filterQuery) && IsUndefinedOrNull(saveFilterQuery))
            return;
        if (filterQuery != saveFilterQuery) return true;
    }, [
        currentFilter?.query_definition,
        filterQuery,
        isAnyFilterApplied,
        queryFilterData,
        saved_filter,
    ]);

    const isShowSaveFilter = useMemo(() => {
        if (!isAppliedFilterDifference?.()) return false;
        return !currentFilter?.id && isAnyFilterApplied;
    }, [currentFilter, isAnyFilterApplied, isAppliedFilterDifference]);

    const getSanitizedPreferences = useCallback(() => {
        const newPreferences = [];
        const favorites = [];
        filterPreferences.forEach((pref) => {
            if (pref?.is_favourite) {
                favorites.push(pref);
            } else newPreferences.push(pref);
        });
        return ParseToSelectBoxOption(
            [...favorites, ...newPreferences],
            'id',
            'identifier'
        ).map((pref: any) => {
            if (pref?.data?.user_id)
                return {
                    ...pref,
                    rightIcon: UserSquareSvgIcon,
                    tooltip: 'Personal',
                };
            return {
                ...pref,
                rightIcon: GlobalSvgIcon,
                tooltip: 'Global',
            };
        });
    }, [filterPreferences]);

    return {
        isColumnDefinitionLoading,
        isSavedFilterApplied,
        isAnyFilterApplied,
        filterPreferences,
        currentFilter,
        refetch,
        savePreference,
        saveFilter,
        isAppliedFilterDifference,
        getSanitizedPreferences,
        column_definitions,
        isShowSaveFilter,
    };
};
