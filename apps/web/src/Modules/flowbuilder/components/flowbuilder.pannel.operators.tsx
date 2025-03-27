import { ReactNode } from 'react';

import { cn } from '@finnoto/design-system';

const FlowBuilderOperatorsCard = ({
    onClick,
    color,
    icon,
    title,
}: {
    onClick: () => void;
    color: string;
    icon: ReactNode;
    title: string;
}) => {
    return (
        <div
            onClick={onClick}
            className='gap-1 justify-center items-center p-3 rounded transition-all cursor-pointer col-flex hover:bg-primary/10'
        >
            <div className={cn('p-2 rounded-full bg-base-200', color)}>
                {icon}
            </div>
            <p className='text-sm font-medium'>{title}</p>
        </div>
    );
};

export default FlowBuilderOperatorsCard;
