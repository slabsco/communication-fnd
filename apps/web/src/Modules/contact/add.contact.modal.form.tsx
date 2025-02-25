import { useMemo } from 'react';
import { useList } from 'react-use';

import {
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    IsEmptyObject,
    ObjectDto,
    RefetchGenericListing,
    toastBackendError,
    useFormBuilder,
} from '@finnoto/core';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import {
    Button,
    IconButton,
    InputField,
    ModalBody,
    ModalContainer,
    ModalFooter,
    SlidingPane,
} from '@finnoto/design-system';

import { DeleteSvgIcon } from 'assets';

const AddContactForm = ({
    initial_data,
    callback,
}: {
    initial_data?: any;
    callback: (_: any) => void;
}) => {
    const [attributes, { updateAt, push, removeAt }] = useList<ObjectDto>(
        ...[initial_data?.custom_attributes || []]
    );

    const schema: FormBuilderFormSchema = {
        name: {
            type: 'text',
            placeholder: 'John Doe',
            label: 'Name',
            required: true,
        },
        dialing_code: {
            type: 'number',
            placeholder: 'Enter Dial Code',
            label: 'Dialling Code',
            prefix: <div>+</div>,
            required: true,
            maxLength: 3,
        },
        mobile: {
            type: 'text',
            placeholder: 'Enter Mobile',
            label: 'Mobile Number',
            required: true,
            maxLength: 10,
        },
    };

    const onSubmit: FormBuilderSubmitType = async (values, { setError }) => {
        const { success, response } = await FetchData({
            className: ContactController,
            method: 'create',
            classParams: {
                id: initial_data?.id,
                ...values,
                custom_attributes: attributes?.map((obj) => {
                    if (obj?.key) return obj;
                }),
            },
        });

        if (success) {
            callback?.(response);
            RefetchGenericListing();
            return SlidingPane.close();
        }

        if (response?.columns) setError(response?.columns);
        else toastBackendError(response?.columns);
    };

    const { renderFormFields, handleSubmit } = useFormBuilder({
        formSchema: schema,
        initValues: {
            name: initial_data?.display_name || initial_data?.name,
            mobile: initial_data?.mobile,
            dialing_code: initial_data?.dialing_code,
        },
        onSubmit,
    });

    const addAttributesDisabled = useMemo(() => {
        if (attributes?.length <= 0) return false;
        if (IsEmptyObject(attributes[attributes.length - 1])) return true;
    }, [attributes]);
    return (
        <ModalContainer title='Add Contact'>
            <ModalBody className='flex-1 gap-2 col-flex'>
                {renderFormFields('name')}

                {renderFormFields('dialing_code')}
                {renderFormFields('mobile')}

                <div className='gap-2 mt-2 col-flex'>
                    <div className='max-h-[200px] col-flex gap-2 overflow-y-auto '>
                        {attributes.map((att, index) => {
                            return (
                                <div
                                    key={att.key}
                                    className='relative gap-1 p-2 rounded border col-flex bg-base-300'
                                >
                                    <IconButton
                                        icon={DeleteSvgIcon}
                                        outline
                                        size='xs'
                                        className='absolute top-1 right-1'
                                        appearance='error'
                                        onClick={() => {
                                            removeAt(index);
                                        }}
                                    />
                                    <InputField
                                        label='Key'
                                        size='sm'
                                        value={att?.key}
                                        onBlur={(e) => {
                                            updateAt(index, {
                                                ...attributes[index],
                                                key: e,
                                            });
                                        }}
                                        placeholder={'Some attributes key here'}
                                        required
                                    />
                                    <InputField
                                        size='sm'
                                        label='Value'
                                        placeholder={'Enter Values here'}
                                        required
                                        value={att?.value}
                                        onBlur={(e) => {
                                            updateAt(index, {
                                                ...attributes[index],
                                                value: e,
                                            });
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <Button
                        disabled={addAttributesDisabled}
                        appearance='primary'
                        outline
                        onClick={() => {
                            push({});
                        }}
                    >
                        Add Attributes
                    </Button>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    appearance='errorHover'
                    outline
                    type='button'
                    onClick={() => SlidingPane.close()}
                >
                    Cancel
                </Button>
                <Button defaultMinWidth onClick={handleSubmit}>
                    Save
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};

export default AddContactForm;

export const openAddContactForm = (
    initial_data?: any,
    options?: { callback?: (__: any) => void }
) => {
    SlidingPane.open({
        component: AddContactForm,
        props: { initial_data, ...options },
    });
};
