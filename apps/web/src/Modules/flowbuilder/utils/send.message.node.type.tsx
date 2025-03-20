import { ReactNode, useMemo } from 'react';
import { useList, useUpdateEffect } from 'react-use';
import { Handle, Position } from 'reactflow';

import { IsEmptyArray, IsFunction } from '@finnoto/core';
import {
    Button,
    cn,
    DropdownMenu,
    IconButton,
    TextareaField,
} from '@finnoto/design-system';
import { SingleFileUploader } from '@finnoto/design-system/src/Composites/Uploader/Components/SingleFile.upload.component copy';

import { useFlowBuilder } from '../flowbuilder.context';
import { generateIdFromTimestamp } from './flowbuilder.common.utils';

import { DeleteSvgIcon, MoreIcon } from 'assets';

export const SendMessageNode = ({ data, id, position, type }: any) => {
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
            title='Send a Message'
            data={data}
            id={id}
            component={type}
            position={position}
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

            <div className='grid grid-cols-2 gap-2 p-2 bg-gray-100'>
                <Button
                    onClick={() => {
                        addComponent('message');
                    }}
                    size='sm'
                    outline
                >
                    Message
                </Button>
                <Button
                    size='sm'
                    outline
                    onClick={() => {
                        addComponent('image');
                    }}
                >
                    Image
                </Button>
                {/* <Button size='sm' outline>
                    Document
                </Button>
                <Button size='sm' outline>
                    Video
                </Button> */}
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
interface RenderMessagesComponentProps {
    component: any[];
    type: string;
    removeAt: (index: number) => void;
    children: (index: number, val: any) => ReactNode;
}

const RenderMessagesComponent: React.FC<RenderMessagesComponentProps> = ({
    component,
    type,
    removeAt,
    children,
}) => {
    const messageComponents = useMemo(() => {
        return component?.filter((val) => val?.type === type);
    }, [component, type]);

    return messageComponents?.map((val) => {
        const index = component?.findIndex((com) => com.id === val?.id);
        return (
            <div className='relative' key={val?.id}>
                <IconButton
                    size='xs'
                    icon={DeleteSvgIcon}
                    onClick={() => {
                        removeAt(index);
                    }}
                    outline
                    appearance='error'
                    className='absolute -top-2 -right-2'
                />
                {children?.(index, val)}
            </div>
        );
    });
};

const appearanceConstant = {
    red: {
        bg_color: 'bg-red-400',
    },
    blue: {
        bg_color: 'bg-blue-400',
    },
    orange: {
        bg_color: 'bg-orange',
    },
};
export const CommonNodeComponentContainer = ({
    data,
    title,
    id,
    children,
    appearance = 'red',
    onManage,
    component,
    position,
}: {
    data: any;
    id: string;
    children: ReactNode;
    appearance?: keyof typeof appearanceConstant;
    title: string;
    onManage?: () => void;
    position: any;
    component: any;
}) => {
    const { addMultipleNodes, deleteNode, getNodeData } = useFlowBuilder();

    return (
        <div className='overflow-hidden text-white bg-white rounded-xl shadow-md max-w-60'>
            <div
                className={cn(
                    'flex gap-3 justify-between items-center px-3 py-2 hover:cursor-move',
                    appearanceConstant[appearance].bg_color
                )}
            >
                <p className='font-bold'>{title}</p>
                <DropdownMenu
                    actions={[
                        {
                            name: 'Delete',
                            action: () => {
                                deleteNode?.(id);
                            },
                            isCancel: true,
                        },
                        {
                            name: 'Copy',
                            action: () => {
                                const position = getNodeData(id);
                                addMultipleNodes([
                                    {
                                        id: generateIdFromTimestamp(),
                                        type: component,
                                        position: {
                                            x: position.position.x - 100,
                                            y: position.position.y - 100,
                                        },
                                        data: data,
                                    },
                                ]);
                            },
                        },
                    ]}
                    className='gap-2 mt-2'
                    align={'end'}
                    size={'md'}
                >
                    <IconButton
                        shape='square'
                        icon={MoreIcon}
                        appearance='ghost'
                        iconClass='text-white'
                        size='xs'
                    />
                </DropdownMenu>
            </div>
            {children}

            {IsFunction?.(onManage) && (
                <div className='overflow-hidden p-2 bg-slate-600/10'>
                    <Button wide outline size='xs' onClick={onManage}>
                        Manage
                    </Button>
                </div>
            )}
        </div>
    );
};
