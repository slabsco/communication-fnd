import { formatDistance } from 'date-fns';

import { Modal } from '@finnoto/design-system';

import { ObjectDto } from '../backend/Dtos';
import {
    CURRENT_EMPLOYEE,
    CURRENT_USER,
    DEVELOPER_MODE_KEY,
    FINOPS_EMPLOYEE_DETAIL,
    GST_STATUS_TYPE,
    SOURCEHASH,
} from '../Constants';
import { user, UserBusiness } from '../Models/index';
import { OpenProperty } from '../Models/System/open.property';
import {
    FetchPropertyFromCache,
    IsEmptyObject,
    ReturnOpenProperty,
} from './common.utils';
import { SetItem } from './localStorage.utils';
import { Menu } from './menu.utils';
import { Navigation } from './navigation.utils';

export async function GetOpenPropertyValue(
    name: string,
    {
        convertBoolean,
        isBusiness,
    }: { convertBoolean?: boolean; isBusiness?: boolean } = {}
) {
    let property = await FetchPropertyFromCache(name, isBusiness);

    if (property) return ReturnOpenProperty(property, { convertBoolean });

    await new OpenProperty({ isBusiness }).process();

    const result = await FetchPropertyFromCache(name, isBusiness);
    return ReturnOpenProperty(result, { convertBoolean });
}

/** *
 * This function is directly related to the useGetEmployeeId Hook
 *
 * @description for reference check userGroupdetail.module.tsx.
 *
 * @param navigationFunction This is the function call from getEmployeeidHook
 * @param manager_id id
 *
 * @returns Navigate to the employee page
 */
export const handleNavigationEmployeeDetail = (
    navigationFunction: (
        __: number,
        _: (_: any) => void
    ) => Promise<void> | void,
    manager_id: number,
    route?: string
) => {
    navigationFunction(manager_id, (item) => {
        let url = `${route ?? FINOPS_EMPLOYEE_DETAIL}/${item?.id}`;
        if (!Menu.isMenuAvailable(url)) return;
        return Navigation.navigate({
            url,
        });
    });
};

export const IsBusinessOwner = (
    data: {
        owner_type?: string;
        owner_id?: number;
    },
    currentBusiness?: ObjectDto
) => {
    const business = currentBusiness || UserBusiness.getCurrentBusiness();
    if (IsEmptyObject(business)) return false;

    return (
        data?.owner_type === SOURCEHASH.finops_business &&
        data?.owner_id === business?.id
    );
};

export function IsBusiness() {
    const idObject = (UserBusiness.getIdObject() as any) || {};

    if (idObject?.business_id) {
        return true;
    }

    return false;
}

export const parseUserEmployeeCurrentIds = (ids: any[]) => {
    return ids.map((id) =>
        id === CURRENT_EMPLOYEE ? user.getUserData().employee?.id : id
    );
};
export const parseCurrentUserIds = (ids: any[]) => {
    return ids.map((id) => (id === CURRENT_USER ? user.getUserData().id : id));
};

type arrType = string | number;
export const removeDuplicateFromArray = (arr: arrType[]) => {
    return [...new Set(arr)] as any;
};

export const makePluralizeText = (str: string, count?: number) => {
    if (!count) return `${str}s`;
    return Math.abs(count) > 1 ? `${str}s` : `${str}`;
};

type DateFilterType = {
    startDate?: string;
    endDate?: string;
};

export const getDateQueryRule = (
    dateFilter?: DateFilterType,
    filterQuery: string = 'created_at'
) => {
    return {
        field: filterQuery,
        operator: 'between',
        value: `${dateFilter?.startDate},${dateFilter?.endDate}`,
    };
};
export const getGstinStatus = (status_id: number) => {
    if (status_id === GST_STATUS_TYPE.ACTIVE)
        return {
            text: 'Active',
            color: 'text-success',
            style: 'success',
        };
    if (status_id === GST_STATUS_TYPE.CANCELLED)
        return {
            text: 'Cancelled',
            color: 'text-error',
            style: 'error',
        };
    return {
        text: 'Suspended',
        color: 'text-warning',
        style: 'warning',
    };
};

export const convertToPluralDigit = (number: number): string => {
    return number < 10 ? `0${number}` : `${number}`;
};

export const getActivityDate = (date?: string) => {
    if (!date) return '';
    const formattedDate = formatDistance(new Date(date), new Date(), {
        addSuffix: true,
    });
    return formattedDate;
};

export const enableDeveloperMode = () => {
    SetItem(DEVELOPER_MODE_KEY, true, { isNonVolatile: false });
    global.console.log(`Developer Mode Enabled`);

    window.location.reload();
};
