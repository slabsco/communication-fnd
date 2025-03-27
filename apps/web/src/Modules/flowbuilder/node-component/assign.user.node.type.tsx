import { UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

import { IsUndefinedOrNull } from '@finnoto/core';
import { BusinessUserController } from '@finnoto/core/src/backend/common/controllers/business.user.controller';
import {
    Button,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    ReferenceSelectBox,
} from '@finnoto/design-system';

import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { useFlowBuilder } from '../flowbuilder.context';

export const AssignUserNodeType = ({ data, id, type }: any) => {
    const { updateNodeData, isValidCondition } = useFlowBuilder();

    return (
        <CommonNodeComponentContainer
            data={data}
            id={id}
            type={type}
            actions={[
                {
                    name: 'Select User',
                    action: () => {
                        openSelectUser({
                            onSave: (data) => {
                                updateNodeData(id, {
                                    name: data?.data?.name,
                                    id: data?.data?.id,
                                });
                            },
                            initialData: data,
                        });
                    },
                },
            ]}
        >
            {data?.name && (
                <div className='relative gap-2 px-4 m-2 rounded text-primary bg-base-200'>
                    <div className='gap-2 items-center px-1 py-2 rounded col-flex'>
                        <UserIcon />
                        <p>{data?.name}</p>
                    </div>
                </div>
            )}

            <Handle
                isConnectable
                isConnectableStart
                type='target'
                position={Position.Left}
                className='bg-transparent'
                isValidConnection={(connection) => {
                    return isValidCondition(connection.source, 'source');
                }}
            />
            <Handle
                type='source'
                position={Position.Right}
                className='w-3 h-3 bg-blue-400 border-2 border-white'
            />
        </CommonNodeComponentContainer>
    );
};

const openSelectUser = ({
    onSave,
    initialData,
}: {
    onSave: (_?: any) => void;
    initialData: any;
}) => {
    Modal.open({
        modalSize: 'xs',
        component: OpenSelectUserModal,
        props: {
            initialData,
            onSave: (data) => {
                onSave(data);
            },
        },
    });
};

export const OpenSelectUserModal = ({
    onSave,
    initialData,
}: {
    onSave: (buId: number) => {};
    initialData: any;
}) => {
    const [selectedUser, setSelectedUser] = useState<any>({
        value: initialData?.id,
    });

    return (
        <ModalContainer title='Select User'>
            <ModalBody>
                <ReferenceSelectBox
                    required
                    width={300}
                    value={selectedUser?.value}
                    controller={BusinessUserController}
                    label='Select User'
                    placeholder='Select User'
                    onChange={(data) => {
                        setSelectedUser(data);
                    }}
                    isClearable
                    labelKey='name'
                    sublabelKey={'email'}
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    disabled={IsUndefinedOrNull(selectedUser?.value)}
                    onClick={() => {
                        onSave(selectedUser);
                        Modal.close();
                    }}
                >
                    Save
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};
