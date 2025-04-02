import { useState } from 'react';
import { useList } from 'react-use';

import { IsEmptyArray } from '@finnoto/core';
import { KeywordMatchingTypeEnum } from '@finnoto/core/src/backend/communication/dto/create.keyword.detail.dto';
import {
    Button,
    cn,
    DropdownMenu,
    IconButton,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    RadioGroup,
    Range,
    SelectBox,
} from '@finnoto/design-system';

import { openAddKeyword } from '../../keyword-action/components/add.keyword.module';
import { FlowBuilderCommonSourceHandler } from '../components/flowbuilder.common.source.handler';
import { useFlowBuilderApi } from '../flowbuilder.api.context';
import { useFlowBuilder } from '../flowbuilder.context';

import { CrossSvgIcon, MoreIcon } from 'assets';

export const StartingNodeType = ({ data, type, id }: any) => {
    const { availableNodes } = useFlowBuilderApi();
    const { updateNodeData } = useFlowBuilder();

    const CONSTANT_DATA: any = availableNodes[type];

    const handleUpdateData = (data: any) => {
        updateNodeData(id, { ...data });
    };

    return (
        <div className='text-white bg-white rounded-xl shadow-xl col-flex min-w-[200px] max-w-[400px] relative'>
            <div
                className={cn(
                    'flex gap-3 rounded-t-lg justify-between items-center px-3 py-2 hover:cursor-move',
                    CONSTANT_DATA?.style?.color
                )}
            >
                <div className='flex gap-1 items-center w-full'>
                    {CONSTANT_DATA?.icon}
                    <div className='flex flex-1 gap-3 items-center'>
                        <p className='flex gap-1 items-center font-semibold'>
                            {CONSTANT_DATA?.title}{' '}
                        </p>
                    </div>
                    <DropdownMenu
                        actions={[
                            {
                                name: 'Add Trigger Point',
                                action: () =>
                                    openAddTriggerPoint({
                                        data,
                                        onSave: (_data) => {
                                            handleUpdateData(_data);
                                        },
                                    }),
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
            </div>
            <div className='relative p-3 text-primary'>
                {CONSTANT_DATA?.description}
                {!IsEmptyArray(data?.keywords) && (
                    <div className='gap-2 mt-2 font-medium col-flex'>
                        Trigger Point is set here
                    </div>
                )}
                <FlowBuilderCommonSourceHandler
                    className={'w-3 h-3 bg-red-400'}
                />
            </div>
        </div>
    );
};

const openAddTriggerPoint = ({
    data,
    onSave,
}: {
    data: any;
    onSave?: (_?: any) => void;
}) => {
    return Modal.open({
        component: TriggerPointModal,
        modalSize: 'md',
        props: {
            data,
            onSave,
        },
    });
};

const TriggerPointModal = ({
    data,
    onSave,
}: {
    data: any;
    onSave?: (_?: any) => void;
}) => {
    const [keywords, { push: setKeyword, removeAt }] = useList<any>(
        data?.keywords || []
    );
    const [rageValue, setRageValue] = useState(
        data?.rageValue || KeywordMatchingTypeEnum.EXACT
    );

    const [triggerTypeId, setTriggerTypeId] = useState(
        data?.triggerTypeId || 'message_received'
    );

    const [fuzzyMatchingRage, setFuzzyMatchingRage] = useState(
        data?.fuzzyMatchingRage || 80
    );

    return (
        <ModalContainer title='Add Trigger point'>
            <ModalBody className='gap-4 col-flex'>
                <SelectBox
                    required
                    disabled
                    label='Trigger On'
                    value={triggerTypeId}
                    onChange={(val) => {
                        setTriggerTypeId(val);
                    }}
                    options={[
                        {
                            label: 'Message Received',
                            value: 'message_received',
                            subLabel: 'When user sends the new message',
                        },
                    ]}
                />

                <div className='flex gap-3 items-center'>
                    <h3 className='text-base font-medium'>Keywords:</h3>
                    <div className='flex gap-2 items-center'>
                        {keywords?.map((word, index) => {
                            return (
                                <div
                                    key={word}
                                    className='flex gap-2 px-1 py-2 text-lg rounded border border-dashed item border-primary bg-base-200'
                                >
                                    {word}
                                    <IconButton
                                        outline
                                        icon={CrossSvgIcon}
                                        appearance='errorHover'
                                        size='xs'
                                        onClick={() => removeAt(index)}
                                    />
                                </div>
                            );
                        })}
                        <Button
                            outline
                            dashed
                            onClick={() => {
                                openAddKeyword({
                                    initialValues: keywords,
                                    onAdd: (value: any) => {
                                        setKeyword(value);
                                    },
                                });
                            }}
                        >
                            + Add Keyword
                        </Button>
                    </div>
                </div>
                <div className='flex gap-3 col-flex'>
                    <span className='text-base font-medium'>
                        Message matching methods:
                    </span>
                    <RadioGroup
                        direction='horizontal'
                        value={rageValue}
                        onChange={(val: any) => {
                            setRageValue(val);
                        }}
                        options={[
                            {
                                label: 'Exact',
                                value: KeywordMatchingTypeEnum.EXACT,
                            },
                            {
                                label: 'Contain',
                                value: KeywordMatchingTypeEnum.CONTAIN,
                            },
                            {
                                label: 'Fuzzy',
                                value: KeywordMatchingTypeEnum.FUZZY,
                            },
                        ]}
                    />
                    {rageValue === KeywordMatchingTypeEnum.FUZZY && (
                        <div className='flex gap-1 items-center w-2/4'>
                            <Range
                                appreance='secondary'
                                size='sm'
                                step={5}
                                value={fuzzyMatchingRage}
                                onChange={(val: any) =>
                                    setFuzzyMatchingRage(val)
                                }
                            />
                            <span className='text-lg'>
                                {fuzzyMatchingRage}%
                            </span>
                        </div>
                    )}
                </div>
            </ModalBody>
            <ModalFooter className='py-4 justify'>
                <div className='flex-1 gap-4 row-flex'>
                    <Button
                        appearance='errorHover'
                        onClick={() => Modal.close()}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance='success'
                        className='flex-1'
                        onClick={() => {
                            onSave({
                                keywords,
                                rageValue,
                                fuzzyMatchingRage,
                                triggerTypeId,
                            });
                            Modal.close();
                        }}
                    >
                        Save
                    </Button>
                </div>
            </ModalFooter>
        </ModalContainer>
    );
};
