import { ReactNode } from 'react';

import { ObjectDto, SelectBoxOption } from '@finnoto/core';

import { SelectBoxProps } from './selectBox.types';

export interface ReferenceSelectBoxProps
    extends Omit<
        SelectBoxProps,
        'isClearable' | 'isAsync' | 'isLoading' | 'options'
    > {
    controller: any;
    method?: string;
    initMethod?: string;
    methodParams?: any;
    searchKey?: string;
    valueKey?: string;
    ignoreKey?: string;
    labelKey?: string;
    isClearable?: boolean;
    sublabelKey?: string | ((item: ObjectDto) => string);
    sublabelPrefix?: string;
    minLength?: number;
    onChangeInitData?: (data: any) => void;
    ignoreValues?: any[];
    initMethodSearchParam?: any;
    autoSelectZeroth?: boolean;
    notHide?: boolean;
    onOptionChange?: (data: any) => void;
    prefixItem?: (item: ObjectDto) => ReactNode;
    filterClassParams?: ObjectDto;
    idsKey?: string;
    activeKeys?: string[];
    refetchEnabled?: boolean;
    defaultOptions?: SelectBoxOption[];
    isCurrentUserShow?: boolean;
    limit?: number;
    disableNetwork?: boolean;
    isValueKeyNumber?: boolean;
}
