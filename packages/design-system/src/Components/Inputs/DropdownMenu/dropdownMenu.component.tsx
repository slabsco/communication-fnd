'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useUpdateEffect } from 'react-use';

import { Debounce, SortArrayObjectBy, useApp } from '@finnoto/core';

import { cn, IsFunction, IsValidString } from '../../../Utils/common.ui.utils';
import { Icon } from '../../Data-display/Icon/icon.component';
import { Button } from '../Button/button.component';
import { InputField } from '../InputField/input.component';
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './dropdownMenu.core';
import {
    DropdownMenuActionProps,
    dropdownMenuIconSizes,
    DropdownMenuProps,
    dropdownMenuSizes,
} from './dropdownMenu.types';

/**
 * Renders a dropdown menu with given actions and options.
 *
 * @param {DropdownMenuProps} props - The props object for the DropdownMenu component.
 * @param {Array} props.actions - The list of actions to display in the dropdown.
 * @param {string} props.side - The side of the screen where the dropdown should appear.
 * @param {string} props.align - The alignment of the dropdown relative to the trigger.
 * @param {boolean} props.hideOnNoAction - Whether to hide the dropdown if no actions are visible.
 * @param {boolean} props.searchable - Whether the dropdown actions should be searchable.
 * @param {boolean} props.disabled - Whether the dropdown is disabled.
 * @param {ReactNode} props.children - The child elements of the dropdown.
 * @param {any} props.params - If you want to send any value from outer function to the action parameter
 * @returns {ReactNode} The rendered dropdown menu component.
 * @returns {any} props.onOpenChangeCallback - Callback function to get the open state of the dropdown menu
 *
 * @author @rumeshudash
 */
