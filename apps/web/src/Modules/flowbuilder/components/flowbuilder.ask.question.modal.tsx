import { Modal, ModalBody, ModalContainer } from '@finnoto/design-system';

import { FlowBuilderPanelCardType } from '../constants/flowbuilder.constant';
import FlowBuilderCard from './flowbuilder.card';

const FlowBuilderAskQuestionModal = ({
    selectedComponent,
}: {
    selectedComponent: (FlowBuilderPanelCardType) => void;
}) => {
    const handleSelectedComponent = (type: FlowBuilderPanelCardType) => {
        selectedComponent?.(type);
        Modal.close();
    };
    return (
        <ModalContainer title='Select Question'>
            <ModalBody className='gap-2 col-flex'>
                <FlowBuilderCard
                    onClick={() => handleSelectedComponent('ask_question')}
                    type='ask_question'
                />
                <FlowBuilderCard
                    onClick={() =>
                        handleSelectedComponent('ask_question_button')
                    }
                    type='ask_question_button'
                />
                <FlowBuilderCard
                    onClick={() => handleSelectedComponent('ask_question_list')}
                    type='ask_question_list'
                />
            </ModalBody>
        </ModalContainer>
    );
};

export default FlowBuilderAskQuestionModal;

export const openAskQuestionModal = (
    selectedComponent: (type: FlowBuilderPanelCardType) => void
) => {
    return Modal.open({
        component: FlowBuilderAskQuestionModal,
        props: {
            selectedComponent,
        },
    });
};
