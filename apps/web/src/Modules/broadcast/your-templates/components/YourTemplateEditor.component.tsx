import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import {
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    useFormBuilder,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import {
    CheckBox,
    InputField,
    RichTextEditor,
    SelectBox,
} from '@finnoto/design-system';

import {
    BUTTON_CONFIG_TYPE,
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
            type: defaultValues?.title?.type,
            value: defaultValues?.title?.value,
        });

        const [sampleContent, setSampleContent] = useState<any>(
            defaultValues?.sample_contents || {}
        );
        const [configuration, setConfiguration] = useState<any>(
            defaultValues?.button_configurations
        );

        const [authConfig, setAuthConfig] = useState<any>(
            defaultValues?.authConfig
        );

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
                required: false,
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
                        authConfig,
                    },
                    opt
                );
            },
        });

        const isAuthenticationTemplate =
            watch('category_id') ===
            WhatsappTemplateCategoryEnum.AUTHENTICATION;

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
                    {!isAuthenticationTemplate && (
                        <div className='flex flex-col gap-2'>
                            <hr className='my-4 border-t border-gray-300' />
                            <YourTemplateEditorBroadcast
                                defaultValue={title}
                                getCurrentValue={(data) => {
                                    setTitle(data);
                                }}
                            />
                        </div>
                    )}

                    {!isAuthenticationTemplate ? (
                        <>
                            <div>
                                <hr className='my-4 border-t border-gray-300' />
                                <RichTextEditor
                                    features={['bold', 'italic', 'underline']}
                                    labelProps={{
                                        label: 'Body',
                                        required: true,
                                    }}
                                    error={errors['body']}
                                    html={
                                        watch?.('body') || defaultValues?.body
                                    }
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
                        </>
                    ) : (
                        <>
                            <AuthenticationTemplateConfiguration
                                authConfig={authConfig}
                                setAuthConfig={setAuthConfig}
                                handleFormData={handleFormData}
                            />
                            <YourTemplateEditorDisplaySampleContent
                                defaultVal={sampleContent}
                                title={title}
                                body={
                                    '{{code}} is your verification code. For your security, do not share this code.'
                                }
                                onBodyChange={(key, value) => {
                                    setSampleContent((prev) => ({
                                        [key]: value,
                                    }));
                                }}
                            />
                        </>
                    )}
                </div>
                {isAuthenticationTemplate ? (
                    <YourTemplatesPreview
                        sampleContent={sampleContent}
                        footer={
                            authConfig?.expiryTIme &&
                            `This code expires in ${authConfig?.expiryTIme} minutes.`
                        }
                        body={`{{code}} is your verification code. ${
                            authConfig?.showSecurityMessage
                                ? 'For your security, do not share this code.'
                                : ''
                        } `}
                        configuration={{
                            [BUTTON_CONFIG_TYPE.COPY_CODE]: 'Copy Code',
                        }}
                    />
                ) : (
                    <YourTemplatesPreview
                        sampleContent={sampleContent}
                        footer={watch?.('footer')}
                        title={title}
                        body={watch?.('body')}
                        configuration={configuration}
                    />
                )}
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

export const AuthenticationTemplateConfiguration = ({
    authConfig,
    setAuthConfig,
    handleFormData,
}: {
    setAuthConfig: (val) => void;
    authConfig: any;
    handleFormData: any;
}) => {
    const updateValue = (val: any) => {
        setAuthConfig((prev = {}) => ({
            ...prev,
            ...val,
        }));
    };

    const defaultValue = useMemo(() => {
        const commonMessage = `{{code}} is your verification code.`;
        if (authConfig?.showSecurityMessage)
            return `${commonMessage}  For your security, do not share this code.`;
        return commonMessage;
    }, [authConfig]);
    return (
        <div>
            <hr className='my-4 border-t border-gray-300' />
            <div className='gap-2 col-flex'>
                <div className='grid grid-cols-2 gap-3 items-center'>
                    <InputField
                        disabled
                        label='Body'
                        required
                        value={defaultValue}
                    />
                    {authConfig?.includeExpiryTime && (
                        <div className='grid grid-cols-2 gap-4 items-center'>
                            <InputField
                                label='Footer'
                                disabled
                                required
                                value={`This code expires in ${authConfig?.expiryTIme} minutes.`}
                            />
                            <InputField
                                required
                                label='Time'
                                value={authConfig?.expiryTIme}
                                onChange={(_time) =>
                                    updateValue({ expiryTIme: _time })
                                }
                                suffix='Minutes'
                            />
                        </div>
                    )}
                </div>

                <div className='flex gap-3 items-center'>
                    <CheckBox
                        rightLabel='Show Security Message'
                        checked={authConfig?.showSecurityMessage}
                        onChange={(_val) =>
                            updateValue({ showSecurityMessage: _val })
                        }
                    />
                    <CheckBox
                        rightLabel='Include Expiry Time'
                        checked={authConfig?.includeExpiryTime}
                        onChange={(_val) => {
                            if (_val) {
                                return updateValue({
                                    includeExpiryTime: _val,
                                    expiryTIme: 10,
                                });
                            }

                            updateValue({
                                includeExpiryTime: false,
                                expiryTIme: null,
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
