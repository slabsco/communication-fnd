import { Reply } from 'lucide-react';
import { useState } from 'react';
import { useList, useUpdateEffect } from 'react-use';

import {
    Button,
    cn,
    InputField,
    MultiSelectFilter,
    Switch,
} from '@finnoto/design-system';

export const YOUR_TEMPLATE_SUPPORTED_CONFIG = [
    // {
    //     type: 'CALL',
    //     name: 'Call  Now',
    //     value: '+977-9823624253',
    //     icon: <PhoneCallIcon size={14} />,
    //     limit: 1,
    // },
    // {
    //     type: 'URL',
    //     name: 'Visit Us',
    //     value: 'https://finnoto.com',
    //     icon: <Link size={14} />,
    //     limit: 2,
    // },
    {
        type: 'QUICK_REPLY',
        name: 'Quick Reply',
        value: 'https://finnoto.com',
        icon: <Reply size={14} />,
        limit: 3,
    },
    // {
    //     type: 'PROMO_CODE',
    //     name: 'Promo Code',
    //     value: '#23w21321',
    //     limit: 1,
    //     icon: <Copy size={14} />,
    // },
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
        <div className='flex flex-col gap-2 min-h-[300px]'>
            <hr className='my-4 border-t border-gray-300' />
            <div className='flex gap-4 justify-between items-center'>
                <h3>Buttons (Recommended)</h3>
                <Switch
                    checked={isOpen}
                    onChange={(val) => {
                        setIsOpen(val);
                        setConfiguration({});
                    }}
                />
            </div>

            <div className={cn('flex flex-col gap-2', { hidden: !isOpen })}>
                <MultiSelectFilter
                    placeholder='Select Button'
                    value={buttons}
                    options={options as any}
                    onChangeFilter={(evt) => {
                        setButtons(evt);
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
            case 'CALL':
                return (
                    <RenderCallNowButton
                        configuration={configuration}
                        onOptionsChange={(data) => {
                            setConfiguration((prev) => ({
                                ...prev,
                                ['CALL']: data,
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
            case 'QUICK_REPLY':
                return (
                    <RenderQuickReplyButton
                        configuration={configuration}
                        onOptionsChange={(data) => {
                            setConfiguration((prev) => ({
                                ...prev,
                                ['QUICK_REPLY']: data,
                            }));
                        }}
                    />
                );
            case 'PROMO_CODE':
                return (
                    <RenderOfferCodeButton
                        configuration={configuration}
                        onOptionsChange={(data) => {
                            setConfiguration((prev) => ({
                                ...prev,
                                ['PROMO_CODE']: data,
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
                placeholder='Enter the Coupon Code'
                defaultValue={configuration?.PROMO_CODE}
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
    const [call, setCall] = useState<any>(configuration?.['CALL'] || {});

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
                onChange={(e) => {
                    setCall((prev) => ({
                        ...prev,
                        name: e,
                    }));
                }}
            />
            <InputField
                placeholder='Mobile Number'
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
    const [value, setValue] = useState<any>(configuration?.['URL'] || {});

    useUpdateEffect(() => {
        onOptionsChange(value);
    }, [value]);
    return (
        <div className='flex gap-2 items-center'>
            <div className='py-1 w-40 text-center text-white bg-gray-400 rounded'>
                Visit
            </div>
            <InputField
                placeholder='Button Text'
                onChange={(e) => {
                    setValue((prev) => ({
                        ...prev,
                        name: e,
                    }));
                }}
            />
            <InputField
                placeholder='https://finnoto.com'
                onChange={(e) => {
                    setValue((prev) => ({ ...prev, value: e }));
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
    const values = Object.values(configuration?.QUICK_REPLY || { key: ' ' });
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
                    <div key={index} className='flex gap-2 items-center'>
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
                                appearance={'plain'}
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
