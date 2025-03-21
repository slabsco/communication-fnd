import { useList, useUpdateEffect } from 'react-use';
import { Handle, Position } from 'reactflow';

import { IsEmptyArray } from '@finnoto/core';
import { Button, TextareaField } from '@finnoto/design-system';
import { SingleFileUploader } from '@finnoto/design-system/src/Composites/Uploader/Components/SingleFile.upload.component copy';

import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { RenderMessagesComponent } from '../components/flowbuilder.render.message.component';
import { useFlowBuilder } from '../flowbuilder.context';
import { CommonNodePropsTypes } from './ask.question.node.type';

export const SendMessageNode = ({ data, id, type }: CommonNodePropsTypes) => {
    const { updateNodeData } = useFlowBuilder();

    const [component, { push, removeAt, updateAt }] = useList<any>(
        data?.data || []
    );

    const addComponent = (type) => {
        push({ type: type, data: {}, id: new Date().toISOString().toString() });
    };

    const handleUpdateData = (index: number, updateValue: any) => {
        const prevData = component[index];
        updateAt(index, {
            ...prevData,
            data: {
                ...prevData?.data,
                ...updateValue,
            },
        });
    };

    useUpdateEffect(() => {
        if (IsEmptyArray(component)) return;
        updateNodeData(id, { data: component });
    }, [component]);

    return (
        <CommonNodeComponentContainer
            data={data}
            id={id}
            type={type}
            actions={[
                {
                    name: 'Add Message',
                    action: () => {
                        addComponent('message');
                    },
                },
                {
                    name: 'Add Image',
                    action: () => {
                        addComponent('image');
                    },
                },
            ]}
        >
            <div className='gap-2 px-2 py-4 col-flex'>
                <RenderMessagesComponent
                    component={component}
                    removeAt={removeAt}
                    type='message'
                >
                    {(index, value) => {
                        return (
                            <TextareaField
                                inputClassName='leading-5'
                                key={value?.id}
                                value={value?.data?.message}
                                onBlur={(_e) => {
                                    handleUpdateData(index, { message: _e });
                                }}
                                rows={2}
                                size='sm'
                                placeholder={'Enter your message here'}
                            />
                        );
                    }}
                </RenderMessagesComponent>
                <RenderMessagesComponent
                    component={component}
                    removeAt={removeAt}
                    type='image'
                >
                    {(index, val) => {
                        return (
                            <SingleFileUploader
                                value={
                                    val?.data?.document_url ? [val?.data] : []
                                }
                                onFileUpload={(data) => {
                                    handleUpdateData(index, data?.[0]);
                                }}
                            />
                        );
                    }}
                </RenderMessagesComponent>
            </div>

            <Handle
                isConnectable
                isConnectableStart
                type='target'
                position={Position.Left}
                className='bg-transparent'
            />
            <Handle
                type='source'
                position={Position.Right}
                className='w-3 h-3 bg-red-500 border-2 border-white'
            />
        </CommonNodeComponentContainer>
    );
};
