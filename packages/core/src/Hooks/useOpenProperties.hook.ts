import { useDeepCompareEffect, useList } from 'react-use';

import { ObjectDto } from '../backend/Dtos';
import { OpenProperty } from '../Models/System/open.property';
import {
    FetchPropertyFromCache,
    ReturnOpenProperty,
} from '../Utils/common.utils';

export const useOpenProperties = <TValue extends string | boolean | number>(
    property_keys: string | string[],
    options?: { convertBoolean?: boolean; isBusiness?: boolean }
) => {
    const [propertyValues, { set }] = useList<TValue>([]);

    const returnPropertyValues = (
        keys: string | string[],
        properties: ObjectDto
    ) => {
        if (!Array.isArray(keys)) {
            const value = properties[keys]?.value;
            return [ReturnOpenProperty(value, options)];
        }

        return keys.map((key) => {
            const value = properties[key]?.value;
            return ReturnOpenProperty(value, options);
        });
    };

    const fetchProperties = async (keys: string | string[]) => {
        const setPropertyValues = async () => {
            let properties = await FetchPropertyFromCache(undefined, true);

            if (properties) {
                const values = returnPropertyValues(keys, properties);
                set(values);
                return true;
            }

            return false;
        };

        if (await setPropertyValues()) return;

        await new OpenProperty({ isBusiness: true }).process();
        await setPropertyValues();
    };

    useDeepCompareEffect(() => {
        fetchProperties(property_keys);
    }, [[property_keys]]);

    return propertyValues;
};
