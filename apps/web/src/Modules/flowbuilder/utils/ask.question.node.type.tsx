import { Handle, Position } from 'reactflow';

import { useFlowBuilder } from '../flowbuilder.context';
import { CommonNodeComponentContainer } from './send.message.node.type';
import { openSetQuestionModal } from './set.question.modal';

export const AskQuestionNodeType = ({ data, id }: any) => {
    const { updateNodeData } = useFlowBuilder();

    return (
        <CommonNodeComponentContainer
            title='Ask a question'
            appearance='orange'
            data={data}
            id={id}
            onManage={() => {
                openSetQuestionModal({
                    data: data,
                    getData: (data) => {
                        updateNodeData(id, data);
                    },
                });
            }}
        >
            <div className='p-2 text-primary min-h-12'>
                <div className='gap-2 col-flex'>
                    {data?.html && (
                        <div
                            dangerouslySetInnerHTML={{ __html: data?.html }}
                        ></div>
                    )}

                    <div className='gap-2 col-flex'>
                        {data?.answer?.map((_answer) => {
                            return (
                                <div
                                    key={_answer?.id}
                                    className='relative px-3 py-2 rounded bg-base-200'
                                >
                                    {_answer?.text}
                                    <Handle
                                        type='source'
                                        position={Position.Right}
                                        id={_answer.id}
                                        className='w-3 h-3 bg-blue-400 border-2 border-white'
                                        style={{
                                            right: 1,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Handle
                isConnectable
                isConnectableStart
                type='target'
                position={Position.Left}
                className='bg-transparent'
            />
        </CommonNodeComponentContainer>
    );
};

export const AskQuestionButtonNodeType = ({ data, id }: any) => {
    return (
        <CommonNodeComponentContainer
            title='Buttons'
            appearance='orange'
            data={data}
            id={id}
        >
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

export const AskQuestionListNodeType = ({ data, id }: any) => {
    return (
        <CommonNodeComponentContainer
            title='List'
            appearance='orange'
            data={data}
            id={id}
        >
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
