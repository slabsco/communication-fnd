import { openDynamicDataModal } from '../components/dynamic.list.question.modal';
import { openDynamicSetConditionModal } from '../components/dynamic.set.condition.modal';
import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { FlowBuilderCommonSourceHandler } from '../components/flowbuilder.common.source.handler';
import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { useFlowBuilder } from '../flowbuilder.context';

export const SetConditionDynamicNodeType = ({ data, id, type }: any) => {
    const { updateNodeData } = useFlowBuilder();

    return (
        <CommonNodeComponentContainer
            data={data}
            id={id}
            type={type}
            actions={[
                {
                    name: 'Manage',
                    action: () => {
                        openDynamicSetConditionModal({
                            data: data,
                            getData: (data) => {
                                updateNodeData(id, data);
                            },
                        });
                    },
                },
            ]}
        >
            <div className='p-2 font-medium text-primary min-h-12 min-w-[300px]'>
                {data?.apiConfigScript && 'Some script are executed here'}
            </div>

            <FlowBuilderCommonTargetHandler />
            <FlowBuilderCommonSourceHandler
                validateFromSourceHandle
                id={'condition-true'}
                className='bottom-1/3 w-3 h-3 border-2 border-white bg-success'
            />
            <FlowBuilderCommonSourceHandler
                validateFromSourceHandle
                id='condition-false'
                className='top-1/3 w-3 h-3 border-2 border-white bg-error'
            />
        </CommonNodeComponentContainer>
    );
};
