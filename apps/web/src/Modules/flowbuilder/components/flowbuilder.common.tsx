import { ReactNode, useMemo } from 'react';

import { IsUndefinedOrNull } from '@finnoto/core';
import {
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
    const { addMultipleNodes, deleteNode, getNodeData } = useFlowBuilder();
    const CONSTANT_DATA: any = FlowBuilderCardConstants[type];

    const onlyActions = useMemo(() => {
        if (actions?.length > 1) return;
        return actions?.[0];
    }, [actions]);

    return (
        <div className='overflow-hidden text-white bg-white rounded-xl shadow-md col-flex min-w-[200px] max-w-[400px]'>
            <div
                className={cn(
                    'flex gap-3 justify-between items-center px-3 py-2 hover:cursor-move',
                    CONSTANT_DATA.color
                )}
            >
                <div className='flex gap-1 items-center'>
                    {CONSTANT_DATA?.icon}
                    <p className='font-bold'>{CONSTANT_DATA?.title}</p>
                </div>
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
