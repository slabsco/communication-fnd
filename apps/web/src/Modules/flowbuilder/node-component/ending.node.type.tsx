import { cn } from '@finnoto/design-system';

import { FlowBuilderCommonTargetHandler } from '../components/flowbuilder.common.target.handler';
import { useFlowBuilderApi } from '../flowbuilder.api.context';

export const EndingNodeType = ({ type }: any) => {
    const { availableNodes } = useFlowBuilderApi();
    const CONSTANT_DATA: any = availableNodes[type];

    return (
        <div className='text-white bg-white rounded-xl shadow-xl col-flex min-w-[200px] max-w-[400px] relative'>
            <div
                className={cn(
                    'flex gap-3 rounded-t-lg justify-between items-center px-3 py-2 hover:cursor-move',
                    CONSTANT_DATA?.style?.color
                )}
            >
                <div className='flex gap-1 items-center'>
                    {CONSTANT_DATA?.icon}
                    <div className='flex flex-1 gap-3 items-center'>
                        <p className='flex gap-1 items-center font-semibold'>
                            {CONSTANT_DATA?.title}{' '}
                        </p>
                    </div>
                </div>
            </div>
            <div className='relative p-3 text-primary'>
                {CONSTANT_DATA?.description}
                <FlowBuilderCommonTargetHandler className='' />
            </div>
        </div>
    );
};
