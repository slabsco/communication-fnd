import { IsEmptyArray, SortArrayObjectBy } from '@finnoto/core';

import FlowBuilderCard from './components/flowbuilder.card';
import FlowBuilderOperatorsCard from './components/flowbuilder.pannel.operators';
import { useFlowBuilderApi } from './flowbuilder.api.context';
import { useFlowBuilder } from './flowbuilder.context';
import { CreateNewNode } from './utils/flowbuilder.common.utils';

const FlowBuilderPanel = () => {
    const { addMultipleNodes, nodes } = useFlowBuilder();
    const { availableNodes } = useFlowBuilderApi();

    const mainComponent = Object.entries(availableNodes)?.flatMap(
        ([Key, value]: any) => {
            if (value?.type === 'main') return [value];
            return [];
        }
    );
    const operators = Object.entries(availableNodes)?.flatMap(
        ([Key, value]: any) => {
            if (value?.type === 'operators') return [value];
            return [];
        }
    );

    const addNode = (component: any) => {
        const node = CreateNewNode({
            component: component,
        });

        if (nodes?.length) return addMultipleNodes([node]);
        addMultipleNodes([{ ...node, isStartingStep: true } as any]);
    };

    return (
        <div className='p-2 w-2/12 h-full bg-white rounded col-flex'>
            <div className='gap-3 col-flex'>
                {mainComponent?.map((val) => {
                    return (
                        <FlowBuilderCard
                            color={val?.style.color}
                            title={val?.title}
                            icon={val?.icon}
                            description={val?.description}
                            key={val.identifier}
                            onClick={() => {
                                addNode(val?.identifier);
                            }}
                        />
                    );
                })}
            </div>
            {!IsEmptyArray(operators) && (
                <div className='mt-4'>
                    <h3 className='text-lg font-medium'>Operators</h3>
                    <div className='grid grid-cols-2 gap-2 items-center mt-2'>
                        {SortArrayObjectBy(operators, 'title', 'asc')?.map(
                            (val) => {
                                return (
                                    <FlowBuilderOperatorsCard
                                        icon={val?.icon}
                                        key={val?.identifier}
                                        onClick={() => addNode(val?.identifier)}
                                        color={val?.style.color}
                                        title={val?.title}
                                    />
                                );
                            }
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlowBuilderPanel;
