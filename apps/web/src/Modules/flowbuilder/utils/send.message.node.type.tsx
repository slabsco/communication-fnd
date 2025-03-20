import { ReactNode } from 'react';
import { Handle, Position } from 'reactflow';

import { IsFunction } from '@finnoto/core';
import { Button, cn, DropdownMenu, IconButton } from '@finnoto/design-system';

import { MoreIcon } from 'assets';

export const SendMessageNode = ({ data, id }: any) => {
    return (
        <CommonNodeComponentContainer
            title='Send a Message'
            data={data}
            id={id}
        >
            <div className='grid grid-cols-2 gap-2 p-4'>
                <button className='px-3 py-1 text-green-600 bg-white rounded-md border border-green-600'>
                    Message
                </button>
                <button className='px-3 py-1 text-green-600 bg-white rounded-md border border-green-600'>
                    Image
                </button>
                <button className='px-3 py-1 text-green-600 bg-white rounded-md border border-green-600'>
                    Video
                </button>
                <button className='px-3 py-1 text-green-600 bg-white rounded-md border border-green-600'>
                    Audio
                </button>
                <button className='px-3 py-1 text-green-600 bg-white rounded-md border border-green-600'>
                    Document
                </button>
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
}: {
    data: any;
    id: string | number;
    children: ReactNode;
    appearance?: keyof typeof appearanceConstant;
    title: string;
    onManage?: () => void;
}) => {
    return (
        <div className='overflow-hidden text-white bg-white rounded-xl shadow-md hover:cursor-move max-w-60'>
            <div
                className={cn(
                    'flex gap-3 justify-between items-center px-3 py-2',
                    appearanceConstant[appearance].bg_color
                )}
            >
                <p className='font-bold'>{title}</p>
                <DropdownMenu
                    actions={[
                        {
                            name: 'Delete',
                            action: () => {
                                data?.onDelete?.(id);
                            },
                            isCancel: true,
                            visible: IsFunction(data?.onDelete),
                        },
                        {
                            name: 'Copy',
                            action: () => {
                                data?.onCopy?.(id);
                            },
                            visible: IsFunction(data?.onCopy),
                        },
                    ]}
                    className='gap-2 mt-2'
                    hideOnNoAction
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

            <div className='overflow-hidden p-2 bg-slate-600/10'>
                <Button wide outline size='xs' onClick={onManage}>
                    Manage
                </Button>
            </div>
        </div>
    );
};
