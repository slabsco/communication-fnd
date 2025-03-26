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
} from '../components/flowbuilder.answer.options.component';
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
    const [header, setHeader] = useState<string>(data?.header || '');
    const [footer, setFooter] = useState<string>(data?.footer || '');
    const [variableName, setVariableName] = useState<string>(
        data?.variableName || ''
    );

    const sendData = () => {
        getData({
            html,
            answer,
            header,
            footer,
            variableName,
        });
    };

    return (
        <ModalContainer
            title={max === 3 ? ' Add Question Button' : 'Add Question List'}
        >
            <ModalBody className='gap-3 col-flex'>
                <div className='gap-2 col-flex'>
                    <FlowBuilderQuestionModalHeader name={'Header'} />
                    <InputField
                        placeholder={'Enter your header here'}
                        value={header}
                        onBlur={(val) => {
                            setHeader(val);
                        }}
                    />
                </div>
                <FlowBuilderMessageComponent
                    getHtml={(_data) => {
                        setHtml(_data);
                    }}
                    html={html}
                />
                <div className='gap-2 col-flex'>
                    <FlowBuilderQuestionModalHeader name={'Footer'} />
                    <InputField
                        placeholder={'Enter your footer here'}
                        value={footer}
                        onBlur={(val) => {
                            setFooter(val);
                        }}
                    />
                </div>

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
