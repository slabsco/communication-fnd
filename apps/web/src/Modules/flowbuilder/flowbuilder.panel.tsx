import FlowBuilderCard from './components/flowbuilder.card';
import { useFlowBuilder } from './flowbuilder.context';
import { NodeTypesInternal } from './flowbuilder.main';
import { CreateNewNode } from './utils/flowbuilder.common.utils';

const FlowBuilderPanel = () => {
    const { addMultipleNodes } = useFlowBuilder();

    const addNode = (component: NodeTypesInternal) => {
        const node = CreateNewNode({
            component: component,
        });

        addMultipleNodes([node]);
    };

    return (
        <div className='p-2 w-2/12 h-full bg-white rounded col-flex'>
            <div className='gap-3 col-flex'>
                <FlowBuilderCard
                    onClick={() => addNode('send_message')}
                    title='Send a message'
                    description='With no response required from visitor'
                    color='bg-red-500'
                />
                <FlowBuilderCard
                    onClick={() => {
                        addNode('ask_question');

                        // openAskQuestionModal((type) => {
                        //     addNode(type);
                        // });
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
