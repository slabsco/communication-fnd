import { useState } from 'react';

import {
    Button,
    InputField,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';

import {
    FlowBuilderAnswerOptions,
    FlowBuilderQuestionModalHeader,
} from './flowbuilder.answer.options.component';
import FlowBuilderMessageComponent from './flowbuilder.message.component';
import { TimeOutFieldInput } from './set.button.question.modal';

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
    const [variableName, setVariableName] = useState<string>(
        data?.variableName || ''
    );
    const [timeout, setTimeout] = useState<number>(data?.timeout || '');

    const sendData = () => {
        getData({
            html,
            answer,
            variableName,
            timeout,
        });
    };

    return (
        <ModalContainer
            title={max === 3 ? ' Add Question Button' : 'Add Question List'}
        >
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
                <div className='gap-2 col-flex'>
                    <FlowBuilderQuestionModalHeader
                        name={'Save Answer in Variable'}
                    />
                    <InputField
                        prefix='@'
                        placeholder={'ex: age'}
                        value={variableName}
                        onBlur={(val) => {
                            setVariableName(val);
                        }}
                    />
                </div>
                <TimeOutFieldInput setTimeout={setTimeout} timeout={timeout} />
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
                            sendData();
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

export interface Section {
    id: string;
    title: string;
    rows: Array<{
        id: string;
        text: string;
        description?: string; // Added description field
    }>;
}
