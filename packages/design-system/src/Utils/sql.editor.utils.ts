import beautify from 'js-beautify';
import { format, FormatOptionsWithLanguage } from 'sql-formatter';

export const formatSqlQuery = (query: string) => {
    return format(query, sqlFormatConfig);
};
export const formatJsCode = (code: string) => {
    return beautify.js(code, {});
};

export const sqlFormatConfig: FormatOptionsWithLanguage = {
    language: 'postgresql',
    tabWidth: 4,
    keywordCase: 'upper',
    functionCase: 'upper',
};