export const DropdownMenu = ({
    actions = [],
    side,
    align,
    hideOnNoAction,
    searchable,
    disabled,
    children,
    params,
    className,
    asChild = true,
    autoFocus = true,
    onOpenChangeCallback,
    isSortable,
    size,
}: DropdownMenuProps) => {
    const dropdownMenuContentRef = useRef(null);
    const searchInputRef = useRef(null);

    const [search, setSearch] = useState('');
    const { isArc } = useApp();

    useUpdateEffect(() => {
        Debounce(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 10)();
    }, [search]);

    const sanitizeVisibility = useCallback(
        (actions) => {
            return actions.filter((action) => {
                if (action.expandableActions) {
                    const sanitizedVisibleActions = sanitizeVisibility(
                        action.expandableActions
                    );
                    action.expandableActions = sanitizedVisibleActions;
                    if (action.expandableActions.length === 0) return false;
                }
                return IsFunction(action?.visible)
                    ? action.visible(params)
                    : action.visible !== false;
            });
        },
        [params]
    );

    const visibleActions = useMemo(() => {
        const visibleActions = sanitizeVisibility(actions);
        if (isSortable) return SortArrayObjectBy(visibleActions, 'name', 'asc');
        return visibleActions;
    }, [actions, isSortable, sanitizeVisibility]);

    const filteredActions = useMemo(() => {
        if (!IsValidString(search)) return visibleActions;

        return visibleActions.filter((action) =>
            action.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [visibleActions, search]);

    const checkRowAction = useCallback(() => {
        return visibleActions.length > 0;
    }, [visibleActions]);

    const defaultVisibleSearchable = useMemo(() => {
        if (searchable === false) return false;
        return visibleActions.length > 5;
    }, [searchable, visibleActions.length]);

    if (hideOnNoAction && !checkRowAction()) {
        return null;
    }

    return (
        <DropdownMenuRoot
            onOpenChange={(open) => {
                if (onOpenChangeCallback) onOpenChangeCallback(open);
                if (!open) setTimeout(() => setSearch(''), 100);
            }}
        >
            <DropdownMenuTrigger
                disabled={disabled || !checkRowAction()}
                asChild={asChild}
            >
                {children ?? (
                    <Button appearance='base'>
                        <Menu />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={cn(
                    'min-w-[150px]',
                    {
                        'gap-1 min-w-[100px] col-flex': isArc,
                    },
                    className
                )}
                side={side}
                align={align}
                ref={dropdownMenuContentRef}
            >
                {searchable || defaultVisibleSearchable ? (
                    <div>
                        <InputField
                            type='search'
                            size='sm'
                            placeholder='Search...'
                            className='sticky top-0'
                            groupClassName='min-w-0 w-full'
                            inputClassName='min-w-0 mb-1 font-normal'
                            value={search}
                            onChange={setSearch}
                            autoFocus={autoFocus}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                    dropdownMenuContentRef.current?.focus();
                                }
                            }}
                            ref={searchInputRef}
                        />
                    </div>
                ) : null}
                <DropdownMenuItemList
                    actions={filteredActions}
                    params={params}
                    size={size}
                />
            </DropdownMenuContent>
        </DropdownMenuRoot>
    );
};

const DropdownMenuItemList = ({
    actions,
    params,
    size,
}: {
    actions: DropdownMenuActionProps[];
    params?: any;
    size: keyof typeof dropdownMenuSizes;
}) => {
    return (
        <div className='flex-1 overflow-y-auto col-flex max-h-[--radix-popper-available-height] scrollbar-xs'>
            {actions.map((action) => {
                const name = IsFunction(action?.name)
                    ? action?.name(params)
                    : action?.name;
                if (action.url) {
                    return (
                        <Link
                            href={action.url}
                            key={name}
                            {...action.urlProps}
                            name={name}
                        >
                            <DropdownItem {...action} size={size} />
                        </Link>
                    );
                }

                if (!!action.expandableActions) {
                    return (
                        <DropdownSubmenu
                            {...action}
                            params={params}
                            key={action.name}
                            name={name}
                            size={size}
                        />
                    );
                }

                return (
                    <DropdownItem
                        {...action}
                        params={params}
                        key={action.name}
                        name={name}
                        size={size}
                    />
                );
            })}
        </div>
    );
};

const DropdownItem = (props: DropdownMenuActionProps & { params?: any }) => {
    const { isArc } = useApp();
    const { action, params, size = 'md' } = props;

    return (
        <DropdownMenuItem
            key={props.name}
            className={cn(
                'relative p-0',
                {
                    'text-error focus:text-error-content focus:bg-error':
                        props.isCancel,
                    'text-error focus:!bg-error/20 focus:!text-error hover:!bg-error/20 hover:!text-error':
                        isArc && props.isCancel,
                    'text-success focus:!bg-success focus:!text-success-content hover:bg-success hover:text-success-content':
                        props.isSuccess,
                },
                props.className
            )}
            // If you want to send some value to the action parameter
            onClick={(e) => {
                e.stopPropagation();
                if (params) {
                    action?.(params);
                    return;
                }
                action?.();
            }}
        >
            <div
                className={cn(
                    'flex gap-2 justify-start items-center px-3 w-full h-full',
                    dropdownMenuSizes[size]
                )}
            >
                {props?.icon && (
                    <Icon
                        source={props?.icon}
                        size={dropdownMenuIconSizes[size]}
                        isSvg={props.isSvg || true}
                        iconColor={props?.iconColor}
                    />
                )}
                <span
                    className={cn('capitalize', {
                        'text-polaris-size-325': isArc,
                    })}
                >
                    {props.name}
                </span>
            </div>
        </DropdownMenuItem>
    );
};

const DropdownSubmenu = (props: DropdownMenuActionProps & { params?: any }) => {
    const { isArc } = useApp();
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger
                className={cn('flex justify-between w-full h-full px-3 py-2 ', {
                    'px-2 py-1 rounded-lg gap-2 data-[state=open]:text-polaris-text focus:text-polaris-text data-[state=open]:bg-polaris-bg-surface-selected focus:bg-polaris-bg-surface-selected ':
                        isArc,
                })}
            >
                {props?.icon && (
                    <Icon
                        source={props.icon}
                        size={props.iconSize}
                        isSvg={props.isSvg}
                    />
                )}
                <span
                    className={cn('capitalize', {
                        'text-polaris-size-325': isArc,
                    })}
                >
                    {props.name}
                </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {props?.expandableActions?.map((expandedAction) => {
                        return (
                            <DropdownItem
                                key={expandedAction.name}
                                {...expandedAction}
                                size={props.size}
                            />
                        );
                    })}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
};
