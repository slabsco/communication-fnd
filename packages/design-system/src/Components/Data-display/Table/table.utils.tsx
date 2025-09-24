import { isValid as IsValidDate } from 'date-fns';
import {
    ArrowDownUp,
    ArrowDownWideNarrow,
    ArrowUpNarrowWide,
    XCircle,
} from 'lucide-react';
import { ReactNode, useMemo } from 'react';

import {
    AccessNestedObject,
    EmptyFunction,
    FormatCurrencyAcc,
    getActiveStatusText,
    IsUndefined,
} from '@finnoto/core';

import { SlidingPane } from '../../../Utils';
import { cn, IsFunction, IsNumber } from '../../../Utils/common.ui.utils';
import {
    FormatCurrencyStyled,
    FormatDisplayDateStyled,
} from '../../../Utils/component.utils';
import { Button } from '../../Inputs/Button/button.component';
import { CheckBox } from '../../Inputs/CheckBox/checkBox.component';
import { IconButton } from '../../Inputs/Icon-Button/iconButton.component';
import { RadioGroupItem } from '../../Inputs/RadioGroup/radioGroup.component';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarTrigger,
} from '../../Surfaces/Menubar/menubar.core';
import { Badge, BadgeCircleIcon } from '../Badge/badge.component';
import { Ellipsis } from '../Ellipsis/ellipsis.component';
import { Tooltip } from '../Tooltip/Tooltip.component';
import { Typography } from '../Typography/typography.component';
import ActiveButton from './Components/activeButton.component';
import { ChangeStatusModal } from './Components/changeStatusModal.component';
import InactiveButton from './Components/inactiveButton.component';
import { TableCell } from './table.core';
import { SortingType, TableColumn } from './table.types';

import { DeleteSvgIcon, EditPenSvgIcon } from 'assets';

// Function to get URL based on href and data
const getUrl = (href, data) => (IsFunction(href) ? href(data) : href);

