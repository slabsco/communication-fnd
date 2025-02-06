'use client';

import { forwardRef, memo, useCallback, useEffect, useMemo } from 'react';
import { useEffectOnce, useList, useUpdateEffect } from 'react-use';

import {
    FetchData,
    GENERIC_LIST_SELECT_REFETCH,
    IsArray,
    IsEmptyObject,
    IsFunction,
    ParseToSelectBoxOption,
    removeDuplicateValueFromArrayObject,
    SubscribeToEvent,
    UnsubscribeEvent,
} from '@finnoto/core';

import {
    Debounce,
    EmptyFunction,
    GetObjectFromArray,
    GetObjectProperty,
    IsEmptyArray,
    IsObject,
    IsValidString,
} from '../../../Utils/common.ui.utils';
import { ReferenceSelectBoxProps } from './referenceSelectBox.types';
import { SelectBox } from './selectBox.component';
import { SelectBoxOption } from './selectBox.types';

/**
 * Renders a SelectBox component with options loaded from the server.
 *
 * @param {Object} props - Component props
 * @param {string} props.controller - Name of the controller that provides options
 * @param {string} [props.method='find'] - Server method to call to get options
 * @param {string} [props.initMethod='show'] - Server method to call to get initial value
 * @param {Object} [props.methodParams] - Additional parameters to pass to server method
 * @param {string} [props.searchKey='str'] - Key to use when searching for options
 * @param {string} [props.valueKey='id'] - Key to use as option value
 * @param {string} [props.labelKey='name'] - Key to use as option label
 * @param {string} [props.sublabelKey='identifier'] - Key to use as option sub-label
 * @param {string} [props.sublabelPrefix] - Prefix to add to option sub-label
 * @param {number} [props.minLength=0] - Minimum length of input before searching
 * @param {string} [props.placeholder] - Placeholder text for search input
 * @param {boolean} [props.isSearchable=true] - Whether the search input is enabled
 * @param {function} [props.onChange=() => {}] - Function to call when an option is selected
 * @param {function} [props.onChangeInitData=EmptyFunction] - Function to call with initial options
 * @param {Array} [props.ignoreValues] - Values to ignore when loading options
 * @param {string} [props.initMethodSearchParam] - Parameter for initial value server method
 * @param {boolean} [props.autoSelectZeroth] - Whether to select first option automatically
 * @param {boolean} [props.notHide] - Whether to hide the SelectBox component if no options
 * @param {function} [props.onOptionChange=EmptyFunction] - Function to call when an option is changed
 * @return {JSX.Element} SelectBox component with loaded options
 *
 * @author Rumesh Udash
 */
