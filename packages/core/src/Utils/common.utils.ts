import { IsObject } from 'class-validator';
import {
    addMonths,
    addYears,
    endOfDay,
    format,
    isDate,
    isValid,
    min,
    parse,
    startOfYear,
    subDays,
    subYears,
} from 'date-fns';
import { lookup as mimeLookup } from 'mime-types';

import { MethodDto, ObjectDto } from '../backend/Dtos';
import {
    API_DATE_FORMAT,
    BusinessType,
    DISPLAY_DATE_FORMAT,
    DISPLAY_DATE_TIME_FORMAT,
    GST_STATUS_TYPE,
} from '../Constants/preference.constants';
import {
    EMAIL_REGEX,
    GSTIN_NUMBER,
    IFSC_CODE_REGEX,
} from '../Constants/regex.constants';
import {
    OPEN_PROPERTY,
    OPEN_PROPERTY_BUSINESS,
    REFERRAL_CODE,
} from '../Constants/storage.constant';
import { GENERIC_LISTING_REFETCH } from '../Constants/string.constants';
import { DisputeStateType } from '../Types/common.types';
import { MetrixItemType } from '../Types/component.types';
import { FormatCurrency, FormatCurrencyUnit } from './currency.utils';
import { GetItem, GetItemAsync, SetItem } from './localStorage.utils';
import { StoreEvent } from './stateManager.utils';
import { Toast } from './toast.utils';

let timeout: NodeJS.Timeout | undefined;

/**
 * return boolean if given variable is undefined or null
 * @param value
 */
export function IsUndefinedOrNull(value: unknown): value is null {
    return typeof value === 'undefined' || value == null;
}

/**
 * return boolean if given variable is null only
 * @param value
 */
export function IsNull(value: unknown): value is null {
    return value == null;
}

/**
 * return boolean if given variable is undefined only
 * @param value
 */
export function IsUndefined(value: unknown): value is undefined {
    return typeof value === 'undefined';
}

/**
 * Check if 'window' global object is available.
 * The 'window' object is not available on ssr of nextjs.
 *
 * @returns boolean
 */
export const IsWindow = (): boolean => {
    return typeof window !== 'undefined';
};

/**
 * Checking value is valid string or not
 *
 * @param value any
 * @returns boolean
 */
export function IsValidString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

/**
 * Checking value is valid array or not
 *
 * @param value any
 * @returns boolean
 */
export function IsArray<T>(value: unknown): value is Array<T> {
    return Array.isArray(value);
}

/**
 * Checking value is valid function or not
 *
 * @param data any
 * @returns boolean
 */
export function IsFunction(data: unknown): data is Function {
    return typeof data === 'function';
}

export function IsEmptyArray(value: unknown): value is undefined {
    return !(Array.isArray(value) && value.length > 0);
}

export function IsEmptyObject(object: unknown) {
    return !(object && Object.keys(object).length);
}

/**
 * @param  {Number} number
 */
export const ParseInteger = (number): number => {
    return parseInt(number, 10);
};

/**
 * Parse currency string to number
 * @param  {string} currencyString
 * @returns {number}
 */
export function parseCurrencyString(currencyString: string): number {
    // Remove any non-numeric characters from the string
    const numericString = currencyString.replace(/[^0-9.-]+/g, '');

    // Parse the numeric string to a number
    const number = parseFloat(numericString);

    return number;
}

/**
 * avoids multiple parallel async call, and returns same promise to all the calling methods
 * @param  {Function} fn
 */
export function AvoidParallelAsyncCall(fn: Function) {
    let promise;

    return function (_?: any) {
        const context = this;
        const args = arguments;
        if (promise) return promise;

        promise = fn.apply(context, args);

        promise.then(() => (promise = null));
        return promise;
    };
}

/**
 * returns matched option from array against mentioned attribute value(in case of array of objects)
 * or element(in case of plain array)
 * @param  {array} hayStack - array
 * @param  {} needle - value
 * @param  {string} element - attribute name
 * @param  {int} defaultElement - if element not found, returns element of default index
 */
export function SelectFromOptions(
    hayStack?: any,
    needle?: string | number,
    element?: any,
    defaultElement?: number,
    shouldNotSendDefaultElement?: boolean
) {
    defaultElement = defaultElement || 0;
    const isArray = IsUndefinedOrNull(element);
    for (const i in hayStack) {
        if (isArray) {
            if (hayStack[i] == needle) return hayStack[i];
        } else {
            if (hayStack[i][element] == needle) return hayStack[i];
        }
    }

    if (!shouldNotSendDefaultElement) {
        const finalElement = hayStack[defaultElement];

        return finalElement || hayStack[0];
    }
    return null;
}

