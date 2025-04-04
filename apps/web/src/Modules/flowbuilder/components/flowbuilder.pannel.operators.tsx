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
            className='gap-1 justify-center items-center p-2 rounded transition-all cursor-pointer col-flex hover:bg-primary/10'
        >
            <div className={cn('p-1 rounded-full bg-base-200', color)}>
                {icon}
            </div>
            <p className='text-xs font-medium text-center'>{title}</p>
        </div>
    );
};

export default FlowBuilderOperatorsCard;
