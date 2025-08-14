import {
    AccessManager,
    ColumnDefinitionColumnType,
    DATA_TYPE,
    IsArray,
    LISTING_CONTROLLER_ROUTER,
    ObjectDto,
} from '@finnoto/core';
import { TableColumnType } from '@finnoto/design-system';

export const hasRoleIdentifierPresent = (identifier: string | string[]) => {
    if (IsArray(identifier)) {
        return identifier.every((el) => AccessManager.hasRoleIdentifier(el));
    }
    return AccessManager.hasRoleIdentifier(identifier);
};

export const getColumnType = (
    type_id: number,
    attributes?: ObjectDto
): TableColumnType => {
    switch (type_id) {
        case ColumnDefinitionColumnType.NUMBER:
            return DATA_TYPE.NUMBER;
        case ColumnDefinitionColumnType.DATE:
            return DATA_TYPE.DATE;
        case ColumnDefinitionColumnType.DATE_TIME:
            return DATA_TYPE.DATE_TIME;
        case ColumnDefinitionColumnType.DATE_LATERAL:
            return DATA_TYPE.DATE_LATERAL;
        case ColumnDefinitionColumnType.CURRENCY:
            return DATA_TYPE.CURRENCY;
        case ColumnDefinitionColumnType.BOOLEAN:
            return DATA_TYPE.BOOLEAN;
        case ColumnDefinitionColumnType.REFERENCE:
            return DATA_TYPE.REFERENCE;
        case ColumnDefinitionColumnType.TEXT:
        case ColumnDefinitionColumnType.STRING:
            return DATA_TYPE.TEXT;
        case ColumnDefinitionColumnType.ACTIVATE:
            if (
                attributes?.role_identifier &&
                !hasRoleIdentifierPresent(attributes?.role_identifier)
            )
                return 'activate_badge';
            return 'activate';
        case ColumnDefinitionColumnType.ACTIVATE_BADGE:
            return 'activate_badge';
        case ColumnDefinitionColumnType.DUALISTIC:
            return 'dualistic';
        default:
            return DATA_TYPE.TEXT;
    }
};

export const getController = (ref_identifier: string) => {
    return LISTING_CONTROLLER_ROUTER[ref_identifier] || null;
};

export const getReferenceType = (type_id: number) => {
    switch (type_id) {
        case 1:
            return 'text';
        case 3:
        case 4:
            return 'date';
        case 5:
            return 'boolean';
        case 6:
            return 'multi_select';
        default:
            break;
    }
};
