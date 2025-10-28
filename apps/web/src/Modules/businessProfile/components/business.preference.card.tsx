import { ReactNode, useCallback } from 'react';

import { ConfirmUtil, Icon, Switch, Tooltip } from '@finnoto/design-system';

import { InfoCircleSvgIcon } from 'assets';

interface BooleanPreferenceCardProps {
    title: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    description?: string;
    children?: ReactNode;
}

const BooleanPreferenceCard: React.FC<BooleanPreferenceCardProps> = ({
    title,
    checked,
    onChange,
    disabled = false,
    description,
    children,
}) => {
    const showConfirmUtil = useCallback(
        (val: any) => {
            return ConfirmUtil({
                title: 'Are you sure ?',
                message: 'Are you sure you want to change this setting?',
                isReverseAction: true,
                isArc: true,
                onConfirmPress: () => onChange(val),
            });
        },
        [onChange]
    );
    return (
        <div className='gap-2 p-3 rounded border col-flex'>
            <div className='flex gap-3 items-start'>
                <div className='flex-1 gap-1 col-flex'>
                    <div className='flex gap-2 items-center'>
                        <h3 className='text-base font-semibold text-gray-900'>
                            {title}
                        </h3>
                    </div>
                    {description ? (
                        <p className='text-sm text-base-secondary'>
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>
            {children || (
                <Switch
                    checked={checked}
                    onChange={showConfirmUtil}
                    color='accent'
                    size='md'
                    disabled={disabled}
                />
            )}
        </div>
    );
};

export default BooleanPreferenceCard;
