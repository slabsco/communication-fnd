import { useState } from 'react';
import { useList } from 'react-use';

import { FetchData, IsEmptyObject, useQuery } from '@finnoto/core';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import {
    BasicFilterButton,
    Button,
    GroupedOption,
    InputField,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    SelectBox,
    Switch,
} from '@finnoto/design-system';
import { Label } from '@finnoto/design-system/src/Components/Inputs/InputField/label.component';

import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { FlowBuilderCommonSourceHandler } from '../components/flowbuilder.common.source.handler';
import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { useFlowBuilder } from '../flowbuilder.context';

export const SetConditionNodeType = ({ data, id, type }: any) => {
    const { updateNodeData, chatVariables, isValidCondition } =
        useFlowBuilder();

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
                            chatVariables: chatVariables,
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
            <FlowBuilderCommonTargetHandler />
            <FlowBuilderCommonSourceHandler className='bottom-1/3 w-3 h-3 border-2 border-white bg-success' />
            <FlowBuilderCommonSourceHandler className='top-1/3 w-3 h-3 border-2 border-white bg-error' />
        </CommonNodeComponentContainer>
    );
};

const openConditionModal = ({
    onConditionUpdate,
    initialCondition,
    chatVariables,
}: any) => {
    return Modal.open({
        component: ConditionModal,
        modalSize: 'xs',
        props: {
            chatVariables,
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
    is_second_variable: boolean;
};

const ConditionModal = ({
    onConditionUpdate,
    initialData,
    chatVariables,
}: {
    onConditionUpdate: (data: any) => void;
    initialData: any;
    chatVariables: any;
}) => {
    const defaultData = initialData?.condition;
    const [condition, { removeAt, updateAt, push }] = useList<conditionType>(
        defaultData || [
            {
                first_value: '',
                operator: 'not_equal',
                second_value: '',
                is_second_variable: false,
            },
        ]
    );

    const [andOr, setAndOr] = useState(initialData?.operator || 'AND');

    const handleAddCondition = () => {
        push({
            first_value: '',
            operator: 'not_equal',
            second_value: '',
            is_second_variable: false,
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
                        chatVariables={chatVariables}
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
                                chatVariables={chatVariables}
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
    chatVariables,
}: {
    updatedCondition: (condition: any) => void;
    condition: conditionType;
    chatVariables: any;
}) => {
    const { data, isLoading } = useQuery({
        queryKey: ['business_custom_attributes'],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: ContactController,
                method: 'findContactAttributes',
            });
            if (success) return response;
            return [];
        },
    });

    const groupedSelectBoxOptions: GroupedOption[] = [
        {
            label: 'Contact Attributes',
            options: data?.map((_var) => {
                return {
                    value: _var.key,
                    label: _var.key,
                    subLabel: _var?.value,
                };
            }),
        },
        {
            label: 'Chat Variables',
            options: chatVariables?.map((_var) => ({
                value: _var.variableName,
                label: _var.variableName,
                subLabel: _var?.node?.type,
            })),
        },
    ];
    return (
        <div className='flex gap-3 items-center p-3 col-flex bg-base-200'>
            <SelectBox
                isLoading={isLoading}
                prefix={
                    <div className='px-3 py-1.5 rounded bg-primary text-primary-content -ml-1'>
                        IF
                    </div>
                }
                placeholder='Select Variable or type'
                width={300}
                value={condition?.first_value}
                onChange={(data) =>
                    updatedCondition({
                        ...condition,
                        first_value: data?.value,
                    })
                }
                options={groupedSelectBoxOptions}
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

            <div className='p-2 w-full bg-base-100 col-flex'>
                <div className='flex gap-2 items-center'>
                    <Label label='Variable' />
                    <Switch
                        checked={condition?.is_second_variable}
                        onChange={(va) => {
                            updatedCondition({
                                ...condition,
                                is_second_variable: va,
                                second_value: undefined,
                            });
                        }}
                    />
                </div>
                {condition?.is_second_variable ? (
                    <SelectBox
                        isLoading={isLoading}
                        placeholder='Select Variable or type'
                        width={270}
                        value={condition?.second_value}
                        isAsyncCreatable
                        onChange={(data) =>
                            updatedCondition({
                                ...condition,
                                second_value: data?.value,
                            })
                        }
                        options={groupedSelectBoxOptions}
                    />
                ) : (
                    <InputField
                        width={100}
                        placeholder={'Enter the value'}
                        value={condition?.second_value}
                        onBlur={(val) => {
                            updatedCondition({
                                ...condition,
                                second_value: val,
                            });
                        }}
                    />
                )}
            </div>
        </div>
    );
};
