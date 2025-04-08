import { forwardRef, useImperativeHandle, useState } from 'react';

import {
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    useFormBuilder,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { RichTextEditor, SelectBox } from '@finnoto/design-system';

import {
    WhatsappTemplateCategoryEnum,
    WhatsappTemplateStatusEnum,
} from '../enums/whatsapp.template.category.enum';
import YourTemplateEditorButton from './YourTemplateEditor.button.component';
import YourTemplateEditorDisplaySampleContent from './YourTemplateEditor.display.sample.content';
import YourTemplateEditorBroadcast from './YourTemplateEditorBroadcastTitle';
import { YourTemplatesPreview } from './YourTemplatesPriview.component';

const YourTemplateEditor = forwardRef(
    (
        {
            onSubmit,
            defaultValues,
        }: { onSubmit?: FormBuilderSubmitType; defaultValues?: any },
        ref
    ) => {
        const [title, setTitle] = useState<any>({
            type: defaultValues?.title?.type || 'text',
            value: defaultValues?.title?.value || '',
        });
        const [sampleContent, setSampleContent] = useState<any>(
            defaultValues?.sample_contents || {}
        );
        const [configuration, setConfiguration] = useState<any>(
            defaultValues?.button_configurations
        );

        console.log({ defaultValues });

        const formSchema: FormBuilderFormSchema = {
            name: {
                type: 'text',
                placeholder: 'Template Name',
                label: 'Template Name',
                required: true,
            },
            footer: {
                type: 'text',
                placeholder: 'Enter Footer',
                label: 'Footer',
                required: false,
            },
            body: {
                type: 'text',
                required: true,
            },
            category_id: {
                type: 'select',
                placeholder: 'Template Name',
                label: 'Template Name',
            },
            language_id: {
                type: 'reference_select',
                controller: CommunicationTemplateController,
                label: 'Language',
                method: 'findLanguage',
                placeholder: 'Select Language',
                labelKey: 'name',
                sublabelKey: 'code',
                required: true,
                disabled: defaultValues?.language_id,
            },
        };

        const {
            renderFormFields,
            handleFormData,
            watch,
            disableSubmit,
            errors,
            handleSubmit,
            hasError,
        } = useFormBuilder({
            initValues: {
                language_id: 1,
                category_id: WhatsappTemplateCategoryEnum.MARKETING,
                ...defaultValues,
            },
            formSchema: formSchema,
            onSubmit: async (value: any, opt) => {
                return onSubmit?.(
                    {
                        ...value,
                        title,
                        button_configurations: configuration,
                        sample_contents: sampleContent,
                    },
                    opt
                );
            },
        });

        useImperativeHandle(
            ref,
            () => ({
                disableSubmit,
                handleSubmit,
            }),
            [disableSubmit, handleSubmit]
        );

        return (
            <div className='flex overflow-hidden flex-1 gap-7 w-full h-full border-red-500'>
                <div className='flex overflow-y-auto flex-col flex-1 gap-4 p-4 w-full h-full bg-white rounded-sm'>
                    <div className='grid grid-cols-3 gap-4'>
                        {renderFormFields('name')}
                        <div className='flex flex-col gap-2'>
                            <SelectBox
                                isDisabled={
                                    defaultValues?.status_id ===
                                    WhatsappTemplateStatusEnum.APPROVED
                                }
                                isSearchable={false}
                                label='Category'
                                value={watch?.('category_id')}
                                onChange={(opt) => {
                                    handleFormData('category_id', opt?.value);
                                }}
                                options={[
                                    {
                                        label: 'Marketing',
                                        value: WhatsappTemplateCategoryEnum.MARKETING,
                                    },
                                    {
                                        label: 'Authentication',
                                        value: WhatsappTemplateCategoryEnum.AUTHENTICATION,
                                    },
                                    {
                                        label: 'Utility',
                                        value: WhatsappTemplateCategoryEnum.UTILITY,
                                    },
                                ]}
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            {renderFormFields('language_id')}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <hr className='my-4 border-t border-gray-300' />
                        <YourTemplateEditorBroadcast
                            defaultValue={title}
                            getCurrentValue={(data) => {
                                setTitle(data);
                            }}
                        />
                    </div>

                    <div>
                        <hr className='my-4 border-t border-gray-300' />
                        <RichTextEditor
                            features={['bold', 'italic', 'underline']}
                            labelProps={{ label: 'Body', required: true }}
                            error={errors['body']}
                            html={watch?.('body') || defaultValues?.body}
                            getHtml={(html) => {
                                handleFormData('body', html);
                            }}
                            enablePreview={false}
                        />
                    </div>
                    <div>
                        <hr className='my-4 border-t border-gray-300' />
                        {renderFormFields('footer')}
                    </div>

                    <YourTemplateEditorButton
                        configuration={configuration}
                        setConfiguration={setConfiguration}
                    />
                    <div className='flex flex-col'></div>
                    <YourTemplateEditorDisplaySampleContent
                        defaultVal={sampleContent}
                        title={title}
                        body={watch?.('body') || defaultValues?.body}
                        onBodyChange={(key, value) => {
                            setSampleContent((prev) => ({
                                ...prev,
                                [key]: value,
                            }));
                        }}
                    />
                </div>
                <YourTemplatesPreview
                    sampleContent={sampleContent}
                    footer={watch?.('footer')}
                    title={title}
                    body={watch?.('body')}
                    configuration={configuration}
                />
            </div>
        );
    }
);

export default YourTemplateEditor;

export const ConvertRawApiDataIntoFormSuitable = (apiResponse: any) => {
    return {
        category_id: apiResponse?.category_id,
        language_id: apiResponse?.language_id,
        name: apiResponse.name,
        body: apiResponse.body?.script,
        footer: apiResponse.footer?.script,
        title: apiResponse?.title,
        button_configurations: apiResponse?.button_configurations,
        sample_contents: apiResponse?.sample_contents,
        id: apiResponse?.id,
    };
};
