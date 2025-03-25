import { ReactNode, useMemo } from 'react';

import { IsUndefinedOrNull } from '@finnoto/core';
import {
    Badge,
    Button,
    cn,
    DropdownMenu,
    DropdownMenuActionProps,
    IconButton,
} from '@finnoto/design-system';

import DropdownActionButton from '../../../Components/DropdownButton/dropdown.action.button';
import {
    FlowBuilderCardConstants,
    FlowBuilderPanelCardType,
} from '../constants/flowbuilder.constant';
import { useFlowBuilder } from '../flowbuilder.context';
import { generateIdFromTimestamp } from '../utils/flowbuilder.common.utils';

import { MoreIcon } from 'assets';

export type CommonNodePropsTypes = {
    data: any;
    id: string;
    type: any;
};

export const CommonNodeComponentContainer = ({
    data,
    id,
    type,
    actions,
    children,
}: {
    data: any;
    id: string;
    type: FlowBuilderPanelCardType;
    actions?: DropdownMenuActionProps[];
    children: ReactNode;
}) => {
    const { addMultipleNodes, deleteNode, getNodeData, setStartingStep } =
        useFlowBuilder();

    const CONSTANT_DATA: any = FlowBuilderCardConstants[type];

    const onlyActions = useMemo(() => {
        if (actions?.length > 1) return;
        return actions?.[0];
    }, [actions]);

    const isStartingStep = useMemo(() => {
        const data: any = getNodeData(id);
        return data?.isStartingStep;
    }, [getNodeData, id]);

    return (
        <div className=' text-white bg-white rounded-xl shadow-md col-flex min-w-[200px] max-w-[400px] relative'>
            <div
                className={cn(
                    'flex gap-3 rounded-t-lg justify-between items-center px-3 py-2 hover:cursor-move',
                    CONSTANT_DATA.color
                )}
            >
                <div className='flex gap-1 items-center'>
                    {CONSTANT_DATA?.icon}
                    <div className='flex flex-1 gap-3 items-center'>
                        <p className='font-bold'>{CONSTANT_DATA?.title}</p>
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
                        {
                            name: 'Set Starting Step',
                            visible: !isStartingStep,
                            action: () => {
                                setStartingStep(id);
                            },
                        },
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
                        iconClass='text-white'
                        size='xs'
                    />
                </DropdownMenu>
            </div>
            {children}

            <div className='overflow-hidden px-2 py-2 w-full'>
                {!IsUndefinedOrNull(onlyActions) ? (
                    <Button
                        outline
                        size='sm'
                        wide
                        className='w-full'
                        onClick={() => {
                            onlyActions?.action?.();
                        }}
                    >
                        {onlyActions?.name}
                    </Button>
                ) : (
                    <DropdownActionButton
                        size='sm'
                        buttonProps={{
                            wide: true,
                            outline: true,
                            className: 'w-full',
                        }}
                        hideOnNoAction
                        actions={actions}
                    />
                )}
            </div>
        </div>
    );
};