/**
 * Return street address from address object
 * If any given reason street address is not found '-' will be returned
 *
 * @export
 * @param {*} address
 * @returns
 */
export function GetStreetAddress(address: any) {
    if (!address) {
        return '-';
    }

    return address.street_address ?? '-';
}

export function GetNameFromContactList(mobile: number, contactHash: ObjectDto) {
    if (contactHash[mobile]) {
        return contactHash[mobile].displayName;
    }
    return false;
}

/**
 * Gives
 *
 * @export
 * @param {number} quantity
 * @param {*} unit
 * @returns
 */
export function GetVariantName(quantity: number, unit: any) {
    return quantity + ' ' + unit.name;
}

export function AerialDistance(lat1, lon1, lat2, lon2, unit = 'K') {
    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    } else {
        const radlat1 = (Math.PI * lat1) / 180;
        const radlat2 = (Math.PI * lat2) / 180;
        const theta = lon1 - lon2;
        const radtheta = (Math.PI * theta) / 180;
        let dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == 'K') {
            dist = dist * 1.609344;
        }
        if (unit == 'N') {
            dist = dist * 0.8684;
        }
        return dist;
    }
}

/**
 * Validate Location Object
 * @param { latitude, longitude }
 */
export function IsValidLocation(location: any) {
    return !!(
        !IsEmptyObject(location) &&
        location.latitude &&
        location.longitude
    );
    //  AccessNestedObject(location, 'latitude') && AccessNestedObject(location, 'longitude')
}

