import { useMemo, useState } from 'react';

import {
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    IsEmptyObject,
    IsUndefinedOrNull,
    Navigation,
    ObjectDto,
    RemoveEmptyArray,
    TEAM_INBOX_SPLIT_LIST,
    toastBackendError,
    useFormBuilder,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Button,
    InputField,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';

import { openAddContactForm } from '../../contact/add.contact.modal.form';
import { AsyncTemplateViewer } from '../../template/components/TemplateViewer.component';
import { getVariableExamples } from '../../template/constants/template.format';

const AddInboxModal = ({
    contact_id,
    disableContact = false,
    callback,
}: {
    contact_id: number;
    disableContact?: boolean;
    callback?: any;
}) => {
    const [templateData, setTemplateData] = useState<any>();
    const [attributes, setAttributes] = useState({});

    const formSchema: FormBuilderFormSchema = {
        contact_id: {
            type: 'reference_select',
            placeholder: 'Select The contact here',
            name: 'Contact',
            label: 'Contact',
            controller: ContactController,
            required: true,
            labelKey: 'display_name',
            disabled: disableContact,
            sublabelKey: 'wa_id',
        },
        template_id: {
            type: 'reference_select',
            controller: CommunicationTemplateController,
            label: 'Template',
            placeholder: 'Select Template',
            required: true,
            autoSelectZeroth: true,
            sublabelKey: 'identifier',
        },
    };

    const api_sample_contents = useMemo(() => {
        if (!templateData) return {};
        return getVariableExamples(templateData?.template_config);
    }, [templateData]);

    const isAllAttributesFilled = useMemo(() => {
        if (IsEmptyObject(api_sample_contents)) return true;
        if (IsEmptyObject(attributes)) return false;

        const sample_contents = Object.values(api_sample_contents);
        const att = RemoveEmptyArray(Object.values(attributes));

        if (sample_contents.length === att.length) return true;
        return false;
    }, [attributes, api_sample_contents]);

    const onSubmit: FormBuilderSubmitType = async (
        values: ObjectDto,
        { setError, isCreateAnother }
    ) => {
        const { success, response } = await FetchData({
            className: TeamInboxController,
            method: 'create',
            classParams: { ...values, custom_attributes: attributes },
        });

        Modal.closeAll();
        if (!success) return toastBackendError(response);

        Navigation.navigate({ url: `${TEAM_INBOX_SPLIT_LIST}/${response.id}` });
        callback?.(response);
    };

    const { renderFormFields, hasError, handleFormData, watch, handleSubmit } =
        useFormBuilder({
            formSchema,
            onSubmit,
            initValues: { contact_id },
        });

    return (
        <ModalContainer title='Send Message'>
            <ModalBody className='grid flex-1 grid-cols-2 gap-6'>
                <div className='col-flex'>
                    <div className='w-full col-flex'>
                        {renderFormFields('contact_id')}
                        {!disableContact && (
                            <Button
                                size='xs'
                                appearance='plain'
                                outline
                                className='justify-end ml-auto text-right w-fit'
                                onClick={() =>
                                    openAddContactForm(undefined, {
                                        callback: (data) => {
                                            handleFormData(
                                                'contact_id',
                                                data?.id
                                            );
                                        },
                                    })
                                }
                            >
                                Add Contact
                            </Button>
                        )}
                    </div>
                    {renderFormFields('template_id')}
                    {!IsUndefinedOrNull(templateData) &&
                        !IsEmptyObject(api_sample_contents) && (
                            <div className='gap-2 items-center p-2 mt-4 w-full rounded col-flex bg-base-300'>
                                {Object.entries(api_sample_contents)?.map(
                                    ([key, value]) => {
                                        return (
                                            <InputField
                                                label={key}
                                                size='sm'
                                                required
                                                key={key}
                                                placeholder={key}
                                                className='w-full'
                                                value={attributes?.[key]}
                                                onChange={(e) => {
                                                    setAttributes((prev) => ({
                                                        ...prev,
                                                        [key]: e,
                                                    }));
                                                }}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        )}
                </div>
                <div className='flex justify-center items-center p-4 rounded bg-primary h-[650px]'>
                    <AsyncTemplateViewer
                        getData={(data) => {
                            setTemplateData(data);
                        }}
                        id={watch('template_id')}
                        sample_contents={attributes}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='py-4 justify'>
                <div className='flex-1 gap-4 row-flex'>
                    <Button
                        appearance='errorHover'
                        onClick={() => Modal.close()}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance='primary'
                        defaultMinWidth
                        progress
                        onClick={handleSubmit}
                        disabled={!isAllAttributesFilled || hasError()}
                    >
                        Send
                    </Button>
                </div>
            </ModalFooter>
        </ModalContainer>
    );
};
export const openAddInbox = (options?: {
    contact_id?: number;
    disableContact?: boolean;
    callback?: () => void;
}) => {
    Modal.open({
        component: AddInboxModal,
        modalSize: 'lg',
        props: { ...options },
    });
};
