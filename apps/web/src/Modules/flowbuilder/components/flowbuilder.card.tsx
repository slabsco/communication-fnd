import { ReactNode } from 'react';

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
            className={`p-2 text-white rounded-lg transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${color}`}
        >
            <div className='flex gap-2 items-center'>
                {icon}

                <h3 className='font-bold'>{title}</h3>
            </div>
            <p className='text-sm'>{description}</p>
        </div>
    );
};

export default FlowBuilderCard;
