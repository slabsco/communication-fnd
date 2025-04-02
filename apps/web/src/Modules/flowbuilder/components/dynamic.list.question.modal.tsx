import { useState } from 'react';

import {
    Button,
    InputField,
    JsEditorComponent,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';
import { Label } from '@finnoto/design-system/src/Components/Inputs/InputField/label.component';

import {
    DynamicDefaultApiConfig,
    DynamicDefaultExampleQuestionButton,
    DynamicDefaultExampleQuestionList,
    DynamicDefaultExampleSendMessage,
    dynamicDefaultValueFormatter,
    DynamicSetConditionExample,
} from '../dynamic.node.script.example';
import { TimeOutFieldInput } from './set.button.question.modal';

const SetDynamicDataModal = ({
    data,
    getData,
    onlyApiConfig = false,
    onlyScript = false,
    node_type,
}: {
    getData: (data: any) => void;
    data: any;
    onlyApiConfig?: boolean;
    onlyScript?: boolean;
    node_type?: string;
}) => {
    const [apiConfigScript, setApiConfigScript] = useState<any>(
        data?.apiConfigScript || DynamicDefaultApiConfig
    );
    const [dataScript, setDataScript] = useState<any>(
        data?.dataScript || dynamicDefaultValueFormatter
    );

    const [timeout, setTimeout] = useState<number>(data?.timeout || '');

    const [variableName, setVariableName] = useState<string>(
        data?.variableName || ''
    );

    const sendData = () => {
        getData({
            dataScript,
            apiConfigScript,
            variableName,
            timeout,
        });
    };

    return (
        <ModalContainer title={'Add Dynamic Node'}>
            <ModalBody className='overflow-y-auto gap-3 col-flex'>
                {!onlyScript && (
                    <div className='overflow-hidden h-[400px]'>
                        <Label label='API Config' required />
                        <div className='overflow-y-auto'>
                            <JsEditorComponent
                                value={apiConfigScript}
                                onChange={(val) => {
                                    setApiConfigScript(val);
                                }}
                            />
                        </div>
                    </div>
                )}

                {!onlyApiConfig && (
                    <div className='h-[400px] col-flex gap-2'>
                        <div className='flex gap-2 items-center'>
                            <Label label='Response Formatter' required />
                            <Button
                                size='sm'
                                outline
                                onClick={() => openExampleModal(node_type)}
                            >
                                See Example
                            </Button>
                        </div>
                        <JsEditorComponent
                            value={dataScript}
                            onChange={(val) => {
                                setDataScript(val);
                            }}
                        />
                    </div>
                )}

                <InputField
                    prefix='@'
                    label='Variable Name'
                    value={variableName}
                    onChange={setVariableName}
                    required
                    placeholder={
                        'Users Response will be saved on this variable Name'
                    }
                />
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
export const openDynamicDataModal = ({
    data,
    getData,
    onlyApiConfig,
    onlyScript,
    node_type,
}: {
    data?: any;
    getData?: any;
    node_type?: any;
    onlyApiConfig?: boolean;
    onlyScript?: boolean;
}) => {
    return Modal.open({
        component: SetDynamicDataModal,
        modalSize: 'xl',
        props: {
            onlyApiConfig,
            onlyScript,
            node_type,
            data,
            getData,
        },
    });
};

export const openExampleModal = (node_type: string) => {
    return Modal.open({
        component: ExampleModal,
        modalSize: 'xl',
        props: { node_type },
    });
};

const ExampleModal = ({ node_type }: any) => {
    const example = {
        dynamic_send_message: DynamicDefaultExampleSendMessage,
        ask_question_list_dynamic: DynamicDefaultExampleQuestionList,
        ask_question_button_dynamic: DynamicDefaultExampleQuestionButton,
        dynamic_set_condition: DynamicSetConditionExample,
    };

    return (
        <ModalContainer title='Section Example'>
            <ModalBody>
                <JsEditorComponent value={example[node_type]} />
            </ModalBody>
            <ModalFooter>
                <Button appearance='errorHover' onClick={() => Modal.close()}>
                    Close
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};