/**
 * Debounce
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 */
export function Debounce(func, wait, immediate?: boolean) {
    return function a(..._: any) {
        const context = this;
        const args = arguments;
        const later = () => {
            timeout = undefined;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function ReverseDebounce(
    func: MethodDto,
    waitTill: number,
    limit?: number
) {
    let timeout;
    let callCount = 0;

    return function a(_?: any) {
        const context = this;
        const args = arguments;

        if (timeout) {
            callCount++;
            return;
        }

        const later = () => {
            timeout = null;
            func.apply(context, args);
        };

        if (!limit || callCount >= limit) {
            callCount = 0;
            later();
        }

        timeout = setTimeout(() => {
            timeout = null;
        }, waitTill);
        callCount++;
    };
}

export function ReturnOpenProperty(
    value,
    options?: { convertBoolean?: boolean }
) {
    if (options?.convertBoolean) {
        // open property values are by default string in nature, to convert them to boolean convertBoolean should be true
        return ConvertBoolean(value);
    }

    return value;
}

export async function FetchPropertyFromCache(
    name?: string,
    isBusiness?: boolean
) {
    const property_meta = await GetItemAsync(OPEN_PROPERTY);
    const property_business = await GetItemAsync(OPEN_PROPERTY_BUSINESS);

    const property = isBusiness ? property_business : property_meta;

    if (name && property && name in property) {
        return property[name].value;
    }
    if (!name) return property;

    return false;
}

export async function StoreReferralCode(referralCode: string) {
    SetItem(REFERRAL_CODE, referralCode, { isNonVolatile: true });
}

export async function FetchReferralCode() {
    return await GetItemAsync(REFERRAL_CODE, true);
}

export function FetchReferralCodeSync() {
    return GetItem(REFERRAL_CODE, true);
}

/**
 * converts string 0 and 1 to corresponding boolean value
 * @param  {any} value
 */
export function ConvertBoolean(value) {
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    return !!+value;
}

/**
 * Transform any given array to key value pair object array.
 *
 * @param arr Array of object.
 * @param label Label Key
 * @param value Value Key
 * @returns object array
 */
export const TransformArrayObjectToKeyValueObject = (
    arr: ObjectDto[],
    key: string = 'key',
    value: string = 'name'
) => {
    const obj: ObjectDto = {};
    arr.forEach((str) => {
        if (!str[key]) return;
        obj[str[key]] = str[value];
    });
    return obj;
};

/**
 * Transform any given object to label & value pair array.
 *
 * @param obj Object.
 * @param label Label Key
 * @param value Value Key
 * @returns `Label` `Value` pair array
 */
export const TransformObjectToLabelValueObjectArray = (
    obj: ObjectDto,
    label: string = 'label',
    value: string = 'value'
) => {
    return Object.keys(obj).map((objKey: string) => ({
        [label]: objKey,
        [value]: obj[objKey],
    }));
};

export function RemoveEmptyObjectKeys(obj: ObjectDto) {
    return Object.keys(obj)
        .filter(function (k) {
            return (
                obj[k] != null &&
                !(
                    typeof obj[k] === 'object' &&
                    Object.keys(obj[k]).length === 0
                )
            );
        })
        .reduce(function (acc: any, k) {
            acc[k] =
                typeof obj[k] === 'object' && !Array.isArray(obj[k])
                    ? RemoveEmptyObjectKeys(obj[k])
                    : obj[k];
            return acc;
        }, {});
}

export function RemoveEmptyArray(array: unknown[]) {
    return array
        .filter(function (data) {
            return (
                data != null &&
                !(typeof data === 'object' && Object.keys(data).length === 0)
            );
        })
        .map(function (data) {
            if (typeof data === 'object') {
                const newData = RemoveEmptyObjectKeys(data);
                return Object.keys(newData).length > 0 ? newData : null;
            }
            return data;
        })
        .filter(Boolean);
}

/**
 * Returns true if object is having keys
 * false if object is empty
 * @param  {Object} obj
 */
export function IsObjectHaveKeys(obj) {
    return obj && typeof obj === 'object' && Object.keys(obj).length;
}

/** disable add button on product list ,cart list  */
export const DisableAddButtonProduct = ({ stock, in_cart_quantity }) => {
    let value = false;

    if (stock === 0) {
        if (in_cart_quantity <= 0) {
            value = true;
        }
    }
    return value;
};

/**
 * Accepts various params as object and prepare url for get call
 * @param  {string} url
 * @param  {object} params
 */
export function BuildUrlForGetCall(url: string, params: ObjectDto) {
    let queryPrefixer = '?';
    if (url.includes('?')) {
        queryPrefixer = '&';
    }
    let newUrl = url + queryPrefixer;
    for (const i in params) {
        const value = params[i];
        if (value) {
            newUrl += i + '=' + value + '&';
        }
    }
    return newUrl.slice(0, -1);
}

export const UPILinkGenerator = (obj: {
    upi: string;
    name?: string;
    amount?: number;
    currency?: string;
    mc?: string;
}) => {
    const keywords = {
        upi: 'pa',
        name: 'pn',
        amount: 'am',
        currency: 'cu',
        mc: 'mc',
    };

    if (IsEmptyObject(obj)) {
        return null;
    }

    const link = 'upi://pay';
    const finalObj = {};

    Object.keys(obj).forEach((key) => {
        const keyName = keywords[key];

        const keyValue = obj[key];
        if (keyName && keyValue) {
            finalObj[keyName] = keyValue;
        }
    });

    return BuildUrlForGetCall(link, finalObj);
};

export function DeepCloneObject(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    let temp = obj.constructor(); // changed
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj.isActiveClone = null;
            temp[key] = DeepCloneObject(obj[key]);
            delete obj.isActiveClone;
        }
    }
    return temp;
}

export function Capitalize(string: string) {
    return (string || '')
        .toLowerCase()
        .replace(/(^\w{1})|(\s+\w{1})/g, (match) => match.toUpperCase());
}

export function CapitalizeFirst(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function GetFileDetails(fileUrl: string) {
    try {
        let fileName = new URL(fileUrl || '').pathname.split('/').pop(); //@todo it throw invalid url when you try to make url using empty string rumesh sir
        let fileExtension = fileName.split('.').pop().toLowerCase();
        return {
            name: fileName,
            extension: fileExtension,
            mimeType: mimeLookup(fileName) || null,
        };
    } catch (error) {
        // console.error(error);
        return {};
    }
}

export function GetArrayDiff<T>(arr: T[], ...values: T[][]) {
    return arr.filter((x) => !values.flat().includes(x));
}

export function GetArrayFromObjArray<T>(arr: T[], key: string) {
    return arr.map((x) => x[key]);
}

/**
 * returns current environment
 */
export function IsProduction() {
    return true;
    if (
        typeof window !== 'undefined' &&
        window.location.href.includes('dartinbox.com')
    ) {
        return true;
    }
    return process.env['NODE_ENV_MODE'] === 'production';
}

/*
 * @param  {array} path
 * @param  {object} obj
 */
export function AccessNestedObject<T>(
    obj: object | T[],
    path: string | string[],
    valueNotFound: any = undefined
): T {
    if (
        !(
            (Array.isArray(path) ||
                typeof path == 'string' ||
                typeof path == 'number') &&
            obj &&
            typeof obj == 'object'
        )
    ) {
        return valueNotFound;
    }

    if (typeof path == 'number') {
        path = String(path);
    }

    if (typeof path == 'string') {
        path = path.split('.');
    }

    return path.reduce(
        (xs: any, x: string) => (xs?.[x] != undefined ? xs[x] : valueNotFound),
        obj
    );
}

export function IndexOfObjectInArray(array: any[], key: string, value: any) {
    return array.findIndex((obj) => AccessNestedObject(obj, key) === value);
}

export function GetObjectFromArray(array: any[] = [], key: string, value: any) {
    const objectIndex = IndexOfObjectInArray(array, key, value);
    return objectIndex > -1 ? array[objectIndex] : null;
}

export function GetUniqueObjectsFromArray(array: any[] = [], key: string) {
    return Array.from(
        new Map(
            array.map((item) => [AccessNestedObject(item, key), item])
        ).values()
    );
}
export function GetUniqueArrayValues(array: any[] = []) {
    return [...new Set(array)];
}

/**
 * Set value of any object included nested Objects.
 *
 * @param obj object
 * @param path String
 * @param value any
 * @returns object
 */
export const SetNestedObjectValue = (
    obj: ObjectDto,
    path: string | string[],
    value: any
) => {
    const keys = typeof path === 'string' ? path.split('.') : path;
    const lastKey = keys.pop();
    if (!lastKey) return obj;

    const pointer =
        keys.reduce((accumulator, currentValue) => {
            if (IsUndefinedOrNull(accumulator[currentValue]))
                accumulator[currentValue] = {};
            return accumulator[currentValue];
        }, obj) || {};

    pointer[lastKey] = value;

    return obj;
};

export const getJoiValidationOptions = () => {
    return {
        abortEarly: false,
        allowUnknown: true,
        errors: {
            wrap: {
                label: '',
            },
        },
    };
};

export const formatJoiErrorMessages = (error: any) => {
    if (!error) return {};
    if (!error.details?.length) return {};

    const errors: any = {};
    error.details.map((err: any, index: number) => {
        if (IsEmptyArray(err.path)) {
            errors[index] = err.message;
            return;
        }
        errors[err.path.join('_')] = err.message;
    });

    return errors;
};

export const IntToString = (num: any) => {
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
        return num;
    }
    let si = [
        { v: 1e3, s: 'K' },
        { v: 1e6, s: 'M' },
        { v: 1e9, s: 'B' },
        { v: 1e12, s: 'T' },
        { v: 1e15, s: 'P' },
        { v: 1e18, s: 'E' },
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
        if (num >= si[index].v) {
            break;
        }
    }
    return (
        (num / si[index].v).toFixed(2).replace(/\.0+$|(\.\d*[1-9])0+$/, '$1') +
        si[index].s
    );
};

// Club amounts from array by state_id
export const ClubAmountByStateId = (arr: DisputeStateType[]) => {
    const clubAmountsByStateId: Record<
        number,
        Omit<DisputeStateType, 'state_id'>
    > = {};

    arr.forEach((item) => {
        if (!clubAmountsByStateId[item.state_id]) {
            clubAmountsByStateId[item.state_id] = item;
            return;
        }

        clubAmountsByStateId[item.state_id].amount += item.amount;
        clubAmountsByStateId[item.state_id].settled_amount +=
            item.settled_amount;
    });
    return clubAmountsByStateId;
};
export const formatAmountForMatrix = (
    value: number = 0,
    type: MetrixItemType = 'number',
    noDecimal: boolean = false
) => {
    if (type === 'currency') {
        return FormatCurrency({ amount: value, noDecimal: noDecimal });
    }

    if (type === 'currency_unit') {
        if (value >= 0) {
            return FormatCurrencyUnit(value, noDecimal);
        } else {
            return '(' + FormatCurrencyUnit(Math.abs(value), noDecimal) + ')';
        }
    }

    return IntToString(value) + '';
};

export const GetDateValue = (
    date: any,
    format?: string,
    defaultDate?: Date
) => {
    if (!date || isDate(date)) return date;
    if (format) {
        return parse(date, format, new Date());
    }

    if (!isValid(new Date(date))) return defaultDate;

    return new Date(date);
};
export function getFinancialDate(date: Date) {
    const month = date.getMonth();
    if (month < 3) {
        return subYears(date, 1);
    }
    return date;
}

export function Ellipsis({
    text,
    length = 30,
}: {
    text: any;
    length?: number;
}) {
    if (typeof text == 'string') {
        return text.length > length - 2
            ? text.substring(0, length - 2) + '...'
            : text;
    } else {
        return text;
    }
}
export function FormatCurrencyAcc(amount: number, noDecimal?: boolean) {
    if (!amount) return FormatCurrency({ amount: amount || 0, noDecimal });
    return amount >= 0
        ? FormatCurrency({ amount, noDecimal })
        : `(${FormatCurrency({ amount: -amount, noDecimal })})`;
}

export function FormatDisplayDate(date: string | Date, showTime?: boolean) {
    if (IsUndefinedOrNull(date)) return null;

    return format(
        GetDateValue(date),
        showTime ? DISPLAY_DATE_TIME_FORMAT : DISPLAY_DATE_FORMAT
    );
}
export function GetObjectProperty(
    object: any,
    path: string | (string | number)[] = '',
    defVal: any = undefined
) {
    if (typeof path === 'string') path = path.split('.');
    if (Array.isArray(path) && path.length < 1)
        return object[path[0]] || defVal;
    return path.reduce(
        (xs, x) => (xs && xs[x] != undefined ? xs[x] : defVal),
        object
    );
}

/**
 * Sort Array of Object.
 *
 * @param data `array` Array of object to sort.
 * @param sortKey `string` Key to sort by. `Default: id`
 * @param sortOrder `asc | desc` Sorting order. `Default: 'asc'`
 * @returns `array`
 */
export const SortArrayObjectBy = <TData = any>(
    data: TData[],
    sortKey: string = 'id',
    sortOrder: 'asc' | 'desc' = 'asc',
    isDate?: boolean
) => {
    if (!sortKey || !data || IsEmptyArray(data) || data.length < 2) return data;

    let newData = [...data];
    newData.sort((prev: any, next: any) => {
        const prevVal = GetObjectProperty(prev, sortKey) || 0;
        const nextVal = GetObjectProperty(next, sortKey) || 0;

        if (sortOrder === 'asc') {
            if (isDate) {
                if (!prevVal || !nextVal) return 0;
                return GetDateValue(prevVal) - GetDateValue(nextVal);
            }
            if (typeof prevVal === 'string') {
                return prevVal
                    .toString()
                    .toLowerCase()
                    .localeCompare(nextVal.toString().toLowerCase(), 'en', {
                        numeric: true,
                    });
            }
            if (typeof prevVal === 'number') {
                return prevVal - nextVal;
            }
        }

        if (sortOrder === 'desc') {
            if (isDate) {
                if (!prevVal || !nextVal) return 0;
                return GetDateValue(nextVal) - GetDateValue(prevVal);
            }
            if (typeof prevVal === 'string') {
                return nextVal
                    .toString()
                    .toLowerCase()
                    .localeCompare(prevVal.toString().toLowerCase(), 'en', {
                        numeric: true,
                    });
            }
            if (typeof prevVal === 'number') {
                return nextVal - prevVal;
            }
        }

        return 0;
    });
    return newData;
};
export const getMinDate = (dates: any[]) => {
    const filteredDate = dates.filter(Boolean);
    return min(filteredDate);
};

export function getNumberFromString(str: any) {
    if (typeof str !== 'string') return str;
    return +str.replace(/[^0-9.-]/g, '');
}

/**
 * Groups array of object by any object property.
 *
 * @param objectArray array
 * @param property string
 * @returns object
 */
export const groupBy = <T extends ObjectDto>(
    objectArray: T[],
    property: string
): Record<string | number, T[]> => {
    return objectArray?.reduce((acc, obj) => {
        const key = GetObjectProperty(obj, property);
        if (!acc[key]) {
            acc[key] = [];
        }

        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
    }, {});
};

export const clubArrayObjectValues = <T extends {}>(
    objectArray: T[],
    ignoreKeys: string[] = []
) => {
    return objectArray.reduce((acc, obj) => {
        Object.keys(obj).forEach((key) => {
            if (ignoreKeys.includes(key)) return (acc[key] = obj[key]);
            acc[key] = (Number(acc[key]) || 0) + (Number(obj[key]) || 0);
        });
        return acc;
    }, {} as T);
};

export const RefetchGenericListing = () => {
    StoreEvent({ eventName: GENERIC_LISTING_REFETCH });
};

export const EmptyFunction = () => {
    //empty function
};

export const isPointerEventInsideElement = function (event: any, element: any) {
    let pos = {
        x: event.targetTouches ? event.targetTouches[0].pageX : event.pageX,
        y: event.targetTouches ? event.targetTouches[0].pageY : event.pageY,
    };
    let rect = element?.getBoundingClientRect();
    return (
        pos.x < rect.right &&
        pos.x > rect.left &&
        pos.y < rect.bottom &&
        pos.y > rect.top
    );
};

export function validateGstinFormat(gstin: string): boolean {
    // do regex test against given gstin
    return GSTIN_NUMBER.test(gstin);
}

export function parseToServerFileFormat(file: any) {
    const { size, serverUrl: document_url, type, name } = file || {};

    return {
        attributes: { size, type, name },
        document_url,
    };
}
export function validatePinCodeFormat(pincoide: string): boolean {
    // do regex test against given pincoide.length ===
    if (pincoide.length === 6) return true;
    return false;
    // return PINCODE_NUMBER.test(gstin);
}

export function validateIfscCodeFormat(ifsc: string) {
    return IFSC_CODE_REGEX.test(ifsc);
}
export const concateCatenateString = (
    value: string = '',
    separator: string = ' ',
    join: string = '-'
) => {
    return value
        .trim()
        .split(separator)
        .reduce((acc, value) => {
            if (!acc) return value;
            if (value) return `${acc}${join}${value}`;
            return '';
        }, '');
};

export const getPanNumberFromGstin = (gstin: string) => {
    return gstin.slice(2, 12);
};

export const toastBackendError = (response: any, defaultMessage?: string) => {
    if (response?.message || (!response?.columns && !!defaultMessage)) {
        Toast.error({ description: response?.message || defaultMessage });
    }
    if (response?.columns) {
        Object.values(response?.columns).forEach((column: any[]) => {
            for (let error of column) {
                Toast.error({
                    description: error,
                });
            }
        });
    }
};

export const isCustomColumnFullFilled = (data, custom_columns) => {
    for (let column of custom_columns) {
        if (
            column?.active &&
            column.is_mandatory &&
            column?.column_type.toLowerCase() !== 'boolean'
        ) {
            if (
                !data?.custom_field_data ||
                !data?.custom_field_data[column?.identifier]
            ) {
                Toast.error({ description: `${column.name} is required` });
                return false;
            }
        }
    }
    return true;
};

export const validEmailFormat = (email: string) => {
    return EMAIL_REGEX.test(email);
};

export const IsShowCoiDocument = (billing_type_id: number) => {
    return [
        BusinessType.LLP.value,
        BusinessType.PRIVATE_LIMITED.value,
    ].includes(billing_type_id);
};

export const isUiActionActive = (
    menu: ObjectDto,
    ui_key: string | string[]
) => {
    const { ui_actions } = menu || {};

    if (!IsEmptyArray(ui_actions)) {
        if (IsValidString(ui_key))
            return GetObjectFromArray(ui_actions, 'name', ui_key)
                ? true
                : false;
        if (Array.isArray(ui_key))
            return ui_key.some((key) =>
                GetObjectFromArray(ui_actions, 'name', key) ? true : false
            );
    }

    return false;
};

export const sanitizeUiAction = <T>(
    actions: (T & ObjectDto)[] = [],
    menu: any,
    not_visible_name?: boolean
) => {
    const sanitizeActionItem = (action: any) => {
        if (action?.expandableActions) {
            const sanitizedExpandableActions = sanitizeUiAction(
                action.expandableActions,
                menu,
                not_visible_name
            );
            return {
                ...action,
                expandableActions: sanitizedExpandableActions,
            };
        }
        const ui_action = GetObjectFromArray(
            menu?.ui_actions,
            'name',
            action?.key
        );
        const defaultVisible = action?.visible !== false;
        const displayName = action?.not_change_name
            ? action?.name
            : ui_action?.display_name || action?.name;

        return {
            ...action,
            name: not_visible_name ? '' : displayName,
            visible: defaultVisible && isUiActionActive(menu, action?.key),
        };
    };

    let newActions: (T & ObjectDto)[] = [];
    actions.forEach((action: any) => {
        const sanitizedItem = sanitizeActionItem(action);
        newActions.push(sanitizedItem);
    });
    return newActions;
};

//mapping normal json to nested example. {name.first_name} to {name:{first_name}}
export const mappingToNestedJson = (data: ObjectDto) => {
    let result = {};
    for (let [key, value] of Object.entries(data)) {
        result = SetNestedObjectValue(result, key, value);
    }

    return result;
};

// mapping nested json to normal json and actually it is reverse of mappingToNestedJson function
export const mappingNormalJson = (data: ObjectDto = {}) => {
    let result = {};

    const nestedToNormalJson = (base_key, data, join = '.') => {
        if (typeof data !== 'object')
            return {
                [base_key]: data,
            };
        let result = {};
        for (let [key, value] of Object.entries(data)) {
            let final_value = nestedToNormalJson(`${base_key}.${key}`, value);

            result = {
                ...result,
                ...final_value,
            };
        }
        return result;
    };
    for (let [key, value] of Object.entries(data)) {
        if (typeof value !== 'object' || Array.isArray(value)) {
            result[key] = value;
        } else {
            let json = nestedToNormalJson(key, value);
            result = {
                ...result,
                ...json,
            };
        }
    }
    return result;
};

export const excludeKeyFromObject = (keys: string[], data: any = {}) => {
    let result = {
        ...data,
    };
    for (let key of keys) delete result[key];
    return result;
};

export const parseStandardFormatValue = (propValue: any) => {
    let value = propValue;
    if (typeof value === 'string') {
        value = propValue.toLowerCase();
        if (['true', 'false'].includes(value)) {
            return value === 'true' ? true : false;
        }
        if (isDigit(value)) return Number(propValue);
    }

    return propValue;
};

export const isDigit = (val: string) => {
    return /^\d+$/.test(val);
};

export const getGstinAddress = (value) => {
    if (value?.address) return value?.address;
    const newValues = [];
    if (IsObject(value)) {
        Object.values(value).forEach((value) => {
            if (!!value) newValues.push(value);
        });
        return newValues.join(', ');
    }
    return value;
};

export const generateIdentifier = (value: string) => {
    return (value || '').split(' ').join('-');
};

/**
 * Get Unique UUID v4.
 *
 * @returns string
 */
export function uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export const getBankCodeName = (name: string) => {
    if (name) return name?.slice(0, 4);
    return '';
};

export const getActivityLogRoomString = (type: string, type_id: number) => {
    return `${type}.integration.room.${type_id}`;
};

//parse the column type value
export const parseTypeValue = (column: ObjectDto, value: any, types: any[]) => {
    const type = GetObjectFromArray(types, 'id', column?.type_id);
    if (!value) return null;

    if (column?.identifier === 'percentage') {
        return { name: column?.name, value: `${value}%` };
    }
    const type_name = type?.name || '';

    if (!type?.name) return null;

    switch ((type_name || '').toLowerCase()) {
        case 'date':
            return { name: column?.name, value: FormatDisplayDate(value) };
        case 'boolean':
            return { name: column?.name, value: value ? 'Yes' : 'No' };
        default:
            return { value, name: column?.name };
    }
};

export function UrlToFile(url: any, filename: string, mimeType: string) {
    return fetch(url)
        .then(function (res) {
            return res.arrayBuffer();
        })
        .then(function (buf) {
            return new File([buf], filename, { type: mimeType });
        });
}

export const getGstinStatusData = (status_id: number) => {
    switch (status_id) {
        //currently remove active badge
        // case GST_STATUS_TYPE.ACTIVE:
        //     return {
        //         text: 'Active',
        //         color: 'text-success',
        //         style: 'success',
        //     };
        case GST_STATUS_TYPE.CANCELLED:
            return {
                text: 'Cancelled GSTIN',
                color: 'text-error',
                style: 'error',
            };
        case GST_STATUS_TYPE.SUSPENDED:
            return {
                text: 'Suspended GSTIN',
                color: 'text-warning',
                style: 'warning',
            };
        default:
            return {};
    }
};
//remove duplicate values from array of object
export const removeDuplicateValueFromArrayObject = (
    array: ObjectDto[],
    key: string
) => {
    if (!IsArray(array)) return array;

    const newArray = [];
    array.forEach((el: ObjectDto) => {
        const data = GetObjectFromArray(
            newArray,
            key,
            AccessNestedObject(el, key)
        );

        if (IsEmptyObject(data)) newArray.push(el);
    });

    return newArray;
};

// Get File size in Kb
export function getFileSizeInKB(size: number, noOfDec: number = 2) {
    if (!size) return;
    // Get the size in bytes
    const fileSizeInBytes = size;
    // Convert bytes to kilobytes
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(noOfDec);

    return `${fileSizeInKB} KB`;
}

// return the key name from value
export function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

export function IsEmptyString(inputString) {
    // Check if the inputString is undefined or null
    if (!inputString) {
        return true;
    }

    // Use the trim() method to remove leading and trailing whitespace
    inputString = inputString?.trim();

    // Check if the trimmed string has a length of zero
    return inputString.length === 0;
}

export function AccessValueOnNestedObjectByKey(
    obj: ObjectDto,
    keyToFind: string,
    defaultValue: unknown = undefined
) {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            const result = AccessValueOnNestedObjectByKey(obj[key], keyToFind);
            if (result !== undefined) {
                return result;
            }
        } else if (key === keyToFind) {
            return obj[key]?.toString();
        }
    }
    return defaultValue;
}

