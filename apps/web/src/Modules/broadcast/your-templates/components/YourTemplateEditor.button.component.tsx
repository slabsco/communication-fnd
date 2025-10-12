import { Copy, Link, PhoneCallIcon, Reply } from 'lucide-react';
import { useState } from 'react';
import { useList, useUpdateEffect } from 'react-use';

import { IsEmptyObject } from '@finnoto/core';
import {
    Button,
    cn,
    InputField,
    MultiSelectFilter,
    Switch,
} from '@finnoto/design-system';

import { BUTTON_CONFIG_TYPE } from '../enums/whatsapp.template.category.enum';

export const YOUR_TEMPLATE_SUPPORTED_CONFIG = [
    {
        type: BUTTON_CONFIG_TYPE.PHONE_NUMBER,
        name: 'Call  Now',
        value: '+977-9823624253',
        icon: <PhoneCallIcon size={14} />,
        limit: 1,
    },
    {
        type: 'URL',
        name: 'Visit Us',
        value: 'https://finnoto.com',
        icon: <Link size={14} />,
        limit: 2,
    },
    {
        type: BUTTON_CONFIG_TYPE.QUICK_REPLY,
        name: 'Quick Reply',
        value: 'https://finnoto.com',
        icon: <Reply size={14} />,
        limit: 3,
    },
    {
        type: BUTTON_CONFIG_TYPE.COPY_CODE,
        name: 'Copy Offer Code',
        value: '#23w21321',
        limit: 1,
        icon: <Copy size={14} />,
    },
];

