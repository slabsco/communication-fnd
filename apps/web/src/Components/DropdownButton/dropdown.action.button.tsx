import React from 'react';

import {
    Button,
    cn,
    DropdownMenu,
    DropdownMenuActionProps,
    dropdownMenuSizes,
    Icon,
} from '@finnoto/design-system';
import { ButtonProps } from '@finnoto/design-system/src/Components/Inputs/Button/button.types';

import { ActionArrowDownSvgIcon } from 'assets';

const DropdownActionButton = ({
    actions,
    searchable,
    hideOnNoAction = false,
    align,
    isSortable,
    size = 'sm',
    buttonProps,
    className,
    buttonName,
}: {
    actions: DropdownMenuActionProps[];
    searchable?: boolean;
    hideOnNoAction?: boolean;
    align?: 'center' | 'start' | 'end';
    isSortable?: boolean;
    size?: keyof typeof dropdownMenuSizes;
    buttonProps?: ButtonProps;
    className?: string;
    buttonName?: string;
}) => {
    return (
        <DropdownMenu
            actions={actions}
            className={cn('gap-2 mt-2', className)}
            searchable={searchable}
            hideOnNoAction={hideOnNoAction}
            align={align}
            isSortable={isSortable}
            size={size === 'sm' ? 'md' : size}
        >
            <Button wide size={size} appearance='primary' {...buttonProps}>
                {buttonName || 'Actions'}
                <Icon
                    source={ActionArrowDownSvgIcon}
                    isSvg
                    className='ml-2'
                    size={20}
                />
            </Button>
        </DropdownMenu>
    );
};

export default DropdownActionButton;