// Function to handle the display of table items in a cell
export const handleTableItemDisplay = (
    item,
    col: TableColumn,
    handleStatus,
    colIndex: number,
    rowIndex: number,
    isArcPortal = false
) => {
    if (col?.visible === false) return null;

    if (col?.renderValue) {
        return col?.renderValue(item, col, rowIndex, colIndex);
    }

    const data: any = AccessNestedObject(item, col?.key);

    const renderColumnwithEllipsis = (data) => {
        if (!col?.ellipse) return data || '-';
        if (typeof col?.ellipse === 'number') {
            return (
                <Ellipsis width={col?.ellipse} withShowMore>
                    {data || '-'}
                </Ellipsis>
            );
        }
        if (typeof col?.ellipse === 'boolean') {
            return (
                <Ellipsis
                    width={400}
                    withShowMore
                    truncateClassName={col?.truncateClass}
                >
                    {data || '-'}
                </Ellipsis>
            );
        }
    };

    if (col?.url) {
        return (
            <Typography
                noStyle
                target={col?.target}
                linkDecoration={colIndex === 0 ? 'primary' : 'secondary'}
                link={!!data ? getUrl(col?.url, item) : undefined}
            >
                {renderColumnwithEllipsis(data)}
            </Typography>
        );
    }
    if (col?.secondaryUrl) {
        return (
            <Typography
                noStyle
                target={col?.target}
                linkDecoration='secondary'
                link={!!data ? getUrl(col?.secondaryUrl, item) : undefined}
            >
                {renderColumnwithEllipsis(data)}
            </Typography>
        );
    }

    if (IsFunction(col?.dynamicStatus)) {
        const type = col?.dynamicStatus(false, item);
        return (
            <div className='centralize'>
                <ActivateStatusComponent
                    {...{
                        column: { ...col, type },
                        item,
                        handleStatus: IsFunction(col?.action)
                            ? col?.action
                            : handleStatus,
                    }}
                />
            </div>
        );
    }
    switch (col?.type) {
        //@todo i will implement percentage type
        // case 'percentage':
        //     return `${data || 0} %`;
        case 'boolean':
            let appearance = null;
            if (isArcPortal) {
                appearance = data ? 'polaris-success' : 'polaris-error';
            } else {
                appearance = data ? 'success' : 'error';
            }
            if (isArcPortal)
                return (
                    <p
                        className={cn('font-medium text-polaris-text-success', {
                            'text-polaris-text-critical': !data,
                        })}
                    >
                        {data ? 'YES' : 'NO'}
                    </p>
                );

            return (
                <Badge
                    label={data ? 'YES' : 'NO'}
                    appearance={appearance}
                    size='normal'
                    className={cn({
                        'gap-1': isArcPortal,
                    })}
                    leftComponent={
                        isArcPortal && (
                            <BadgeCircleIcon
                                type='solid'
                                appearance={
                                    data ? 'polaris-success' : 'polaris-error'
                                }
                                className='table-badge-circle'
                            />
                        )
                    }
                />
            );

        case 'dualistic':
            if (isArcPortal)
                return (
                    <p
                        className={cn('font-medium text-polaris-text-success', {
                            'text-polaris-text-critical': !data,
                        })}
                    >
                        {data ? 'Yes' : 'No'}
                    </p>
                );
            return (
                <Badge
                    label={data ? 'Yes' : 'No'}
                    appearance={data ? 'success' : 'error'}
                    size='sm'
                />
            );
        case 'currency':
            if (IsUndefined(data)) return '-';
            return FormatCurrencyStyled({
                amount: data,
                noDecimal: false,
                size: 'sm',
                className: 'text-end',
            });
        case 'date':
        case 'date_lateral':
            if (!data) return '-';
            return FormatDisplayDateStyled({
                value: data,
                showTime: false,
                size: 'sm',
            });
        case 'date_time':
            if (!data) return '-';
            if (IsValidDate(new Date(data))) {
                //@todo isValidDate check
                return renderColumnwithEllipsis(
                    FormatDisplayDateStyled({
                        value: data,
                        size: 'sm',
                        showTime: true,
                    })
                );
            }
            return (
                <Typography noStyle variant='span'>
                    {renderColumnwithEllipsis(data)}
                </Typography>
            );
        case 'number':
            return (
                <Typography noStyle variant='span' className='text-center'>
                    {renderColumnwithEllipsis(data)}
                </Typography>
            );
        case 'currency_acc':
            if (IsUndefined(data)) return '-';
            return (
                <span className='flex justify-end w-full font-medium'>
                    {renderColumnwithEllipsis(FormatCurrencyAcc(data))}
                </span>
            );

        case 'activate':
        case 'activate_badge':
            return (
                <div className='centralize min-w-[100px]'>
                    <ActivateStatusComponent
                        {...{
                            column: col,
                            item,
                            handleStatus: IsFunction(col?.action)
                                ? col?.action
                                : handleStatus,
                        }}
                    />
                </div>
            );

        default:
            return (
                <Typography className={col?.className as any} noStyle>
                    {renderColumnwithEllipsis(data)}
                </Typography>
            );
    }
};

// Function to handle the display of table column header
export const handleTableColumn = (
    col: TableColumn,
    isSorted: boolean,
    order: 'asc' | 'desc',
    onSortingChange: (sorting: SortingType) => void
) => {
    if (col?.visible === false) return null;

    if (col?.enableDbSort === true) {
        const textAlign = (type) => {
            if (type === 'currency' || type === 'currency_acc') {
                return 'justify-end';
            }
            return 'justify-start';
        };

        return (
            <div
                className={cn('flex items-center group', textAlign(col?.type))}
            >
                <Button
                    size='xs'
                    appearance='ghost'
                    className='font-medium table-button'
                    buttonIconAlign='right'
                    onClick={() => {
                        const newOrder = order === 'asc' ? 'desc' : 'asc';

                        onSortingChange?.({
                            column: col?.key,
                            order: isSorted ? newOrder : 'asc',
                        });
                    }}
                >
                    <div className={cn('flex gap-2 items-center')}>
                        {col.name}
                        {!isSorted && (
                            <ArrowDownUp
                                className='invisible group-hover:visible'
                                size={14}
                            />
                        )}
                        {isSorted && order === 'asc' && (
                            <ArrowUpNarrowWide size={14} />
                        )}
                        {isSorted && order === 'desc' && (
                            <ArrowDownWideNarrow size={14} />
                        )}
                    </div>
                </Button>
            </div>
        );
    }

    if (
        col?.type === 'activate' ||
        col?.type === 'activate_badge' ||
        IsFunction(col?.dynamicStatus)
    ) {
        return (
            <Typography
                variant='span'
                color='white'
                className='uppercase centralize'
                weight='medium'
            >
                {col.name}
            </Typography>
        );
    }
    return (
        <Typography
            variant='span'
            noStyle
            color='white'
            className='table-button'
        >
            {col.name}
        </Typography>
    );
};

