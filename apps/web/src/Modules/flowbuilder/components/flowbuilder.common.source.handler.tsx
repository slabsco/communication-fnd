import { Handle, Position } from 'reactflow';

import { useFlowBuilder } from '../flowbuilder.context';

export const FlowBuilderCommonSourceHandler = ({
    className,
    validateFromSourceHandle: fromSource,
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
                const key = fromSource ? 'sourceHandle' : 'source';
                return isValidCondition(connection?.[key], key);
            }}
            className={className}
            {...rest}
        />
    );
};
