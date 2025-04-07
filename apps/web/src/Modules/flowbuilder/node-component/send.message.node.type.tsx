import { useList, useUpdateEffect } from 'react-use';

import { IsEmptyArray } from '@finnoto/core';
import { TextareaField } from '@finnoto/design-system';
import { SingleFileUploader } from '@finnoto/design-system/src/Composites/Uploader/Components/SingleFile.upload.component copy';

import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { FlowBuilderCommonSourceHandler } from '../components/flowbuilder.common.source.handler';
import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { RenderMessagesComponent } from '../components/flowbuilder.render.message.component';
import { useFlowBuilder } from '../flowbuilder.context';

export const SendMessageNode = ({ data, id, type }: any) => {
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
                {
                    name: 'Add Video',
                    action: () => {
                        addComponent('video');
                    },
                },
            ]}
        >
            <div className='gap-2 px-2 py-4 col-flex'>
                <RenderMessagesComponent
                    component={component}
                    removeAt={removeAt}
                    type='message'
                    element={(index, value) => {
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
                />
                <RenderMessagesComponent
                    component={component}
                    removeAt={removeAt}
                    type='image'
                    element={(index, value) => {
                        return (
                            <SingleFileUploader
                                accept={{
                                    'image/jpeg': [],
                                    'image/png': [],
                                }}
                                value={
                                    value?.data?.document_url
                                        ? [value?.data]
                                        : []
                                }
                                onFileUpload={(data) => {
                                    handleUpdateData(index, data?.[0]);
                                }}
                            />
                        );
                    }}
                />
                <RenderMessagesComponent
                    component={component}
                    removeAt={removeAt}
                    type='video'
                    element={(index, value) => {
                        return (
                            <SingleFileUploader
                                maxSize={100}
                                accept={{
                                    'video/mp4': [],
                                }}
                                fileSupportText='MP4'
                                value={
                                    value?.data?.document_url
                                        ? [value?.data]
                                        : []
                                }
                                onFileUpload={(data) => {
                                    handleUpdateData(index, data?.[0]);
                                }}
                            />
                        );
                    }}
                />
            </div>

            <FlowBuilderCommonTargetHandler />
            <FlowBuilderCommonSourceHandler className='w-3 h-3 bg-red-500 border-2 border-white' />
        </CommonNodeComponentContainer>
    );
};
