import { useState } from 'react';

import {
    Button,
    JsEditorComponent,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';
import { Label } from '@finnoto/design-system/src/Components/Inputs/InputField/label.component';

import { DynamicSetConditionExample } from '../dynamic.node.script.example';
import { openExampleModal } from './dynamic.list.question.modal';

const SetDynamicConditionModal = ({
    data,
    getData,
}: {
    getData: (data: any) => void;
    data: any;
}) => {
    const [dataScript, setDataScript] = useState<any>(
        data?.dataScript || DynamicSetConditionExample
    );

    const sendData = () => {
        getData({
            dataScript,
        });
    };

    return (
        <ModalContainer title={'Add Dynamic Condition'}>
            <ModalBody className='overflow-y-auto gap-3 col-flex'>
                <div className='h-[400px] col-flex gap-2'>
                    <div className='flex gap-2 items-center'>
                        <Label label='Condition Script' required />
                        <Button
                            size='sm'
                            outline
                            onClick={() =>
                                openExampleModal('dynamic_set_condition')
                            }
                        >
                            See Section Example
                        </Button>
                    </div>
                    <JsEditorComponent
                        value={dataScript}
                        onChange={(val) => {
                            setDataScript(val);
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
export const openDynamicSetConditionModal = ({
    data,
    getData,
}: {
    data?: any;
    getData?: any;
}) => {
    return Modal.open({
        component: SetDynamicConditionModal,
        modalSize: 'xl',
        props: {
            data,
            getData,
        },
    });
};
