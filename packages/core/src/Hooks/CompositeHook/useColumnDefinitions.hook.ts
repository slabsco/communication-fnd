import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ListingController } from '../../backend/ap/business/controllers/listing.controller';
import { ListingPreferenceController } from '../../backend/ap/business/controllers/listing.preference.controller';
import { AddListingPreferenceDto } from '../../backend/ap/business/dtos/add.listing.preference.dto';
import { ObjectDto } from '../../backend/Dtos';
import { DEVELOPER_MODE_KEY } from '../../Constants';
import {
    GetObjectFromArray,
    IsEmptyArray,
    SortArrayObjectBy,
} from '../../Utils/common.utils';
import { GetItem } from '../../Utils/localStorage.utils';
import { FetchData } from '../useFetchData.hook';

export const useColumnDefinitions = ({
    definitionKey,
    saved_filter,
    defaultSaveFilter,
}: {
    definitionKey: string;
    saved_filter?: string;
    defaultSaveFilter?: ObjectDto;
}) => {
    const {
        data: definitions,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['column_definitions', definitionKey],
        queryFn: async () => {
            const { response } = await FetchData({
                className: ListingController,
                method: 'show',
                methodParams: definitionKey,
            });

            return response || {};
        },
        cacheTime: Infinity,
        staleTime: Infinity,
        enabled: !!definitionKey,
    });

    const { definition = [], preferences: userPreferences = [] } =
        definitions || {};

    const column_definitions = useMemo(
        () => definition.filter((el) => el?.active),
        [definition]
    );

    /**
     * @description This is for the filter columns
     */
    const filter_column_definitions = useMemo(() => {
        const filteredData = definition.filter(
            (el) =>
                el?.is_visible && el?.filter_identifier && !el.is_code_filter
        );
        return SortArrayObjectBy(filteredData, 'name', 'asc');
    }, [definition]);

    /**
     * @description This is for the filter columns
     */
    const filter_column_definitions_outer = useMemo(() => {
        const filteredData = definition.filter(
            (el) =>
                el?.is_visible && el?.filter_identifier && el?.is_code_filter
        );
        return SortArrayObjectBy(filteredData, 'name', 'asc');
    }, [definition]);

    const filterPreferences = useMemo(() => {
        // This new Implementations is done in case of save filter to show dynamically
        const userPref = userPreferences?.filter(
            (pref) => pref?.identifier?.toLowerCase() !== 'default'
        );
        if (defaultSaveFilter?.sourceKey) {
            const filters = userPref?.filter((el) => {
                return (
                    el?.query_definition[defaultSaveFilter?.sourceKey] ===
                    defaultSaveFilter?.sourceValue
                );
            });

            const newPreferences = filters.map((el) => {
                // Destructure to exclude the sourceKey and sourceValue

                const {
                    sourceKey,
                    sourceValue,
                    [defaultSaveFilter?.sourceKey]: defaultSourceValue,
                    ...newQueryDefinition
                } = el?.query_definition;

                return {
                    ...el,
                    query_definition: newQueryDefinition,
                };
            });

            return SortArrayObjectBy(
                newPreferences,
                'created_at',
                'desc',
                true
            );
        }

        return SortArrayObjectBy(userPref, 'created_at', 'desc', true);
    }, [userPreferences, defaultSaveFilter]);

    const currentFilterId = useMemo(() => {
        if (saved_filter) return saved_filter;
        return null;
    }, [saved_filter]);

    const currentFilter = useMemo(() => {
        if (!currentFilterId) return null;
        const preference = GetObjectFromArray(
            filterPreferences,
            'id',
            Number(currentFilterId)
        );
        return preference || null;
    }, [currentFilterId, filterPreferences]);

    const currentPreference = useMemo(() => {
        return GetObjectFromArray(
            userPreferences,
            'identifier',
            currentFilter?.identifier || 'default'
        );
    }, [currentFilter?.identifier, userPreferences]);

    const userPreferenceDefinitions = useMemo(() => {
        if (!userPreferences || IsEmptyArray(userPreferences)) return [];
        if (
            currentPreference?.column_definition &&
            !IsEmptyArray(currentPreference?.column_definition)
        )
            return currentPreference.column_definition;
        return [];
    }, [currentPreference?.column_definition, userPreferences]);

    const definitionDefaultLayout = useMemo(() => {
        if (IsEmptyArray(column_definitions)) return [];
        return column_definitions
            .filter((def) => def.default)
            .map((def) => ({ name: def.name, key: def.identifier }));
    }, [column_definitions]);

    const isDeveloperModeEnable = GetItem(DEVELOPER_MODE_KEY, false);

    const savePreference = async (data: Partial<AddListingPreferenceDto>) => {
        // if (isDeveloperModeEnable) {
        //     await FetchData({
        //         className: DeveloperModeController,
        //         method: 'setListingColumnPriority',
        //         methodParams: definitionKey,
        //         classParams: data,
        //     });
        // }

        return FetchData({
            className: ListingPreferenceController,
            method: 'create',
            methodParams: definitionKey,
            classParams: data,
        });
    };

    return {
        isLoading,
        refetch,
        column_definitions,
        filter_column_definitions,
        filter_column_definitions_outer,
        userPreferences,
        savePreference,
        currentFilterId,
        filterPreferences,
        currentFilter,
        userPreferenceDefinitions,
        definitionDefaultLayout,
        currentPreference,
    };
};
