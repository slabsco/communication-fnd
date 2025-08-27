import { cn } from '@finnoto/design-system';

const Hamburger = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => (
    <button
        className='flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none'
        onClick={onClick}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        type='button'
    >
        <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
        ></span>
        <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out my-1 ${
                isOpen ? 'opacity-0' : ''
            }`}
        ></span>
        <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
        ></span>
    </button>
);

export default Hamburger;

type ExpandCollapseProps = {
    children: React.ReactNode;
    open: boolean;
};

export const ExpandCollapse: React.FC<ExpandCollapseProps> = ({
    children,
    open,
}) => {
    if (!open) return;
    return (
        <div
            className={cn(
                'hidden relative w-full h-full lg:col-span-2 xl:flex'
            )}
        >
            <div
                className={`
                    absolute right-0 top-0 bottom-0 h-full
                    transition-all duration-300 bg-base-100 rounded
                    ${
                        open
                            ? 'h-full opacity-100 translate-x-0 pointer-events-auto'
                            : 'p-0 h-0 opacity-0 translate-x-full pointer-events-none'
                    }
                `}
                style={{
                    transitionProperty: 'transform, opacity, height, padding',
                    width: '100%',
                    zIndex: 10,
                }}
            >
                {children}
            </div>
        </div>
    );
};