export const isDateEqual = (date1: Date, date2: Date): boolean => {
    return date1?.toDateString() === date2?.toDateString();
};
export const isOnlyDateEqual = (date1: Date, date2: Date): boolean => {
    return format(date1, API_DATE_FORMAT) === format(date2, API_DATE_FORMAT);
};

// Define a function to get the Indian fiscal year for a given date
export function getIndianFiscalYear(date: any = new Date()) {
    // Indian fiscal year starts on April 1st and ends on March 31st of the next year
    const fiscalYearStart = addMonths(startOfYear(date), 3); // April 1st
    const fiscalYearEnd = endOfDay(subDays(addYears(fiscalYearStart, 1), 1)); // March 31st of the next year

    return { start_date: fiscalYearStart, end_date: fiscalYearEnd };
}

export const getActiveStatusText = (active: boolean, data: ObjectDto) => {
    if (!active && data?.attributes?.no_edit) return 'Deactivated';
    return active ? 'Active' : 'Inactive';
};
export const getDisplayCustomizeFilterLabel = (
    value: any,
    displayLabel: string
) => {
    if (IsUndefinedOrNull(value)) {
        return '';
    }
    return displayLabel;
};

export const hideReportsFromPwaHomeMenu = (modules: ObjectDto[] = []) =>
    modules.filter((module) => !module?.path?.includes('/reports'));

