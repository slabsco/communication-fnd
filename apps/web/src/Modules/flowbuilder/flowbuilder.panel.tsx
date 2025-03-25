import { openAskQuestionModal } from './components/flowbuilder.ask.question.modal';
import FlowBuilderCard from './components/flowbuilder.card';
import FlowBuilderOperatorsCard from './components/flowbuilder.pannel.operators';
import { FlowBuilderPanelCardType } from './constants/flowbuilder.constant';
import { useFlowBuilder } from './flowbuilder.context';
import { CreateNewNode } from './utils/flowbuilder.common.utils';

const FlowBuilderPanel = () => {
    const { addMultipleNodes, nodes } = useFlowBuilder();

    const addNode = (component: FlowBuilderPanelCardType) => {
        const node = CreateNewNode({
            component: component,
        });

        if (nodes?.length) return addMultipleNodes([node]);
        addMultipleNodes([{ ...node, isStartingStep: true } as any]);
    };

    return (
        <div className='p-2 w-2/12 h-full bg-white rounded col-flex'>
            <div className='gap-3 col-flex'>
                <FlowBuilderCard
                    onClick={() => addNode('send_message')}
                    type='send_message'
                />
                <FlowBuilderCard
                    onClick={() => {
                        openAskQuestionModal((type) => {
                            addNode(type);
                        });
                    }}
                    type='ask_question'
                />
                <FlowBuilderCard
                    onClick={() => addNode('set_condition')}
                    type='set_condition'
                />
            </div>
            <div className='mt-4'>
                <h3 className='text-lg font-medium'>Operators</h3>
                <div className='grid grid-cols-2 gap-2 items-center mt-2'>
                    <FlowBuilderOperatorsCard
                        onClick={() => addNode('assign_user')}
                        type='assign_user'
                    />
                    <FlowBuilderOperatorsCard
                        type='set_time_delay'
                        onClick={() => addNode('set_time_delay')}
                    />
                </div>
            </div>
        </div>
    );
};

export default FlowBuilderPanel;