const YourTemplateEditorButton = ({
    configuration = {},
    setConfiguration,
}: {
    configuration?: any;
    setConfiguration?: any;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const defaultOpen = Object.keys(configuration);

    const [buttons, setButtons] = useState<any>(defaultOpen);

    const options = YOUR_TEMPLATE_SUPPORTED_CONFIG.map((val) => ({
        label: val?.name,
        value: val.type,
    }));

    return (
        <div className='flex flex-col gap-2'>
            <hr className='my-4 border-t border-gray-300' />
            <div className='flex gap-4 justify-between items-center'>
                <h3>Buttons (Recommended)</h3>
                <Switch
                    checked={isOpen}
                    onChange={(val) => {
                        setConfiguration({});
                        setIsOpen(val);
                        setButtons([]);
                    }}
                />
            </div>

            <div className={cn('flex flex-col gap-2', { hidden: !isOpen })}>
                <MultiSelectFilter
                    side='top'
                    footerClassName='hidden'
                    placeholder='Select Button'
                    value={buttons}
                    isSearchable={false}
                    options={options as any}
                    onChangeFilter={(evt) => {
                        setButtons(evt);

                        if (IsEmptyObject(configuration)) return;
                        setConfiguration((prev) => {
                            const newData = {};

                            evt.forEach((data) => {
                                newData[data] = prev[data];
                            });

                            return newData;
                        });
                    }}
                />
                <RenderButtonConfiguration
                    configuration={configuration}
                    buttons={buttons}
                    setConfiguration={setConfiguration}
                />
            </div>
        </div>
    );
};

export default YourTemplateEditorButton;

const RenderButtonConfiguration = ({
    buttons,
    configuration,
    setConfiguration,
}: {
    buttons: any;
    setConfiguration: any;
    configuration: any;
}) => {
    const render = (data: any) => {
        switch (data) {
            case BUTTON_CONFIG_TYPE.PHONE_NUMBER:
                return (
                    <RenderCallNowButton
                        configuration={configuration}
                        onOptionsChange={(data) => {
                            setConfiguration((prev) => ({
                                ...prev,
                                [BUTTON_CONFIG_TYPE.PHONE_NUMBER]: data,
                            }));
                        }}
                    />
                );
            case 'URL':
                return (
                    <RenderVisitUsButton
                        configuration={configuration}
                        onOptionsChange={(data) => {
                            setConfiguration((prev) => ({
                                ...prev,
                                ['URL']: data,
                            }));
                        }}
                    />
                );
            case BUTTON_CONFIG_TYPE.QUICK_REPLY:
                return (
                    <RenderQuickReplyButton
                        configuration={configuration}
                        onOptionsChange={(data) => {
                            setConfiguration((prev) => ({
                                ...prev,
                                [BUTTON_CONFIG_TYPE.QUICK_REPLY]: data,
                            }));
                        }}
                    />
                );
            case BUTTON_CONFIG_TYPE?.COPY_CODE:
                return (
                    <RenderOfferCodeButton
                        configuration={configuration}
                        onOptionsChange={(data) => {
                            setConfiguration((prev) => ({
                                ...prev,
                                [BUTTON_CONFIG_TYPE?.COPY_CODE]: data,
                            }));
                        }}
                    />
                );
            default:
                break;
        }
    };
    return (
        <div className='flex flex-col gap-2'>
            {buttons.map((val) => render(val))}
        </div>
    );
};

const RenderOfferCodeButton = ({
    onOptionsChange,
    configuration,
}: {
    onOptionsChange: any;
    configuration: any;
}) => {
    return (
        <div className='flex gap-2 items-center'>
            <div className='py-1 w-40 text-center text-white bg-gray-400 rounded'>
                Copy offer code
            </div>
            <InputField
                value={configuration?.[BUTTON_CONFIG_TYPE?.COPY_CODE]}
                placeholder='Enter the Coupon Code'
                defaultValue={configuration?.[BUTTON_CONFIG_TYPE?.COPY_CODE]}
                onChange={(e) => {
                    onOptionsChange(e);
                }}
            />
        </div>
    );
};

const RenderCallNowButton = ({
    onOptionsChange,
    configuration,
}: {
    onOptionsChange: any;
    configuration: any;
}) => {
    const [call, setCall] = useState<any>(
        configuration?.[BUTTON_CONFIG_TYPE.PHONE_NUMBER] || {}
    );

    useUpdateEffect(() => {
        onOptionsChange(call);
    }, [call]);
    return (
        <div className='flex gap-2 items-center'>
            <div className='py-1 w-40 text-center text-white bg-gray-400 rounded'>
                Call
            </div>
            <InputField
                placeholder='Button Text'
                value={call?.name}
                onChange={(e) => {
                    setCall((prev) => ({
                        ...prev,
                        name: e,
                    }));
                }}
            />
            <InputField
                placeholder='Mobile Number'
                value={call?.value}
                onChange={(e) => {
                    setCall((prev) => ({ ...prev, value: e }));
                }}
            />
        </div>
    );
};

const RenderVisitUsButton = ({
    onOptionsChange,
    configuration,
}: {
    onOptionsChange: any;
    configuration: any;
}) => {
    const [visitUs, setVisitUs] = useState<any>(configuration?.['URL'] || {});

    useUpdateEffect(() => {
        onOptionsChange(visitUs);
    }, [visitUs]);
    return (
        <div className='flex gap-2 items-center'>
            <div className='py-1 w-40 text-center text-white bg-gray-400 rounded'>
                Visit
            </div>
            <InputField
                placeholder='Button Text'
                value={visitUs?.name}
                onChange={(e) => {
                    setVisitUs((prev) => ({
                        ...prev,
                        name: e,
                    }));
                }}
            />
            <InputField
                value={visitUs?.value}
                placeholder='https://example.com'
                onChange={(e) => {
                    setVisitUs((prev) => ({ ...prev, value: e }));
                }}
            />
        </div>
    );
};

const RenderQuickReplyButton = ({
    onOptionsChange,
    configuration,
}: {
    onOptionsChange: (value: any) => void;
    configuration: any;
}) => {
    const values = Object.values(
        configuration?.[BUTTON_CONFIG_TYPE.QUICK_REPLY] || { key: ' ' }
    );
    const [quickReplies, { push, removeAt, updateAt }] = useList<any>(values);

    const handleChange = (index: number, newValue: string) => {
        updateAt(index, newValue);
    };

    const handleDelete = (index: number) => {
        if (!index) return;
        removeAt(index);
    };

    useUpdateEffect(() => {
        onOptionsChange(quickReplies);
    }, [quickReplies]);

    return (
        <div className='flex gap-3 p-4 border'>
            <div className='flex flex-col flex-1 gap-2'>
                {quickReplies.map((reply, index) => (
                    <div key={index + 1} className='flex gap-2 items-center'>
                        <div className='py-1 w-40 text-center text-white bg-gray-400 rounded'>
                            Quick Reply
                        </div>
                        <InputField
                            placeholder='Enter the quick Reply Text here'
                            value={reply}
                            onChange={(e) => handleChange(index, e)}
                        />
                        {index !== 0 && (
                            <Button
                                onClick={() => handleDelete(index)}
                                appearance={'errorHover'}
                                size={'xs'}
                                color={'error'}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            {quickReplies.length < 3 && (
                <Button
                    appearance={'accent'}
                    outline
                    size={'sm'}
                    onClick={() => push('')}
                >
                    Add Reply
                </Button>
            )}
        </div>
    );
};