export const MatchAmount = (firstNumber: number, secondNumber: number) => {
    return Math.abs(firstNumber - secondNumber) < 1;
};

export const parseJSONString = (str: string) => {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch (error) {
        console.error(error);
        return null;
    }
};

/**
 * @description this will give the method params value by calculating the object
 *
 * @param {unknown} obj
 * @returns {object}
 */
export const getMethodParamsValue = (obj: unknown) => {
    if (typeof obj !== 'object') return obj;

    if (Object.keys(obj).length > 1) return obj;

    return Object.values(obj)[0];
};

/**
 *
 * @description Calculate the Sum from array of object
 *
 * @param {any[]} props
 * @param {string} key
 *
 * @returns {number}
 */
export const CalculateSumFromArrObj = (
    props: any[],
    key: string = 'amount'
): number => {
    if (IsEmptyArray(props)) return 0;
    return props.reduce((prev, next) => prev + next[key], 0);
};

export const getReconStatusText = (pgAmount: number, recoAmount: number) => {
    if (!recoAmount) return 'pending';
    if (pgAmount && !MatchAmount(pgAmount, recoAmount)) return 'error';
    return 'active';
};

export const compareAmount = (amount1: number, amount2: number) => {
    return Math.abs(amount1 - amount2) < 0.01;
};

