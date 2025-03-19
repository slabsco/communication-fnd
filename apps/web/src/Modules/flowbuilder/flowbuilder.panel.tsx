import { openAskQuestionModal } from './components/flowbuilder.ask.question.modal';
import FlowBuilderCard from './components/flowbuilder.card';
import { useFlowBuilder } from './flowbuilder.context';
import { NodeTypesInternal } from './flowbuilder.main';
import { CreateNewNode } from './utils/flowbuilder.common.utils';

const FlowBuilderPanel = () => {
    const { addMultipleNodes, deleteNode } = useFlowBuilder();

    const addNode = (component: NodeTypesInternal) => {
        const node = CreateNewNode({
            component: component,
            onCopy: (newNode) => {
                addMultipleNodes([newNode]);
            },
            onDelete: (id) => {
                deleteNode(id);
            },
        });

        addMultipleNodes([node]);
    };

    return (
        <div className='p-2 w-3/12 h-full bg-white col-flex'>
            <div className='gap-3 col-flex'>
                <FlowBuilderCard
                    onClick={() => addNode('send_message')}
                    title='Send a message'
                    description='With no response required from visitor'
                    color='bg-red-500'
                />
                <FlowBuilderCard
                    onClick={() => {
                        openAskQuestionModal((type) => {
                            addNode(type);
                        });
                    }}
                    title='Ask a question'
                    description='Ask question and store user input in variable'
                    color='bg-orange'
                />
                <FlowBuilderCard
                    onClick={() => addNode('set_condition')}
                    title='Set a condition'
                    description='Send message(s) based on logical condition(s)'
                    color='bg-purple-500'
                />
            </div>
        </div>
    );
};

export default FlowBuilderPanel;
