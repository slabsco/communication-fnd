import { ReactNode, useMemo, useState } from 'react';

import { IsUndefinedOrNull } from '@finnoto/core';
import {
    Badge,
    cn,
    DropdownMenu,
    DropdownMenuActionProps,
    IconButton,
    InputField,
} from '@finnoto/design-system';

import { useFlowBuilderApi } from '../flowbuilder.api.context';
import { useFlowBuilder } from '../flowbuilder.context';
import { generateIdFromTimestamp } from '../utils/flowbuilder.common.utils';
import { FlowBuilderCommonSourceHandler } from './flowbuilder.common.source.handler';

import { MoreIcon } from 'assets';

export const CommonNodeComponentContainer = ({
    data,
    id,
    type,
    actions,
    children,
}: {
    data: any;
    id: string;
    type: string;
    actions?: DropdownMenuActionProps[];
    children: ReactNode;
}) => {
    const { addMultipleNodes, deleteNode, getNodeData, updateNodeData } =
        useFlowBuilder();

    const [showInputTitle, setShowInputTitle] = useState(false);

    const { availableNodes } = useFlowBuilderApi();

    const CONSTANT_DATA: any = availableNodes[type];

    const onlyActions = useMemo(() => {
        if (actions?.length > 1) return;
        return actions?.[0];
    }, [actions]);

    const isStartingStep = useMemo(() => {
        const data: any = getNodeData(id);
        return data?.isStartingStep;
    }, [getNodeData, id]);

    const insideActions = useMemo(() => {
        if (!IsUndefinedOrNull(onlyActions))
            return [
                {
                    name: onlyActions?.name,
                    action: () => {
                        onlyActions?.action?.();
                    },
                },
            ];

        return actions || [];
    }, [actions, onlyActions]);

    const handleTitleDoubleClick = () => {
        setShowInputTitle(true);
    };

    return (
        <div className=' text-white bg-white rounded-xl shadow-xl col-flex min-w-[200px] max-w-[400px] relative'>
            <div
                className={cn(
                    'flex gap-3 rounded-t-lg justify-between items-center px-3 py-2 bg-yellow-400 bg-pink-500 bg-blue-500 bg-green-500 hover:cursor-move',
                    CONSTANT_DATA?.style?.color
                )}
            >
                <div className='flex gap-1 items-center'>
                    {CONSTANT_DATA?.icon}
                    <div className='flex flex-1 gap-3 items-center'>
                        {showInputTitle ? (
                            <div>
                                <InputField
                                    onMouseLeave={(e: any) => {
                                        setTimeout(() => {
                                            updateNodeData(id, {
                                                ...data,
                                                titleName: e?.target
                                                    ?.value as any,
                                            });
                                            setShowInputTitle(false);
                                        }, 3000);
                                    }}
                                    value={
                                        data?.titleName || CONSTANT_DATA?.title
                                    }
                                />
                            </div>
                        ) : (
                            <p
                                className='flex gap-1 items-center font-semibold hover:cursor-text'
                                onDoubleClick={handleTitleDoubleClick}
                            >
                                {data?.titleName || CONSTANT_DATA?.title}{' '}
                            </p>
                        )}

                        {isStartingStep && (
                            <Badge
                                label={'Starting Step'}
                                size='xs'
                                appearance='polaris-tertiary'
                            />
                        )}
                    </div>
                </div>
                <DropdownMenu
                    actions={[
                        {
                            name: 'Copy',
                            action: () => {
                                const position = getNodeData(id);
                                addMultipleNodes([
                                    {
                                        id: generateIdFromTimestamp(),
                                        type: type,
                                        position: {
                                            x: position.position.x - 100,
                                            y: position.position.y - 100,
                                        },
                                        data: data,
                                    },
                                ]);
                            },
                        },
                        ...insideActions,
                        {
                            name: 'Delete',
                            action: () => {
                                deleteNode?.(id);
                            },
                            isCancel: true,
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
                        iconSize={28}
                        iconClass='text-white'
                        size='md'
                    />
                </DropdownMenu>
            </div>
            {children}
            {data?.timeout > 0 && (
                <div className='relative p-2 m-2 mt-0 bg-red-100 rounded text-primary'>
                    Timeout:
                    <span className='font-medium'>{data?.timeout} Minutes</span>
                    <FlowBuilderCommonSourceHandler
                        validateFromSourceHandle
                        id={`timeout`}
                        className='w-3 h-3 bg-red-400 border-2 border-white'
                    />
                </div>
            )}
        </div>
    );
};
