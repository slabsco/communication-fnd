import { useState } from 'react';
import { useList } from 'react-use';
import { Handle, Position } from 'reactflow';

import { IsEmptyObject } from '@finnoto/core';
import { BusinessUserController } from '@finnoto/core/src/backend/common/controllers/business.user.controller';
import {
    BasicFilterButton,
    Button,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    ReferenceSelectBox,
    SelectBox,
} from '@finnoto/design-system';

import {
    CommonNodeComponentContainer,
    CommonNodePropsTypes,
} from '../components/flowbuilder.common';
import { useFlowBuilder } from '../flowbuilder.context';

const SetConditionNodeType = ({ data, id, type }: CommonNodePropsTypes) => {
    const { updateNodeData } = useFlowBuilder();

    return (
        <CommonNodeComponentContainer
            data={data}
            id={id}
            type={type}
            actions={[
                {
                    name: 'Manage Condition',
                    action: () => {
                        openConditionModal({
                            onConditionUpdate: (data) => {
                                updateNodeData(id, data);
                            },
                            initialCondition: data?.data,
                        });
                    },
                },
            ]}
        >
            <div className='p-4 text-primary'>
                {IsEmptyObject(data) && 'No Condition Applied!!'}
                {!IsEmptyObject(data) && (
                    <h2 className='font-medium'>
                        Some condition has been applied here!!
                    </h2>
                )}
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
                id='condition-true'
                position={Position.Right}
                className='bottom-1/3 w-3 h-3 border-2 border-white bg-success' // Handle for true condition
            />
            <Handle
                type='source'
                id='condition-false'
                position={Position.Right}
                className='top-1/3 w-3 h-3 border-2 border-white bg-error' // Handle for false condition
            />
        </CommonNodeComponentContainer>
    );
};

export default SetConditionNodeType;

const openConditionModal = ({ onConditionUpdate, initialCondition }: any) => {
    return Modal.open({
        component: ConditionModal,
        modalSize: 'xs',
        props: {
            initialData: initialCondition,
            onConditionUpdate: (data) => {
                onConditionUpdate?.(data);
                Modal.close();
            },
        },
    });
};

type conditionType = {
    first_value: string;
    operator: string;
    second_value: string;
};

const ConditionModal = ({
    onConditionUpdate,
    initialData,
}: {
    onConditionUpdate: (data: any) => void;
    initialData;
}) => {
    const defaultData = initialData?.condition;
    const [condition, { removeAt, updateAt, push }] = useList<conditionType>(
        defaultData || [
            {
                first_value: '',
                operator: 'not_equal',
                second_value: '',
            },
        ]
    );

    const [andOr, setAndOr] = useState(initialData?.operator || 'AND');

    const handleAddCondition = () => {
        push({
            first_value: '',
            operator: 'not_equal',
            second_value: '',
        });
    };

    const isMultiple = condition?.length > 1;

    const handleRemoveCondition = (index: number) => {
        removeAt(index);
        setAndOr(null);
    };

    return (
        <ModalContainer title='Set Condition'>
            <ModalBody>
                <div className='gap-3 col-flex'>
                    <MainConditionComponent
                        updatedCondition={(updatedCond) => {
                            updateAt(0, updatedCond);
                        }}
                        condition={condition?.[0]}
                    />
                    {!isMultiple && (
                        <Button dashed outline onClick={handleAddCondition}>
                            + Add
                        </Button>
                    )}
                    {isMultiple && (
                        <div className='justify-center items-center col-flex'>
                            <BasicFilterButton
                                appearance='success'
                                active={andOr}
                                onFilterChange={(con) => {
                                    setAndOr(con as string);
                                }}
                                containerClass='mb-3'
                                disableNav
                                filters={[
                                    { key: 'AND', label: 'AND' },
                                    { key: 'OR', label: 'OR' },
                                ]}
                            />
                            <MainConditionComponent
                                updatedCondition={(updatedCond) => {
                                    updateAt(1, updatedCond);
                                }}
                                condition={condition[1]}
                            />
                        </div>
                    )}

                    {isMultiple && (
                        <Button
                            dashed
                            outline
                            appearance='error'
                            onClick={() => handleRemoveCondition(1)}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    defaultMinWidth
                    onClick={() => {
                        onConditionUpdate({
                            data: {
                                condition,
                                operator: andOr,
                            },
                        });
                    }}
                >
                    Save
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};

const MainConditionComponent = ({
    updatedCondition,
    condition,
}: {
    updatedCondition: (condition: any) => void;
    condition: conditionType;
}) => {
    return (
        <div className='flex gap-3 items-center p-3 col-flex bg-base-200'>
            <ReferenceSelectBox
                prefix={
                    <div className='px-3 py-1.5 rounded bg-primary text-primary-content -ml-1'>
                        IF
                    </div>
                }
                required
                width={300}
                controller={BusinessUserController}
                isAsyncCreatable
                placeholder='Select Variable or type'
                value={condition?.first_value}
                onChange={(data) =>
                    updatedCondition({
                        ...condition,
                        first_value: data?.value,
                    })
                }
                isClearable
                labelKey='name'
                sublabelKey={'email'}
            />
            <SelectBox
                width={200}
                value={condition?.operator}
                onChange={(option) =>
                    updatedCondition({
                        ...condition,
                        operator: option.value,
                    })
                }
                options={[
                    { label: 'Equal to', value: 'equal' },
                    { label: 'Not Equals to', value: 'not_equal' },
                    { label: 'Contains', value: 'contains' },
                    {
                        label: 'Does not contain',
                        value: 'does_not_contain',
                    },
                    { label: 'Starts with', value: 'starts_with' },
                    {
                        label: 'Does not start with',
                        value: 'does_not_start_with',
                    },
                ]}
            />
            <ReferenceSelectBox
                required
                width={300}
                controller={BusinessUserController}
                isAsyncCreatable
                placeholder='Select Variable or type'
                value={condition?.second_value}
                onChange={(data) =>
                    updatedCondition({
                        ...condition,
                        second_value: data?.value,
                    })
                }
                isClearable
                labelKey='name'
                sublabelKey={'email'}
            />
        </div>
    );
};
