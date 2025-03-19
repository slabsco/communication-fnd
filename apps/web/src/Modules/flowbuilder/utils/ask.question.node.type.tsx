import { Handle, Position } from 'reactflow';

import { CommonNodeComponentContainer } from './send.message.node.type';

export const AskQuestionNodeType = ({ data, id }: any) => {
    return (
        <CommonNodeComponentContainer
            title='Ask a question'
            appearance='blue'
            data={data}
            id={id}
        >
            <div className='grid grid-cols-2 gap-2 p-4'>ask question</div>
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