// Function to handle the display of the selected column header
export const handleSeletedColumnHeader = (
    isSelectEnable: boolean,
    isHovered: boolean,
    rowNumbering: boolean,
    isOneSelected,
    onCheckBoxClick,
    isSelectedAll?: boolean,
    disableSelectAll?: boolean,
    className?: string,
    type?: 'check' | 'radio' | 'actions'
) => {
    if (!isSelectEnable && !rowNumbering) return null;

    if (type === 'radio' && isSelectEnable && !rowNumbering) {
        return (
            <TableCell className='border-l-0 border-y border-base-300'>
                <span></span>
            </TableCell>
        );
    }

    if (
        isSelectEnable &&
        !rowNumbering &&
        (!isOneSelected || disableSelectAll)
    ) {
        return (
            <TableCell className='border-l-0 border-y border-base-300'>
                <span></span>
            </TableCell>
        );
    }

    if (isOneSelected && !disableSelectAll) {
        return (
            <TableCell className='border-l-0 border-y border-base-300'>
                <CheckBox
                    appearance='success'
                    onChange={onCheckBoxClick}
                    size='xs'
                    checked={isSelectedAll}
                />
            </TableCell>
        );
    }
    if (rowNumbering) {
        return (
            <TableCell
                className={cn('border-l-0 border-y border-base-300', className)}
            >
                <Typography
                    color='white'
                    className='px-2 text-center table-button'
                    noStyle
                >
                    S.N
                </Typography>
            </TableCell>
        );
    }
    if (isHovered)
        return (
            <TableCell className='w-0 border-l-0 border-y border-base-300'>
                <Typography
                    noStyle
                    className='w-0 text-center opacity-0 table-button'
                >
                    S.N
                </Typography>
            </TableCell>
        );
    return null;
};

// Function to handle the display of the selected column row
export const handleSeletedColumnRow = ({
    isSelectEnable,
    isOneSeleted,
    isDisabled,
    onClickToCheckBox,
    checked,
    hasHovered,
    rowNumbering,
    showTooltip = false,
    type = 'check',
    ...props
}: any) => {
    if (!isSelectEnable && !rowNumbering) return null;

    if (
        (isSelectEnable && (isOneSeleted || hasHovered)) ||
        (isSelectEnable && !rowNumbering)
    ) {
        if (type === 'check')
            return (
                <TableCell className='flex justify-center w-0'>
                    <CheckBox
                        labelClassName='justify-center'
                        size='xs'
                        onChange={onClickToCheckBox}
                        checked={checked}
                        disabled={!checked && isDisabled}
                    />
                </TableCell>
            );

        if (type === 'radio')
            return (
                <TableCell className='flex justify-center w-0'>
                    <RadioGroupItem
                        checked={checked}
                        onChange={onClickToCheckBox}
                        disabled={isDisabled}
                        size='xs'
                        appearance='success'
                    />
                </TableCell>
            );

        return (
            <TableCell className='flex justify-center w-0 !align-top'>
                <div className='flex gap-2 justify-center'>
                    <IconButton
                        size='xs'
                        appearance='secondary'
                        name='edit_icon_table'
                        icon={EditPenSvgIcon}
                        onClick={props?.onEdit}
                        disabled={isDisabled}
                        iconSize={12}
                        outline
                    />
                    <IconButton
                        size='xs'
                        appearance='error'
                        name='delete_icon_table'
                        outline
                        icon={DeleteSvgIcon}
                        onClick={props?.onDelete}
                        iconSize={12}
                        disabled={isDisabled}
                    />
                </div>
            </TableCell>
        );
    }

    if (IsNumber(rowNumbering)) {
        return (
            <TableCell
                className={cn(
                    'w-0 text-center cursor-pointer flex items-stretch !p-0 ',
                    {
                        '!px-8 !py-2.5 !align-top': type === 'actions',
                    }
                )}
                onClick={props.onSnOpen ? props.onSnOpen : null}
            >
                {showTooltip ? (
                    <Tooltip message={'Click to view details'}>
                        <div>
                            <Typography noStyle>{rowNumbering}</Typography>
                        </div>
                    </Tooltip>
                ) : (
                    <Typography noStyle>{rowNumbering}</Typography>
                )}
            </TableCell>
        );
    }
};

