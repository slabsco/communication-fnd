import { Schema } from 'joi';
import { ReactNode } from 'react';
import {
    Control,
    FieldValues,
    UseFormGetValues,
    UseFormReset,
} from 'react-hook-form';

import { ObjectDto } from '../backend/Dtos';
import { ArcCustomFieldTypeEnum } from '../Constants';
import { FinopsCustomFieldType } from '../Constants/preference.constants';
import { ButtonAppearanceType, ButtonSizeType } from './component.types';

export interface FormBuilderChildrenProps {
    isSubmitting: boolean;
    isValidating: boolean;
    // isValidated: boolean;
    formDataUpdated: boolean;
    // hasError: boolean;
    values: ObjectDto;
    touched: ObjectDto;
    errors: ObjectDto;
    disableSubmit: boolean;
    handleFormData: FormBuilderHandleFormDataType;
    handleSubmit: () => Promise<void>;
    isCreateAnother?: boolean;
    setCreateAnother?: (value?: boolean) => void;
    // pushTouched?: (value: string) => void;
}

export type Dependency<SchemaType> = {
    type: DependencyType;

    sourceField: string | string[];
    targetField: string;
    when: (sourceValue: any, targetValue: any) => boolean;
    customProps?: (sourceValue: any, targetValue: any) => ObjectDto | ObjectDto;
};

export enum DependencyType {
    DISABLE,
    REQUIRE,
    HIDE,
    CUSTOM_PROPS,
}
export interface FormBuilderProps {
    loading?: boolean;
    className?: string;
    layoutClassName?: string;
    footerClassName?: string;
    initValues?: ObjectDto | ((payload?: unknown) => Promise<ObjectDto>);
    formSchema?: FormBuilderFormSchema;
    functionRegistry?: FormBuilderFunctionRegistryType;
    buttonAppearance?: ButtonAppearanceType;
    buttonLabel?: string;
    buttonSize?: ButtonSizeType;
    layout?: FormLayoutType;
    withModalBody?: boolean;
    withSaveAndNew?: boolean;
    saveAndCreateAnotherClassName?: string;
    modalBodyClassName?: string;
    customFieldType?: FinopsCustomFieldType | ArcCustomFieldTypeEnum;
    onSubmit?: FormBuilderSubmitType;
    stickySaveButton?: boolean;
    // onFieldValueChange?: (
    //     key: string,
    //     value: any,
    //     values: { prevValues: ObjectDto; newValues: ObjectDto }
    // ) => void | ObjectDto;
    children?: (props: FormBuilderChildrenProps) => ReactNode;
    formKey?: string;
    context?: ObjectDto;
    dependencies?: Dependency<Schema>[];
    orientation?: 'horizontal' | 'vertical';
}
export interface FormBuilderFormSchema {
    [key: string]: FormSchemaValues;
}
export interface FormSchemaValues {
    type: FormTypes;
    value?: any;
    name?: string;
    validationLabel?: string;
    label?: string;
    labelComponent?: ReactNode;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    message?: ReactNode;
    required?: boolean;
    visible?: boolean;
    autoFocus?: boolean;
    prefix?: ReactNode;
    suffix?: ReactNode;
    hidePasswordToggle?: boolean;
    refKey?: string;
    regex?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    disabled?: boolean;
    rows?: number;
    source?:
        | 'common'
        | 'business'
        | 'vendor'
        | 'document'
        | 'analysable_document'
        | 'public_vendor';
    multiple?: boolean;
    autoUppercase?: boolean;
    messageComponent?: (
        value: any,
        options: {
            getValues: UseFormGetValues<ObjectDto>;
            errors: ObjectDto;
            hasError: boolean;
            handleFormData: FormBuilderHandleFormDataType;
        }
    ) => ReactNode;
    minDate?: string | Date;
    maxDate?: string | Date;
    dateFormat?: string;
    options?: unknown[];
    asyncValidation?: string;
    formSchema?: FormBuilderFormSchema;
    allow_validation?: string | null;
    [x: string]: any;
}

export type FormBuilderAsyncValidationType = (
    value: any,
    getValues: UseFormGetValues<ObjectDto>,
    handleFormData: FormBuilderHandleFormDataType
) => Promise<string | true | void>;

export type FormBuilderSubmitType = (
    values: ObjectDto,
    options: {
        isCreateAnother: boolean;
        setError: (errors: ObjectDto) => void;
        reset: UseFormReset<ObjectDto>;
    }
) => Promise<unknown>;

export type FormBuilderHasErrorType = (key?: string) => boolean;

export interface FormBuilderFunctionRegistryType {
    [x: string]: FormBuilderAsyncValidationType;
}

export type FormBuilderHandleFormDataType = (
    key: string,
    value: any,
    shouldValidate?: boolean
) => void;

export type FormLayoutType = 'one-column' | 'two-column' | 'three-column';

export type FormTypes =
    | 'object'
    | 'card'
    | 'text'
    | 'search'
    | 'email'
    | 'number'
    | 'textarea'
    | 'tel'
    | 'date'
    | 'password'
    | 'boolean'
    | 'select'
    | 'fileupload'
    | 'profile_upload'
    | 'url'
    | 'hidden'
    | 'drag_drop_file_upload'
    | 'reference_select'
    | 'autofill_select'
    | 'email_template'
    | 'mention_input'
    | 'rating'
    | string;

export interface FormElementProps {
    type?: FormTypes;
    key?: string;
    value?: any;
    required?: boolean;
    multiple?: boolean;
    onChange?: (value: any, ...arg: any) => void;
    onAsyncBlur?: (value: any, next: () => void) => void;
    [key: string]: any;
    controller?: any;
    methodParams?: any;
    method?: any;
    classParams?: any;
    labelKey?: string;
    valueKey?: string;
}

export interface FormBuilderElementProps
    extends Omit<FormElementProps, 'value'> {
    control: Control<FieldValues>;
}

export type FormBuilderRenderElement = (
    elementKey: string,
    schema?: FormSchemaValues,
    props?: any
) => any;
