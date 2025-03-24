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
    max,
}: {
    getData: (data: any) => void;
    data: any;
    max?: number;
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
                    max={max}
                    answers={answer}
                    getAnswers={(answers) => {
                        setAnswer(answers);
                    }}
                />

                {max && (
                    <div className='text-warning'>
                        Only {max} answer are allowed!
                    </div>
                )}
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

export const openSetQuestionModal = ({
    data,
    getData,
    max,
}: {
    data?: any;
    getData?: any;
    max?: any;
}) => {
    return Modal.open({
        component: SetQuestionModal,
        modalSize: 'sm',
        props: {
            max,
            data,
            getData,
        },
    });
};