/**
 * Checks if the given item is an object.
 *
 * @param {unknown} item - The item to be checked.
 * @return {boolean} Returns true if the item is an object, false otherwise.
 */
export function isObject(item: unknown): item is object {
    return !!item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Merges the properties of two objects deeply.
 *
 * @template TTarget - The type of the target object.
 * @param {TTarget} target - The target object to merge.
 * @param {any} source - The source object to merge.
 * @return {TTarget} - The merged object.
 */
export function deepMerge<TTarget extends object>(
    target: TTarget,
    source: any
): TTarget {
    const result: Record<string, any> = { ...target };
    const _source: Record<string, any> = source;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(_source[key])) {
                if (!(key in target)) {
                    result[key] = _source[key];
                } else {
                    result[key] = deepMerge(result[key], _source[key]);
                }
            } else {
                result[key] = _source[key];
            }
        });
    }

    return result as TTarget;
}

/**
 * Merges the properties of two objects shallow.
 *
 * @template TTarget - The type of the target object.
 * @param {TTarget} target - The target object to merge.
 * @param {any} source - The source object to merge.
 * @return {TTarget} - The merged object.
 */
export function shallowMerge<TTarget extends object>(
    target: TTarget,
    source: any
): TTarget {
    const result: Record<string, any> = { ...target };
    const _source: Record<string, any> = source;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            result[key] = _source[key];
        });
    }

    return result as TTarget;
}

export const getMinValue = (number1, number2) => {
    return number1 < number2 ? number1 : number2;
};

export const isLetterVariable = (val: string): boolean => {
    if (!val) return false;
    return val.startsWith('{{') && val.endsWith('}}');
};

export const getVariableParamsFromString = (input: string): string[] => {
    const regex = /{{(.*?)}}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
        variables.push(match[1].trim());
    }

    return variables;
};

export const replaceVariablesInString = (
    message: string,
    params: Record<string, string>
): string => {
    const regex = /{{(.*?)}}/g;
    return message.replace(regex, (_, variable) => {
        const trimmedVariable = variable.trim();
        return trimmedVariable in params ? params[trimmedVariable] : _;
    });
};

export function ChangeRecordToData(route: string) {
    if (!IsValidString(route)) return null;
    return route.replace('record', 'data');
}
