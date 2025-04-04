import { Handle, Position } from 'reactflow';

import { cn } from '@finnoto/design-system';

export const FlowBuilderCommonTargetHandler = ({
    className,
    ...rest
}: {
    className?: string;
}) => {
    return (
        <Handle
            isConnectable
            isConnectableStart
            type='target'
            position={Position.Left}
            className={cn('bg-transparent', className)}
            {...rest}
        />
    );
};
