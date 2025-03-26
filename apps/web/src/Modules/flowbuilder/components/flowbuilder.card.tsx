// apps/web/src/Components/Card.tsx
import React from 'react';

import {
    FlowBuilderCardConstants,
    FlowBuilderPanelCardType,
} from '../constants/flowbuilder.constant';

interface CardProps {
    type: FlowBuilderPanelCardType;
    onClick: () => void;
}

const FlowBuilderCard: React.FC<CardProps> = ({ type, onClick }) => {
    const activeData = FlowBuilderCardConstants[type];
    return (
        <div
            onClick={onClick}
            className={`p-2 text-white rounded-lg transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${activeData.color}`}
        >
            <div className='flex gap-2 items-center'>
                {activeData?.icon}

                <h3 className='font-bold'>{activeData?.title}</h3>
            </div>
            <p className='text-sm'>{activeData?.description}</p>
        </div>
    );
};

export default FlowBuilderCard;
