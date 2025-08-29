import { PanelRightOpen } from 'lucide-react';

import { cn } from '@finnoto/design-system';

const TogglePanelComponent = ({
    onClick,
    open = false,
    direction = 'left',
}: {
    onClick: () => void;
    open: boolean;
    direction?: 'left' | 'right';
}) => {
    // Animate the icon rotation and position based on open/close state and direction
    // left: points right when closed, left when open
    // right: points left when closed, right when open
    const isLeft = direction === 'left';
    const rotation = isLeft
        ? open
            ? 'rotate-180'
            : 'rotate-0'
        : open
        ? 'rotate-0'
        : 'rotate-180';

    return (
        <button
            onClick={onClick}
            className={cn(
                // Add Tailwind button animation utilities
                'flex justify-center items-center transition-transform duration-300 ease-in-out btn btn-xs btn-square',
                'active:scale-95 focus:scale-105 hover:scale-105', // Tailwind animation for button
                open ? 'opacity-60' : 'opacity-100'
            )}
            aria-label={open ? 'Close panel' : 'Open panel'}
            tabIndex={0}
        >
            <span
                className={cn(
                    'inline-flex transition-transform duration-300',
                    rotation
                )}
            >
                <PanelRightOpen size={20} />
            </span>
        </button>
    );
};

export default TogglePanelComponent;
