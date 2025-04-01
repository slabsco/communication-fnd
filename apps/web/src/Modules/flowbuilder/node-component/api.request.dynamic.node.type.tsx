import { openDynamicDataModal } from '../components/dynamic.list.question.modal';
import { CommonNodeComponentContainer } from '../components/flowbuilder.common';
import { FlowBuilderCommonSourceHandler } from '../components/flowbuilder.common.source.handler';
import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { useFlowBuilder } from '../flowbuilder.context';

export const ApiRequestDynamicNodeType = ({ data, id, type }: any) => {
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
                        openDynamicDataModal({
                            data: data,
                            node_type: type,
                            onlyApiConfig: true,
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

            <FlowBuilderCommonSourceHandler
                className='w-3 h-3 bg-green-500 border-2 border-white'
                style={{
                    right: 1,
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
            />
            <FlowBuilderCommonTargetHandler />
        </CommonNodeComponentContainer>
    );
};
