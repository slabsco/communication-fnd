import { ReactNode } from 'react';

import { cn } from '@finnoto/design-system';

interface CardProps {
    icon: ReactNode;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}

const FlowBuilderCard: React.FC<CardProps> = ({
    color,
    description,
    title,
    icon,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                `p-2 text-white rounded-lg transition-all cursor-pointer  hover:shadow-md hover:-translate-y-0.5`,
                color
            )}
        >
            <div className='flex gap-1 items-center text-sm'>
                {icon}
                <h3 className='font-bold'>{title}</h3>
            </div>
            <p className='text-xs'>{description}</p>
        </div>
    );
};

export default FlowBuilderCard;
