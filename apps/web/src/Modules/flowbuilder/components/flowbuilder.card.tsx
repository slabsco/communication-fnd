// apps/web/src/Components/Card.tsx
import React from 'react';

interface CardProps {
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}

const FlowBuilderCard: React.FC<CardProps> = ({
    title,
    description,
    color,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 text-white rounded-lg transition-all cursor-pointer hover:shadow-md ${color}`}
        >
            <h3 className='font-bold'>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default FlowBuilderCard;
