import dynamic from 'next/dynamic';
import { Fragment } from 'react';

import {
    FormElementProps,
    GetDateValue,
    IsArray,
    IsFunction,
} from '@finnoto/core';

import {
    CessTaxSelectorInput,
    CheckBox,
    ColorPickerInput,
    DateTimePicker,
    GstTaxSelectorInput,
    MaskedDatePickerInput,
    MentionFieldInput,
    ReferenceMultiSelectFilterInput,
    RichTextInput,
} from '../../Components';
import AutoFillSelect from '../../Components/Inputs/AutoFillSelect/autoFillSelect.component';
import { BooleanInput } from '../../Components/Inputs/Boolean/boolean.component';
import CurrencySelector from '../../Components/Inputs/CurrencySelector/currencySelector.component';
import { InputField } from '../../Components/Inputs/InputField/input.component';
import { InputPassword } from '../../Components/Inputs/InputField/input.password.component';
import { JsonEditorComponent } from '../../Components/Inputs/InputField/json.editor.component';
import { TextareaField } from '../../Components/Inputs/InputField/textarea.component';
import { MultiInput } from '../../Components/Inputs/MultiInput/multi.input.component';
import { MultiEmailInput } from '../../Components/Inputs/MultiInput/multiEmail.input.component';
import { RadioGroup } from '../../Components/Inputs/RadioGroup/radioGroup.component';
import Ratings from '../../Components/Inputs/Ratings/ratings.component';
import { NestedRefSelectBox } from '../../Components/Inputs/SelectBox/nestedRefSelectBox.component';
import { ReferenceSelectBox } from '../../Components/Inputs/SelectBox/referenceSelectBox.component';
import { SelectBox } from '../../Components/Inputs/SelectBox/selectBox.component';
import { CompactMultipleFileUploader } from '../Uploader/Components/compactMultipleFileUploader.components';
import { MultipleFileUploader } from '../Uploader/Components/MultipleFile.upload.component';
import { ProfileUploader } from '../Uploader/Components/profile.uploader.component';
import { SingleFileUploader } from '../Uploader/Components/SingleFile.upload.component copy';
import SmallMultipleFileUploader from '../Uploader/Components/smallMultipleFile.upload.component';

const SqlEditorComponent = dynamic(() =>
    import('../../Components/Inputs/InputField/sql.editor.component').then(
        ({ SqlEditorComponent }) => {
            return SqlEditorComponent;
        }
    )
);

/**
 * Returns a form control element based on the type provided. The form element returned is
 * dynamic and dependent on the type of input provided.
 *
 * @param {string} type - the type of input element to be returned. e.g text, select etc
 * @param {string} key - the unique identifier of the form control
 * @param {string} value - the value of the form control
 * @param {boolean} required - a flag to indicate if the form control is required
 * @param {Array} options - an array of options for select type input elements
 * @param {boolean} multiple - a flag to indicate if select input element supports multiple options
 * @param {function} onChange - a callback function that is triggered when the value of the form control changes
 * @param {function} onAsyncBlur - a callback function that is triggered when an input element loses focus asynchronously
 * @param {object} props - any other property that may be required to render the form control element
 * @return {JSX.Element} a dynamic form control element based on the type property provided
 *
 * @author Rumesh Udash
 */
