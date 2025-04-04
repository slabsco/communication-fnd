import { Handle, Position } from 'reactflow';

import { InputField } from '@finnoto/design-system';

import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { FlowBuilderCommonSourceHandler } from '../components/flowbuilder.common.source.handler';
import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { useFlowBuilder } from '../flowbuilder.context';

export const AddTimeDelayNodeType = ({ data, id, type }: any) => {
    const { updateNodeData, isValidCondition } = useFlowBuilder();

    return (
        <CommonNodeComponentContainer data={data} id={id} type={type}>
            <div className='gap-2 p-4 text-primary col-flex'>
                <div className='text-base-secondary'>
                    Set a delay from 0 to 10,000 Seconds
                </div>
                <InputField
                    defaultValue={20}
                    onChange={(val) => {
                        updateNodeData(id, { second: val });
                    }}
                    max={99999}
                    maxLength={5}
                    value={data?.second}
                    type='number'
                    suffix={`second's`}
                    placeholder={'Enter the seconds here'}
                />
            </div>

            <FlowBuilderCommonTargetHandler />
            <FlowBuilderCommonSourceHandler className='w-3 h-3 bg-blue-400 border-2 border-white' />
        </CommonNodeComponentContainer>
    );
};
