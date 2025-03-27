import { Handle, Position } from 'reactflow';

import { useFlowBuilder } from '../flowbuilder.context';

export const FlowBuilderCommonSourceHandler = ({
    className,
    validateFromSourceHandle,
    ...rest
}: {
    className: string;
    validateFromSourceHandle?: boolean;
    [key: string]: any; // Allow any additional properties without showing type errors
}) => {
    const { isValidCondition } = useFlowBuilder();

    return (
        <Handle
            type='source'
            position={Position.Right}
            isValidConnection={(connection) => {
                if (validateFromSourceHandle) {
                    return isValidCondition(
                        connection?.sourceHandle,
                        'sourceHandle'
                    );
                }
                return isValidCondition(connection?.source, 'source');
            }}
            className={className}
            {...rest}
        />
    );
};
