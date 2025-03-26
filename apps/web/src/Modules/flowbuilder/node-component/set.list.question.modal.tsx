import { useState } from 'react';

import {
    Button,
    InputField,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';

import { FlowBuilderQuestionModalHeader } from '../components/flowbuilder.answer.options.component';
import { FlowBuilderListAnswerOptions } from '../components/flowbuilder.list.answer.options.component';
import FlowBuilderMessageComponent from '../components/flowbuilder.message.component';

export interface Section {
    id: string;
    title: string;
    rows: Array<{
        id: string;
        text: string;
        description?: string; // Added description field
    }>;
}

const SetListQuestionModal = ({
    data,
    getData,
    max,
}: {
    getData: (data: any) => void;
    data: any;
    max?: number;
}) => {
    console.log({ data });

    const [html, setHtml] = useState<any>(data?.html || '');
    const [header, setHeader] = useState<string>(data?.header || '');
    const [footer, setFooter] = useState<string>(data?.footer || '');
    const [buttonName, setButtonName] = useState<string>(
        data?.buttonName || ''
    );

    const initialSections = data?.sections || [];

    const [sections, setSections] = useState<Section[]>(
        initialSections.length
            ? initialSections
            : [
                  {
                      id: Date.now().toString(),
                      title: '',
                      rows: [
                          {
                              id: Date.now().toString(),
                              text: '',
                              description: '',
                          },
                      ], // Added description field
                  },
              ]
    );

    const sendData = () => {
        getData({
            html,
            header,
            footer,
            sections,
            buttonName,
        });
    };

    return (
        <ModalContainer title={'Add Lists'}>
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
                <div className='gap-2 col-flex'>
                    <FlowBuilderQuestionModalHeader name={'Button Name'} />
                    <InputField
                        placeholder={'Enter your button name'}
                        value={buttonName}
                        onBlur={(val) => {
                            setButtonName(val);
                        }}
                    />
                </div>

                <FlowBuilderListAnswerOptions
                    setSections={setSections}
                    sections={sections}
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

export const openListQuestionModal = ({
    data,
    getData,
    max,
}: {
    data?: any;
    getData?: any;
    max?: any;
}) => {
    return Modal.open({
        component: SetListQuestionModal,
        modalSize: 'sm',
        props: {
            max,
            data,
            getData,
        },
    });
};
