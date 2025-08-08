// import Intl from 'react-native-intl';
// let Intl: any = Intl;

import { DEFAULT_CURRENCY_IDENTIFIER, INDIAN_RUPEE_SYMBOL } from '../Constants';

/**
 * Returns formatted value based on region and type
 * mostly used for currency formatting
 * @param  {int} {amount - integer value to be formatted
 * @param  {string} region='en-US' - can be en-IN, en-US
 * @param  {string} currency='USD' - examples - INR, USD
 * @param  {string} style='currency'} - examples - currency, etc
 */
export function FormatCurrency({
    amount,
    region = 'en-IN',
    currency = DEFAULT_CURRENCY_IDENTIFIER,
    style = 'currency',
    noDecimal = false,
}) {
    if (noDecimal) {
        return new Intl.NumberFormat(region, {
            style: style as 'decimal' | 'currency' | 'percent',
            currency: currency,
            maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
            minimumFractionDigits: 0,
        }).format(amount);
    }

    return new Intl.NumberFormat(region, {
        style: style as 'decimal' | 'currency' | 'percent',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

interface CurrencyProps {
    region?: string; // default 'en-IN'
    currency?: string; // Possible values are the ISO 4217 currency codes
    style?: 'decimal' | 'currency' | 'percent';
}

/**
 * Converts numbers, based on the provided locale
 *
 * ex to convert a number in display format - FormatCurrency(12222)
 * to convert a number to currency format - , FormatCurrency(12222, {currency: 'INR' })
 *
 * @param  {number} amount
 * @param  {string} region default 'en-IN'
 * @param  {string} currency(optional)  Possible values are the ISO 4217 currency codes
 * currency ex - INR
 *
 * @param  {string} style(optional) default decimal,
 * possible values
 * 'decimal' | 'currency' | 'percent'
 */
export function NewFormatCurrency(
    number,
    { region = 'en-IN', currency, style }: CurrencyProps = {}
) {
    const options: CurrencyProps = {};

    if (currency) {
        options.style = style || 'currency';
        options.currency = currency;
    }
    return new Intl.NumberFormat(region, options).format(number);
}

/**
 * Returns a number in Indian numbering system as a String
 *
 * @param {Number/String} number The integer to be converted.
 * @param {Number} decimals The number of digits needed after decimal point.
 * @return {String} Converted number as a String in Indian numbering unit.
 */

export function FormatCurrencyUnit(
    number: number,
    noDecimal?: boolean,
    decimals?: number,
    recursiveCall?: boolean
) {
    const decimalPoints = decimals || 2;
    const noOfLakhs = number / 100000;
    let displayStr: string;
    let isPlural: boolean;

    // Rounds off digits to decimalPoints decimal places
    function roundOf(amount: number) {
        return +amount.toFixed(decimalPoints);
    }
    if (noOfLakhs >= 1 && noOfLakhs <= 99) {
        const lakhs = roundOf(noOfLakhs);
        isPlural = lakhs > 1 && !recursiveCall;
        displayStr = `${lakhs} L${isPlural ? '' : ''}`;
    } else if (noOfLakhs >= 100) {
        const crores = roundOf(noOfLakhs / 100);
        const crorePrefix: any =
            crores >= 100000
                ? FormatCurrencyUnit(crores, noDecimal, decimals, true)
                : crores;
        isPlural = crores > 1 && !recursiveCall;
        displayStr = `${crorePrefix} C${isPlural ? '' : ''}`;
    } else {
        displayStr = FormatCurrency({ amount: roundOf(+number), noDecimal });
    }

    return displayStr;
}

export function GetNumberInAbbreviation(
    number,
    currency = INDIAN_RUPEE_SYMBOL
) {
    const isFloat = (number) => number % 1 !== 0;

    if (typeof number !== 'number') {
        return 'Invalid input';
    }
    isFloat(number) && (number = number.toFixed(2));
    let finalNumber;
    if (number >= 10000000) {
        finalNumber = number / 10000000 + 'C';
    } else if (number >= 100000) {
        finalNumber = number / 100000 + 'L';
    } else if (number >= 1000) {
        finalNumber = number / 1000 + 'K';
    } else {
        finalNumber = number;
    }
    return `${currency}${finalNumber}`;
}

export const getCurrencyWithSymbol = (symbol: string, amount: number) => {
    try {
        const currency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: symbol,
        });
        return currency.format(amount);
    } catch (err) {
        return `${symbol} ${amount}`;
    }
};

/**
 * Formats a number using the Intl.NumberFormat API.
 *
 * @param number - The number to be formatted.
 * @param maximumFractionDigits - The maximum number of decimal places to display.
 * @returns A string representation of the formatted number.
 */
export function FormatNumber(
    number: number,
    maximumFractionDigits = 2
): number {
    return Number(
        new Intl.NumberFormat('en-IN', {
            maximumFractionDigits,
            useGrouping: false,
        }).format(number)
    );
}

export const getAmountDiffPercentage = (amount1: number, amount2: number) => {
    return FormatNumber(((amount1 || 0) - (amount2 || 0)) / (amount2 || 1));
};
