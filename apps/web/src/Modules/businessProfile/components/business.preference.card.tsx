import { useCallback } from 'react';

import { ConfirmUtil, Icon, Switch, Tooltip } from '@finnoto/design-system';

import { InfoCircleSvgIcon } from 'assets';

interface BooleanPreferenceCardProps {
    title: string;
    tooltipMessage: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const BooleanPreferenceCard: React.FC<BooleanPreferenceCardProps> = ({
    title,
    tooltipMessage,
    checked,
    onChange,
    disabled = false,
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
        <div className='gap-2 p-3 border col-flex'>
            <div className='flex gap-3 items-center'>
                <div className='flex gap-2 items-center'>
                    <h3 className='text-base font-semibold text-gray-900'>
                        {title}
                    </h3>
                    <Tooltip
                        message={tooltipMessage}
                        trigger='hover'
                        displayDelay={300}
                    >
                        <div>
                            <Icon source={InfoCircleSvgIcon} isSvg size={14} />
                        </div>
                    </Tooltip>
                </div>
            </div>
            <Switch
                checked={checked}
                onChange={showConfirmUtil}
                color='accent'
                size='md'
                disabled={disabled}
            />
        </div>
    );
};

export default BooleanPreferenceCard;
