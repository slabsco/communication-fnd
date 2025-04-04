'use client';

import { forwardRef, useEffect, useImperativeHandle } from 'react';

import { IsUndefined, useUncontrolled } from '@finnoto/core';

import { cn } from '../../../Utils/common.ui.utils';
import {
    PopoverAnchor,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from './popover.core';
import { PopoverProps } from './popover.types';

/**
 * A component that wraps the Popover components to provide a popover UI element.
 *
 * @param {object} props - the props object containing the following properties:
 *  - {string} side - the side of the trigger element where the popover should appear
 *  - {string} align - the alignment of the popover relative to the trigger element
 *  - {number} offsetY - the vertical offset of the popover from the trigger element
 *  - {number} offsetX - the horizontal offset of the popover from the trigger element
 *  - {boolean} disabled - whether the popover is disabled
 *  - {JSX.Element} children - the child elements of the Popover component
 *  - {JSX.Element} element - the contents of the popover
 * @return {JSX.Element} the Popover component
 *
 * @author Rumesh Udash
 */
export const Popover = forwardRef(
    (
        {
            side,
            align,
            offsetY,
            offsetX,
            disabled,
            children,
            element,
            visible,
            defaultVisible,
            trigger = 'click',
            autoWidth = false,
            onVisibleChange = () => {},
            type = undefined,
            noAutofocus,
            id,
            className,
        }: PopoverProps,
        ref
    ) => {
        const [value, onChange] = useUncontrolled({
            value: visible,
            defaultValue: defaultVisible,
            finalValue: false,
            onChange: onVisibleChange,
        });

        /**
         * Shows the popover by setting the state of `open` to `true`.
         *
         * @return {void}
         */
        const showPopover = () => {
            onChange(true);
        };

        /**
         * Hides the popover by setting the open state to false.
         *
         * @return {void}
         */
        const hidePopover = () => {
            onChange(false);
        };

        useEffect(() => {
            document.addEventListener('popover:open', showPopover);
            document.addEventListener('popover:close', hidePopover);
            return () => {
                document.removeEventListener('popover:open', showPopover);
                document.removeEventListener('popover:close', hidePopover);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useImperativeHandle(
            ref,
            () => ({
                toggle: (state?: boolean) => {
                    if (IsUndefined(state)) {
                        onChange(!value);
                    } else {
                        onChange(state);
                    }
                },
            }),
            [onChange, value]
        );

        return (
            <PopoverRoot open={value} onOpenChange={onChange}>
                {trigger === 'click' && (
                    <PopoverTrigger
                        id={id}
                        asChild
                        disabled={disabled}
                        aria-disabled={disabled}
                        type={type}
                    >
                        {children}
                    </PopoverTrigger>
                )}
                {trigger === 'manual' && (
                    <>
                        {children}
                        <PopoverAnchor />
                    </>
                )}
                <PopoverContent
                    className={cn(
                        {
                            'w-[var(--radix-popper-anchor-width)]': autoWidth,
                        },
                        className
                    )}
                    side={side}
                    align={align}
                    sideOffset={offsetY}
                    alignOffset={offsetX}
                    aria-disabled={disabled}
                    onOpenAutoFocus={(e) => {
                        if (noAutofocus) e.preventDefault();
                    }}
                >
                    {element}
                    {/* {!!arrow && <PopoverArrow />} */}
                </PopoverContent>
            </PopoverRoot>
        );
    }
);

export const CloseAllPopovers = () => {
    document.dispatchEvent(new CustomEvent('popover:close'));
};
