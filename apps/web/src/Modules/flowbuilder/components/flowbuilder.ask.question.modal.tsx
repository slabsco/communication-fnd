import { Modal, ModalBody, ModalContainer } from '@finnoto/design-system';

import { NodeTypesInternal } from '../flowbuilder.main';
import FlowBuilderCard from './flowbuilder.card';

type selectedComponentType = (type: NodeTypesInternal) => void;

const FlowBuilderAskQuestionModal = ({
    selectedComponent,
}: {
    selectedComponent: selectedComponentType;
}) => {
    const handleSelectedComponent = (type: NodeTypesInternal) => {
        selectedComponent?.(type);
        Modal.close();
    };
    return (
        <ModalContainer title='Select Question'>
            <ModalBody className='gap-2 col-flex'>
                <FlowBuilderCard
                    onClick={() => handleSelectedComponent('ask_question')}
                    title='Question'
                    description='Ask anything to user'
                    color='bg-orange'
                />
                <FlowBuilderCard
                    onClick={() =>
                        handleSelectedComponent('ask_question_button')
                    }
                    title='Buttons'
                    description='Chose Based On button (Maximum 3 choice)'
                    color='bg-orange'
                />
                <FlowBuilderCard
                    onClick={() => handleSelectedComponent('ask_question_list')}
                    title='List'
                    description='Chose Based On button (Maximum 10 choice)'
                    color='bg-orange'
                />
            </ModalBody>
        </ModalContainer>
    );
};

export default FlowBuilderAskQuestionModal;

export const openAskQuestionModal = (
    selectedComponent: selectedComponentType
) => {
    return Modal.open({
        component: FlowBuilderAskQuestionModal,
        props: {
            selectedComponent,
        },
    });
};
