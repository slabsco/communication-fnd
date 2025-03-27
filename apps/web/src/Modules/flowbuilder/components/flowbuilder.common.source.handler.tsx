import { Handle, Position } from 'reactflow';

import { useFlowBuilder } from '../flowbuilder.context';

export const FlowBuilderCommonSourceHandler = ({
    className,
    ...rest
}: {
    className: string;
}) => {
    const { isValidCondition } = useFlowBuilder();
    return (
        <Handle
            type='source'
            position={Position.Right}
            isValidConnection={(connection) => {
                return isValidCondition(connection?.source, 'source');
            }}
            className={className}
            {...rest}
        />
    );
};