export const formElements = ({
    type = 'text',
    key,
    value,
    required,
    options,
    multiple,
    onChange,
    onAsyncBlur,
    ...props
}: FormElementProps) => {
    switch (type) {
        case 'password':
            return (
                <InputPassword
                    key={key}
                    value={value ?? ''}
                    {...{ required, onChange }}
                    {...props}
                />
            );
        case 'textarea':
            return (
                <TextareaField
                    key={key}
                    type={type as any}
                    value={value ?? ''}
                    {...{ required, onChange }}
                    {...props}
                />
            );
        case 'select':
            return (
                <SelectBox
                    key={key}
                    value={value ?? null}
                    menuPosition='absolute'
                    isRequired={required}
                    onChange={(option) => {
                        if (IsArray(option))
                            return onChange(
                                option?.flatMap((opt: any) => opt.value) || null
                            );
                        onChange(option?.value ?? null);
                    }}
                    isDisabled={props.disabled}
                    {...{ options }}
                    {...props}
                />
            );
        // case 'tel':
        //     return (
        //         <InputField
        //             key={key}
        //             type={'tel'}
        //             value={value !== undefined ? value : ''}
        //             onAsyncBlur={onAsyncBlur}
        //             {...{ required, onChange }}
        //             {...props}
        //             max={9999999999}
        //             min={props?.min ? Math.floor(props?.min || 0) : props?.min}
        //         />
        //     );

        case 'reference_select':
            return (
                <ReferenceSelectBox
                    key={key}
                    value={value ?? null}
                    menuPosition='absolute'
                    isRequired={required}
                    onChange={(option) => {
                        if (props.isMulti && IsArray(option)) {
                            onChange(
                                option.flatMap((opt: any) => opt.value) || null
                            );
                            return;
                        }
                        onChange(option?.value ?? null);
                    }}
                    isDisabled={props.disabled}
                    controller={props?.controller}
                    sublabelKey={props?.sublabelKey}
                    {...props}
                />
            );
        case 'nested_ref_select':
            return (
                <NestedRefSelectBox
                    key={key}
                    value={value ?? null}
                    menuPosition='absolute'
                    isRequired={required}
                    onChange={(option) => {
                        if (props.isMulti && IsArray(option)) {
                            onChange(
                                option.flatMap((opt: any) => opt.value) || null
                            );
                            return;
                        }
                        onChange(option?.value ?? null);
                    }}
                    isDisabled={props.disabled}
                    controller={props?.controller}
                    sublabelKey={props?.sublabelKey}
                    {...props}
                />
            );
        case 'autofill_select':
            return (
                <AutoFillSelect
                    key={key}
                    value={value ?? ''}
                    required={props.required}
                    onSelect={(option) => onChange(option?.value)}
                    onChange={(value) => onChange(value)}
                    disabled={props.disabled}
                    controller={props?.controller}
                    sublabelKey={props?.sublabelKey}
                    {...{ options }}
                    {...props}
                />
            );

        case 'fileupload':
            return (
                <Fragment key={key}>
                    <MultipleFileUploader
                        className='w-full'
                        title={
                            <span className='max-w-[200px] text-center'>
                                <span className='link link-hover'>
                                    Click to upload
                                </span>{' '}
                                or drag and drop PDF, CSV
                            </span>
                        }
                        value={value ?? []}
                        onFileUpload={(data) => onChange([...data])}
                        {...props}
                    />
                </Fragment>
            );

        case 'profile_upload':
            return (
                <ProfileUploader
                    key={key}
                    value={value}
                    title={props?.title}
                    className='w-full'
                    onSingleFileUpload={(imgUrl: string) => onChange(imgUrl)}
                    {...props}
                />
            );

        case 'drag_drop_file_upload':
            return (
                <Fragment key={key}>
                    <MultipleFileUploader
                        value={value ?? []}
                        title={props?.title}
                        onFileUpload={(data) => {
                            if (data?.length < 0) return onChange(null);
                            onChange([...data]);
                        }}
                        ellipse_length={10}
                        {...props}
                    />
                </Fragment>
            );
        case 'single_file_upload':
            return (
                <Fragment key={key}>
                    <SingleFileUploader
                        value={value ?? []}
                        title={props?.title}
                        onFileUpload={(data) => {
                            if (data?.length < 0) return onChange(null);
                            onChange([...data]);
                        }}
                        required={required}
                        ellipse_length={10}
                        {...props}
                    />
                </Fragment>
            );
        case 'compact_multiple_file_upload':
            return (
                <Fragment key={key}>
                    <CompactMultipleFileUploader
                        value={value ?? []}
                        title={props?.title}
                        onFileUpload={(data) => {
                            if (data?.length < 0) return onChange(null);
                            onChange([...data]);
                        }}
                        ellipse_length={10}
                        {...props}
                    />
                </Fragment>
            );
        case 'small_multiple_file_upload':
            return (
                <Fragment key={key}>
                    <SmallMultipleFileUploader
                        value={value ?? []}
                        onFileUpload={(data) => {
                            if (data?.length < 0) return onChange(null);
                            onChange([...data]);
                        }}
                        title={props?.label}
                        ellipse_length={10}
                        required={required}
                        {...props}
                    />
                </Fragment>
            );

        case 'datetime':
            return (
                <InputField
                    key={key}
                    type='datetime-local'
                    value={value}
                    {...{ required, onChange }}
                    {...props}
                />
            );

        case 'boolean':
            return (
                <BooleanInput
                    value={value ?? null}
                    {...props}
                    {...{ isRequired: required, onChange }}
                />
            );

        case 'date':
        case 'masked_date':
            return (
                <MaskedDatePickerInput
                    key={key}
                    value={GetDateValue(value)}
                    isRequired={required}
                    {...{ required, onChange }}
                    {...props}
                />
            );

        case 'radio_group':
            return (
                <RadioGroup
                    key={key}
                    value={value}
                    appearance={props.appearance || 'primary'}
                    size={props.size || 'sm'}
                    {...{ required, options, onChange }}
                    {...props}
                />
            );

        case 'multi_text':
            return (
                <MultiInput
                    key={key}
                    value={value}
                    isRequired={required}
                    isDisabled={props.disabled}
                    {...{ required, options, onChange }}
                    {...props}
                />
            );
        case 'reference_multi_select':
            return (
                <ReferenceMultiSelectFilterInput
                    key={key}
                    value={value}
                    {...props}
                    isDisabled={props.disabled}
                    controller_type={props?.controller_type}
                    {...{ required, onChange }}
                />
            );

        case 'multi_email':
            return (
                <MultiEmailInput
                    key={key}
                    value={value}
                    isRequired={required}
                    isDisabled={props.disabled}
                    {...{ required, options, onChange }}
                    {...props}
                />
            );
        case 'currency':
            return (
                <CurrencySelector
                    key={key}
                    value={value}
                    onSelect={(option) => {
                        onChange(option.value);
                        if (IsFunction(props.handleFormData))
                            props.handleFormData('currency', {
                                ...(option.data || {}),
                                symbol: option.data?.attributes?.symbol,
                            });
                    }}
                    {...{ required, options }}
                    {...props}
                />
            );

        case 'gst_tax_input':
            return (
                <GstTaxSelectorInput
                    key={key}
                    value={value}
                    required={required}
                    {...{ required, onChange }}
                    {...props}
                />
            );
        case 'cess_tax_input':
            return (
                <CessTaxSelectorInput
                    key={key}
                    value={value}
                    required={required}
                    {...{ required, onChange }}
                    {...props}
                />
            );

        case 'date_time_separate':
            return (
                <DateTimePicker
                    key={key}
                    value={value}
                    isRequired={required}
                    {...{ required, onChange }}
                    {...props}
                />
            );
        case 'email_template':
            return (
                <RichTextInput
                    key={key}
                    value={value}
                    label={props.label}
                    {...{ onChange }}
                    {...props}
                />
            );
        case 'mention_input':
            return (
                <MentionFieldInput
                    key={key}
                    type={type as any}
                    value={value !== undefined ? value : ''}
                    onAsyncBlur={onAsyncBlur}
                    {...{ required, onChange }}
                    {...(props as any)}
                    min={props?.min ? Math.floor(props?.min || 0) : props?.min}
                />
            );
        case 'time':
            return (
                <InputField
                    key={key}
                    type='time'
                    value={value}
                    {...{ required, onChange }}
                    {...props}
                />
            );
        case 'color':
            return (
                <ColorPickerInput
                    key={key}
                    value={value}
                    {...{ required, onChange }}
                    {...props}
                />
            );

        case 'rating':
            return (
                <Ratings
                    key={key}
                    onChange={onChange}
                    {...props}
                    value={value}
                />
            );

        case 'sql-editor':
            return (
                <SqlEditorComponent
                    onChange={onChange}
                    value={value}
                    key={key}
                    {...props}
                />
            );
        case 'json-editor':
            return (
                <JsonEditorComponent
                    onChange={onChange}
                    value={value}
                    key={key}
                    {...props}
                />
            );

        default:
            return (
                <InputField
                    key={key}
                    type={type as any}
                    value={value !== undefined ? value : ''}
                    onAsyncBlur={onAsyncBlur}
                    {...{ required, onChange }}
                    {...props}
                    min={props?.min ? Math.floor(props?.min || 0) : props?.min}
                />
            );
    }
};
