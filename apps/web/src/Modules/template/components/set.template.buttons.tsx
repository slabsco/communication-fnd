import React from 'react';

import {
    Button,
    IconButton,
    InputField,
    SelectBox,
} from '@finnoto/design-system';

import { useTemplate } from '../template.context';

import { CrossSvgIcon } from 'assets';

const MAX_BUTTONS = 10;

const typeOptions = [
    { label: 'Quick Reply', value: 'QUICK_REPLY' },
    { label: 'Visit website (URL)', value: 'URL' },
    { label: 'Call phone number', value: 'PHONE_NUMBER' },
    { label: 'Copy code', value: 'COPY_CODE' },
];

const SetTemplateButton = () => {
    const { state, dispatch } = useTemplate();
    const buttons = state.components.buttons || [];

    const updateButtons = (next: typeof buttons) => {
        dispatch({ type: 'UPDATE_BUTTONS', payload: next });
    };

    const updateAt = (index: number, patch: Record<string, any>) => {
        const next = buttons.map((b, i) =>
            i === index ? { ...b, ...patch } : b
        );
        updateButtons(next);
    };

    const changeType = (index: number, nextType: string) => {
        const defaultsByType: Record<string, any> = {
            QUICK_REPLY: { type: 'QUICK_REPLY', text: '' },
            COPY_CODE: { type: 'COPY_CODE', example: '' },
            PHONE_NUMBER: { type: 'PHONE_NUMBER', text: '', phone_number: '' },
            URL: {
                type: 'URL',
                text: '',
                url: '',
                example: [''],
                is_dynamic: false,
            },
        };
        const next = buttons.map((b, i) =>
            i === index ? defaultsByType[nextType] ?? { type: nextType } : b
        );
        updateButtons(next);
    };

    const addButton = () => {
        if (buttons.length >= MAX_BUTTONS) return;
        updateButtons([...buttons, { type: 'QUICK_REPLY', text: '' } as any]);
    };

    const removeAt = (index: number) => {
        const next = buttons.filter((_, i) => i !== index);
        updateButtons(next);
    };

    return (
        <div className='p-3 bg-base-100'>
            <h3 className='text-lg font-medium'>Buttons</h3>
            <h5 className='text-sm text-base-secondary'>
                Create buttons that let customers respond to your message or
                take action. You can add up to 10 buttons. If you add more than
                3 buttons, they will appear in a list.
            </h5>

            <div className='gap-3 mt-3 col-flex'>
                {buttons.map((btn: any, index: number) => {
                    return (
                        <div
                            key={index}
                            className='flex gap-3 p-3 rounded border border-base-300'
                        >
                            <div className='flex flex-1 gap-3 items-center'>
                                <SelectBox
                                    width={220}
                                    label='Type'
                                    value={btn?.type}
                                    options={typeOptions}
                                    onChange={(opt) =>
                                        changeType(index, opt?.value)
                                    }
                                />
                                <div className='flex-1'>
                                    {btn?.type === 'QUICK_REPLY' && (
                                        <div className='grid grid-cols-2 gap-3'>
                                            <InputField
                                                label='Button Text'
                                                value={btn?.text ?? ''}
                                                onChange={(e) =>
                                                    updateAt(index, {
                                                        text: e,
                                                    })
                                                }
                                                placeholder='Quick Reply'
                                            />
                                        </div>
                                    )}

                                    {btn?.type === 'COPY_CODE' && (
                                        <div className='grid grid-cols-2 gap-3'>
                                            <InputField
                                                label='Offer code'
                                                value={btn?.example ?? ''}
                                                onChange={(e) =>
                                                    updateAt(index, {
                                                        example:
                                                            e?.target?.value,
                                                    })
                                                }
                                                placeholder='Enter sample'
                                            />
                                        </div>
                                    )}

                                    {btn?.type === 'PHONE_NUMBER' && (
                                        <div className='grid grid-cols-3 gap-3'>
                                            <InputField
                                                label='Button Text'
                                                value={btn?.text ?? ''}
                                                onChange={(e) =>
                                                    updateAt(index, {
                                                        text: e?.target?.value,
                                                    })
                                                }
                                                placeholder='Call phone number'
                                            />
                                            <InputField
                                                label='Phone number'
                                                value={btn?.phone_number ?? ''}
                                                onChange={(e) =>
                                                    updateAt(index, {
                                                        phone_number:
                                                            e?.target?.value,
                                                    })
                                                }
                                                placeholder='+1 555 000 0000'
                                            />
                                        </div>
                                    )}

                                    {btn?.type === 'URL' && (
                                        <div className='flex gap-3 items-center'>
                                            <InputField
                                                label='Button Text'
                                                value={btn?.text ?? ''}
                                                onChange={(e) =>
                                                    updateAt(index, {
                                                        text: e?.target?.value,
                                                    })
                                                }
                                                placeholder='Visit website'
                                            />
                                            <SelectBox
                                                width={150}
                                                label='URL Type'
                                                value={
                                                    btn?.is_dynamic
                                                        ? 'Dynamic'
                                                        : 'static'
                                                }
                                                options={[
                                                    {
                                                        label: 'Dynamic',
                                                        value: 'Dynamic',
                                                    },
                                                    {
                                                        label: 'Static',
                                                        value: 'static',
                                                    },
                                                ]}
                                                onChange={(opt) => {
                                                    const dynamic =
                                                        opt?.value ===
                                                        'Dynamic';

                                                    updateAt(index, {
                                                        is_dynamic: dynamic,
                                                        // keep a sample example entry for dynamic; clear for static
                                                        example: dynamic
                                                            ? Array.isArray(
                                                                  btn?.example
                                                              ) &&
                                                              btn.example
                                                                  .length > 0
                                                                ? btn.example
                                                                : ['']
                                                            : [],
                                                    });
                                                }}
                                            />
                                            <InputField
                                                className='w-full'
                                                label='Website URL'
                                                value={btn?.url ?? ''}
                                                onChange={(e) =>
                                                    updateAt(index, {
                                                        url: e?.target?.value,
                                                    })
                                                }
                                                placeholder='https://www.example.com'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <IconButton
                                icon={CrossSvgIcon}
                                size='xs'
                                iconSize={12}
                                appearance='error'
                                onClick={() => removeAt(index)}
                            >
                                Remove
                            </IconButton>
                        </div>
                    );
                })}

                <div className='flex justify-between items-center'>
                    <Button
                        outline
                        onClick={addButton}
                        disabled={buttons.length >= MAX_BUTTONS}
                    >
                        + Add button
                    </Button>
                    <div className='text-xs text-base-secondary'>
                        {buttons.length}/{MAX_BUTTONS}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetTemplateButton;
