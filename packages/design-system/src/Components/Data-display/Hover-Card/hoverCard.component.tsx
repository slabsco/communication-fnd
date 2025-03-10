'use client';

import { useToggle } from 'react-use';

import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { cn } from '../../../Utils/common.ui.utils';
import { HoverCardProps, hoverCardSizes } from './hoverCard.types';

const RadixHoverCard = HoverCardPrimitive.Root; // Importing the hover card root from the radix and changing its name.

const HoverCardTrigger = HoverCardPrimitive.Trigger; // Importing the hover card trigger from the radix and changing its name.

const HoverCardContent = HoverCardPrimitive.Content; // Importing the hover card content from the radix and changing its name.

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

/**
 * @author Saurav Nepal
 *
 * @description HoverCard component.
 *
 * @param children - The content that triggers the hover card.
 * @param content - The content to be displayed in the hover card.
 * @param cardSize - The size of the hover card. Defaults to 'lg'.
 * @param closeDelay - The delay before closing the hover card, in milliseconds.
 * @param offSet - The offset distance of the hover card from its trigger element.
 * @param openDelay - The delay before opening the hover card, in milliseconds.
 * @param position - The position of the hover card in relation to its trigger. Defaults to 'bottom'.
 * @param align - The alignment of the hover card in relation to its trigger. Defaults to 'end'.
 * @param contentClassName - Additional CSS class name for the content of the hover card.
 * @param defaultOpen - Indicates if the hover card should be open by default.
 * @param onOpenChange - Event handler for when the open state of the hover card changes.
 *
 *
 * @returns The HoverCard component.
 */
export const HoverCard = ({
    children,
    content,
    cardSize = 'fit',
    closeDelay,
    offSet,
    openDelay,
    position = 'bottom',
    align = 'end',
    contentClassName,
    defaultOpen,
    disabled,
}: // onOpenChange,
HoverCardProps) => {
    const [open, setOpen] = useToggle(defaultOpen || false);

    return (
        <RadixHoverCard
            closeDelay={closeDelay}
            openDelay={openDelay}
            open={open}
            onOpenChange={(open) => !disabled && setOpen(open)}
        >
            <HoverCardTrigger style={{ cursor: 'pointer' }} asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent
                className={cn(
                    'z-50 rounded shadow-sm animate-in zoom-in-90',
                    hoverCardSizes[cardSize],
                    contentClassName
                )}
                align={align}
                side={position}
                sideOffset={offSet}
            >
                {content}
            </HoverCardContent>
        </RadixHoverCard>
    );
};