// SelectableMenu component
export interface SelectableMenuProps {
    active: string;
    menus: {
        name: string;
        key: string;
        icon?: any;
        action?: (key: string, col?: any) => void;
    }[];
    children?: ReactNode;
    onClickToClear?: (col: any) => void;
    col?: any;
    menubarContentClassName?: string;
    menubarTriggerClassName?: string;
}
export const SelectableMenu = ({
    active,
    menus,
    children,
    onClickToClear = () => {},
    col,
    menubarContentClassName,
    menubarTriggerClassName,
}: SelectableMenuProps) => {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger asChild className={menubarTriggerClassName}>
                    {children || 'Click'}
                </MenubarTrigger>
                <MenubarContent className={menubarContentClassName}>
                    <MenubarRadioGroup value={active}>
                        {menus?.map((menu) => {
                            return (
                                <MenubarRadioItem
                                    key={menu?.key}
                                    value={menu?.key}
                                    onClick={() =>
                                        IsFunction(menu?.action)
                                            ? menu?.action(menu?.key, col)
                                            : {}
                                    }
                                >
                                    {menu?.name}
                                </MenubarRadioItem>
                            );
                        })}
                        {!!active && (
                            <>
                                <MenubarSeparator />
                                <MenubarItem
                                    className='flex gap-2 text-error item focus:bg-error'
                                    onClick={() => onClickToClear(col)}
                                >
                                    <XCircle size={14} />
                                    Clear
                                </MenubarItem>
                            </>
                        )}
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

const BadgeActivate = ({ column, item }: any) => {
    const active = useMemo(
        () => item[column?.key || 'active'],
        [column?.key, item]
    );
    const activeText = useMemo(
        () => getActiveStatusText(active, item),
        [active, item]
    );
    const appearance = useMemo(() => {
        if (activeText === 'Deactivated') return 'orange';
        return active ? 'success' : 'error';
    }, [active, activeText]);

    return (
        <div className='centralize'>
            <Badge
                label={activeText}
                appearance={appearance}
                size={column?.statusBadgeSize || 'normal'}
            />
        </div>
    );
};
const ActivateComponent = ({
    column,
    item,
    handleStatus = EmptyFunction,
}: any) => {
    if (column?.dependendent_activate) {
        const isActive = item[column?.dependendent_activate];
        if (!isActive) return <>{'-'}</>;
    }

    if (item[column?.key || 'active']) {
        const HandleStatus = (next) => {
            if (column?.action) return column?.action(item, next);
            return handleStatus(
                column?.activateId ? item[column?.activateId] : item?.id,
                !item[column?.key],
                column?.method || 'activate',
                () => next()
            );
        };

        return (
            <ActiveButton
                onClick={(next: () => void = EmptyFunction) => {
                    const handleClose = () => {
                        next();
                        SlidingPane.closeAll();
                    };
                    if (column?.doubleConfirmation) {
                        ChangeStatusModal({
                            onConfirmPress: () => HandleStatus(handleClose),
                            item: item,
                            column,
                            onCancelPress: () => next(),
                        });
                    } else {
                        HandleStatus(handleClose);
                    }
                }}
            />
        );
    }

    return (
        <InactiveButton
            onClick={(next: () => void = EmptyFunction) => {
                const HandleStatus = () => {
                    const handleClose = () => {
                        next();
                        SlidingPane.closeAll();
                    };
                    if (column?.action) return column?.action(item, next);

                    return handleStatus(
                        column?.activateId
                            ? item[column?.activateId]
                            : item?.id,
                        !item[column?.key],
                        column?.method || 'activate',
                        () => {
                            handleClose();
                        }
                    );
                };
                if (column?.doubleConfirmation) {
                    ChangeStatusModal({
                        onConfirmPress: () => {
                            HandleStatus();
                        },
                        onCancelPress: () => next(),
                        item: item,
                        column,
                    });
                } else HandleStatus();
            }}
        />
    );
};

const ActivateStatusComponent = ({ column, item, handleStatus }: any) => {
    let type = column?.type;

    const dynamicStatus = column?.dynamicStatus;
    if (IsFunction(dynamicStatus)) {
        type = dynamicStatus(item[column?.key], item);
    }

    if (item?.attributes?.no_edit)
        return <BadgeActivate {...{ column, item }} />;

    if (type === 'activate_badge') {
        return <BadgeActivate {...{ column, item }} />;
    } else {
        return <ActivateComponent {...{ column, item, handleStatus }} />;
    }
};