export const ReferenceSelectBox = memo(
    forwardRef(
        (
            {
                controller,
                method = 'find',
                initMethod = 'show',
                methodParams,
                searchKey = 'str',
                valueKey = 'id',
                ignoreKey,
                labelKey = 'name',
                sublabelKey,
                sublabelPrefix,
                minLength = 0,
                placeholder,
                isSearchable = true,
                onChange = () => {},
                onChangeInitData = EmptyFunction,
                ignoreValues,
                initMethodSearchParam,
                autoSelectZeroth,
                notHide,
                onOptionChange = EmptyFunction,
                filterClassParams,
                idsKey = 'ids',
                prefixItem,
                refetchEnabled,
                defaultOptions = [],
                disableNetwork,
                isValueKeyNumber = true,
                ...rest
            }: ReferenceSelectBoxProps,
            ref
        ) => {
            const [
                tempOptions,
                { set: setTempOptions, push: pushTempOptions },
            ] = useList<SelectBoxOption>([]);

            const limit = rest?.limit || 10;

            const valueIds = useMemo(() => {
                if (!rest?.value || !idsKey || !isValueKeyNumber) return {};

                if (IsArray(rest?.value)) {
                    return {
                        [idsKey]: rest?.value
                            .map((value) => Number(value))
                            .filter(Boolean),
                    };
                }
                return {
                    [idsKey]: [Number(rest?.value)].filter(Boolean),
                };
            }, [idsKey, isValueKeyNumber, rest?.value]);

            const memoizedFilterParams = useMemo(
                () => filterClassParams,
                [filterClassParams]
            );

            useEffect(() => {
                if (disableNetwork) return;

                loadContent('', false, true).then((options) => {
                    onChangeInitData(options);
                    setTempOptions(options);

                    const valueOption = GetObjectFromArray(
                        options,
                        'value',
                        rest.value
                    );

                    if (!IsEmptyObject(valueOption)) {
                        onOptionChange(valueOption);
                    }
                    if (!valueOption && rest.value) {
                        if (!initMethod) return;
                        if (IsArray(rest.value)) {
                            // TO-DO: Remove this block after sometimes.
                            rest.value.forEach((value: any) => {
                                const valueOption = GetObjectFromArray(
                                    options,
                                    'value',
                                    value
                                );
                                if (valueOption) return;
                                loadContent(value, true).then(
                                    (valueOptions) => {
                                        pushTempOptions(...valueOptions);
                                    }
                                );
                            });
                            return;
                        }

                        // TO-DO: Remove this block after sometimes. Starting here

                        if (
                            GetObjectProperty(rest.value || {}, 'label') &&
                            GetObjectProperty(rest.value || {}, 'value')
                        )
                            return;

                        loadContent(rest.value, true).then((valueOptions) => {
                            pushTempOptions(...valueOptions);
                        });
                        // TO-DO: Up to here
                    } else if (rest.isRequired && options.length === 1) {
                        if (rest?.value) return;
                        onOptionChange(options[0]);
                        onChange(options[0]);
                    } else if (autoSelectZeroth && !IsEmptyArray(options)) {
                        if (rest?.value) return;
                        if (!IsEmptyArray(ignoreValues)) {
                            const optionsWithoutIgnoredValues = options.filter(
                                (item) =>
                                    !ignoreValues.includes(
                                        item[ignoreKey || valueKey]
                                    )
                            );
                            onChange(optionsWithoutIgnoredValues[0]);
                            onOptionChange(optionsWithoutIgnoredValues[0]);

                            return;
                        } // if the id is already present in ignore value doesn't include it and include another option
                        onChange(options[0]);
                        onOptionChange(options[0]);
                    }
                });
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [methodParams, ignoreValues, disableNetwork, method]);

            const IsValueExist = useMemo(() => {
                if (!valueIds[idsKey]) return false;

                return valueIds[idsKey].every((id) =>
                    tempOptions.flatMap((item) => item?.value).includes(id)
                );
            }, [idsKey, tempOptions, valueIds]);

            //controllable ignoreable values
            useUpdateEffect(() => {
                if (disableNetwork) return;
                if (IsValueExist) return;
                loadContent('').then((valueOptions) => {
                    pushTempOptions(...valueOptions);
                    const ids = valueIds[idsKey];

                    if (!IsEmptyArray(ids)) {
                        onOptionChange(
                            GetObjectFromArray(valueOptions, 'value', ids[0])
                        );
                    }
                });
            }, [ignoreValues, methodParams, valueIds]);

            useUpdateEffect(() => {
                //if the filterClassParams is changed we need to reset the options and change it to new options
                if (disableNetwork) return;
                if (IsValueExist) return;
                loadContent('').then((valueOptions) => {
                    setTempOptions(valueOptions);
                    const ids = valueIds[idsKey];

                    if (!IsEmptyArray(ids)) {
                        onOptionChange(
                            GetObjectFromArray(valueOptions, 'value', ids[0])
                        );
                    }
                });
            }, [memoizedFilterParams]);
            const initRefetch = useCallback(() => {
                loadContent('', false, true).then((response) =>
                    setTempOptions(response)
                );
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []);
            useEffectOnce(() => {
                if (!refetchEnabled) return;
                SubscribeToEvent({
                    eventName: GENERIC_LIST_SELECT_REFETCH,
                    callback: initRefetch,
                });
                return () => {
                    UnsubscribeEvent({
                        eventName: GENERIC_LIST_SELECT_REFETCH,
                        callback: initRefetch,
                    });
                };
            });

            useEffect(() => {
                if (!rest?.value) {
                    return;
                }
                if (GetObjectProperty(rest.value || {}, 'label')) {
                    if (!GetObjectProperty(tempOptions, 'value', rest?.value)) {
                        pushTempOptions(rest?.value);
                    }
                } else {
                    if (IsObject(rest.value)) return;
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [rest.value]);

            const getOptions = (input: string, callback = (_: any) => {}) => {
                if (!IsValidString(input)) return callback([]);
                if (disableNetwork) return callback([]);

                loadContent(input).then((options) => {
                    callback(options);
                });
            };
            const hasCurrentUserShow = useCallback(
                (search) => {
                    if (!rest?.isCurrentUserShow) return false;

                    if (!IsValidString(search)) return true;
                    return 'current user'.includes(search.toLowerCase());
                },
                [rest?.isCurrentUserShow]
            );
            const getMethodParams = useCallback(
                (value) => {
                    if (initMethodSearchParam) {
                        return IsFunction(initMethodSearchParam)
                            ? initMethodSearchParam(value)
                            : initMethodSearchParam;
                    }
                    return value;
                },
                [initMethodSearchParam]
            );

            const loadContent = async (
                search: string,
                isInit?: boolean,
                initialLoad?: boolean
            ) => {
                // if (!initialLoad) {
                //     if (!isInit && !IsValidString(search)) return [];
                //     if (!isInit && (search + '').length < minLength) return [];
                // }

                if (!controller) return [];

                const { success, response: api_response } = await FetchData({
                    className: controller,
                    method: isInit ? initMethod : method,
                    methodParams: isInit
                        ? getMethodParams(parseInt(search))
                        : methodParams,
                    classParams: {
                        [searchKey]: search,
                        no_metrics: false,
                        limit,
                        ...(filterClassParams || {}),
                        ...valueIds,
                    },
                });
                const response = api_response?.records || api_response;

                if (success) {
                    if (isInit) {
                        return ParseToSelectBoxOption(
                            IsArray(response) ? response : [response],
                            valueKey,
                            labelKey,
                            {
                                subLabel: sublabelKey,
                                sublabelPrefix,
                                prefixItem,
                                shouldShowValue: rest?.value,
                                activeKeys: rest?.activeKeys,
                                isCurrentUserShow: rest?.isCurrentUserShow,
                            }
                        );
                    }

                    const newDefaultOptions = search ? [] : defaultOptions;

                    let filteredItems = [...response, ...newDefaultOptions];

                    if (!IsEmptyArray(ignoreValues)) {
                        filteredItems = response.filter((item) => {
                            if (item[valueKey] === rest.value) return true;
                            return !ignoreValues.includes(
                                item[ignoreKey || valueKey]
                            );
                        });
                    }

                    if (
                        rest?.value &&
                        !IsObject(rest?.value) &&
                        !initMethod &&
                        !IsValidString(search)
                    ) {
                        if (
                            !GetObjectFromArray(
                                filteredItems,
                                valueKey,
                                rest?.value
                            )
                        ) {
                            filteredItems.unshift({
                                [valueKey]: rest?.value,
                                [labelKey]: rest?.value,
                            });
                        }
                    }

                    return ParseToSelectBoxOption(
                        [...filteredItems],
                        valueKey,
                        labelKey,
                        {
                            subLabel: sublabelKey,
                            sublabelPrefix,
                            prefixItem,
                            shouldShowValue: rest?.value,
                            activeKeys: rest?.activeKeys,
                            isCurrentUserShow: hasCurrentUserShow(search),
                        }
                    );
                }
                return [];
            };

            const handleOnChange = (
                option: SelectBoxOption | SelectBoxOption[],
                meta: any
            ) => {
                if (IsArray(option)) {
                    const newTemp = [];
                    option.forEach((opt) => {
                        if (
                            !GetObjectFromArray(
                                tempOptions,
                                'value',
                                opt?.value
                            )
                        ) {
                            newTemp.push(opt);
                        }
                    });
                    setTempOptions([...newTemp, ...tempOptions]);
                    onChange(option, meta);
                    return;
                }
                const isPresentOption = GetObjectFromArray(
                    tempOptions,
                    'value',
                    option?.value
                );

                if (!isPresentOption && option) {
                    setTempOptions([option, ...tempOptions]);
                }
                onOptionChange(option);
                onChange(option, meta);
            };
            const filterTempOptions = useMemo(() => {
                const options =
                    removeDuplicateValueFromArrayObject(tempOptions, 'value') ||
                    [];

                return options.filter((item) => {
                    if (item[valueKey] === rest.value) return true;
                    return !(ignoreValues || []).includes(
                        item[ignoreKey || valueKey]
                    );
                });
            }, [ignoreKey, ignoreValues, rest.value, tempOptions, valueKey]);

            return (
                <SelectBox
                    placeholder={placeholder || 'Search...'}
                    options={filterTempOptions}
                    getOptions={Debounce(getOptions, 200)}
                    onChange={handleOnChange}
                    isClearable={!rest.isRequired}
                    isSearchable={isSearchable}
                    refetchOptions={initRefetch}
                    {...rest}
                    isAsync
                    ref={ref}
                />
            );
        }
    )
);
