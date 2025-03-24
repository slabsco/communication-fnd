import { cn } from '@finnoto/design-system';

import {
    FlowBuilderCardConstants,
    FlowBuilderPanelCardType,
} from '../constants/flowbuilder.constant';

const FlowBuilderOperatorsCard = ({
    type,
    onClick,
}: {
    type: FlowBuilderPanelCardType;
    onClick: () => void;
}) => {
    const activeData = FlowBuilderCardConstants[type];
    return (
        <div
            onClick={onClick}
            className='gap-1 justify-center items-center p-3 rounded transition-all cursor-pointer col-flex hover:bg-primary/10'
        >
            <div
                className={cn('p-2 rounded-full bg-base-200', activeData.color)}
            >
                {activeData.icon}
            </div>
            <p className='text-sm font-medium'>{activeData.title}</p>
        </div>
    );
};

export default FlowBuilderOperatorsCard;
