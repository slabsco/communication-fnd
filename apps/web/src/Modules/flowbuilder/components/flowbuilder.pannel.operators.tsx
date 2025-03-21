import { Clock, UserIcon } from 'lucide-react';

export const FlowBuilderOperatorCardTypes = {
    assign_user: {
        icon: (
            <UserIcon
                size={40}
                className='p-1 rounded-full bg-base-200 text-info'
            />
        ),
        text: 'Assign User',
    },
    time_delay: {
        icon: (
            <Clock
                size={40}
                className='p-1 rounded-full bg-base-200 text-info'
            />
        ),
        text: 'Delay Time',
    },
};

const FlowBuilderOperatorsCard = ({
    type,
    onClick,
}: {
    type: keyof typeof FlowBuilderOperatorCardTypes;
    onClick: () => void;
}) => {
    return (
        <div className='gap-1 justify-center items-center p-3 cursor-pointer col-flex'>
            {FlowBuilderOperatorCardTypes[type].icon}
            <p className='text-sm font-medium'>
                {FlowBuilderOperatorCardTypes[type].text}
            </p>
        </div>
    );
};

export default FlowBuilderOperatorsCard;
