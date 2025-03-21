import { Handle, Position } from 'reactflow';

import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { CommonNodePropsTypes } from './ask.question.node.type';

export const AskQuestionListNodeType = ({
    data,
    id,
    type,
}: CommonNodePropsTypes) => {
    return (
        <CommonNodeComponentContainer data={data} id={id} type={type}>
            <div className='grid grid-cols-2 gap-2 p-4'>Ask question</div>
            <Handle
                isConnectable
                isConnectableStart
                type='target'
                position={Position.Left}
                className='bg-transparent'
            />
            <Handle
                type='source'
                position={Position.Right}
                className='w-3 h-3 bg-blue-400 border-2 border-white'
            />
        </CommonNodeComponentContainer>
    );
};
