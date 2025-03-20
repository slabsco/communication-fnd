import { useState } from 'react';

import {
    Button,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';

import { FlowBuilderAnswerOptions } from '../components/flowbuilder.answer.options.component';
import FlowBuilderMessageComponent from '../components/flowbuilder.message.component';

const SetQuestionModal = ({
    data,
    getData,
}: {
    getData: (data: any) => void;
    data: any;
}) => {
    const [html, setHtml] = useState<any>(data?.html || '');
    const [answer, setAnswer] = useState<any>(data?.answer || []);

    return (
        <ModalContainer title='Add Question'>
            <ModalBody className='gap-3 col-flex'>
                <FlowBuilderMessageComponent
                    getHtml={(_data) => {
                        setHtml(_data);
                    }}
                    html={html}
                />
                <FlowBuilderAnswerOptions
                    answers={answer}
                    getAnswers={(answers) => {
                        setAnswer(answers);
                    }}
                />
            </ModalBody>
            <ModalFooter className='py-4 justify'>
                <div className='flex-1 gap-4 row-flex'>
                    <Button
                        appearance='errorHover'
                        onClick={() => Modal.close()}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance='success'
                        className='flex-1'
                        onClick={() => {
                            getData({
                                html,
                                answer,
                            });
                            Modal.close();
                        }}
                    >
                        Save
                    </Button>
                </div>
            </ModalFooter>
        </ModalContainer>
    );
};

export const openSetQuestionModal = ({ data, getData }) => {
    return Modal.open({
        component: SetQuestionModal,
        modalSize: 'sm',
        props: {
            data,
            getData,
        },
    });
};
