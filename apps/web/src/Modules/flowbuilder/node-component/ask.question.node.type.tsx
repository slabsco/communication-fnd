import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { FlowBuilderCommonSourceHandler } from '../components/flowbuilder.common.source.handler';
import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { openSetQuestionModal } from '../components/set.question.modal';
import { useFlowBuilder } from '../flowbuilder.context';
import { RenderHeaderBodyFooter } from './ask.question.list.node.type';

export const AskQuestionNodeType = ({ data, id, type }: any) => {
    const { updateNodeData } = useFlowBuilder();

    return (
        <CommonNodeComponentContainer
            data={data}
            id={id}
            type={type}
            actions={[
                {
                    name: 'Manage',
                    action: () => {
                        openSetQuestionModal({
                            data: data,
                            getData: (data) => {
                                updateNodeData(id, data);
                            },
                        });
                    },
                },
            ]}
        >
            <div className='p-2 text-primary min-h-12'>
                <div className='gap-2 col-flex'>
                    <RenderHeaderBodyFooter
                        body={data?.html}
                        footer={data?.footer}
                        header={data?.header}
                    />

                    <div className='gap-2 col-flex'>
                        {data?.answer?.map((_answer) => {
                            return (
                                <div
                                    key={_answer?.id}
                                    className='relative px-3 py-2 rounded bg-base-200'
                                >
                                    {_answer?.text}
                                    <FlowBuilderCommonSourceHandler
                                        id={_answer.id}
                                        validateFromSourceHandle
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
            <FlowBuilderCommonTargetHandler />
        </CommonNodeComponentContainer>
    );
};
