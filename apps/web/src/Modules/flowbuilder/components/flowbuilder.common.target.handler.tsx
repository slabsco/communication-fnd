import { Handle, Position } from 'reactflow';

import { useFlowBuilder } from '../flowbuilder.context';

export const FlowBuilderCommonTargetHandler = ({
    className,
    ...rest
}: {
    className: string;
}) => {
    const { isValidCondition } = useFlowBuilder();
    return (
        <Handle
            isConnectable
            isConnectableStart
            type='target'
            position={Position.Left}
            className='bg-transparent'
            isValidConnection={(connection) => {
                return isValidCondition(connection.source, 'source');
            }}
            {...rest}
        />
    );
};
