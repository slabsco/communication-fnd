import { Trash2 } from 'lucide-react'; // For the trash icon
import React from 'react';
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
} from 'reactflow';

import { DropdownMenu, IconButton } from '@finnoto/design-system';

import DropdownActionButton from '../../../Components/DropdownButton/dropdown.action.button';

import { ArrowUpSvgIcon } from 'assets';

export const FlowBuilderCustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    markerEnd,
}) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const { setEdges } = useReactFlow(); // React Flow's hook for state management

    // Handle delete functionality
    const handleDelete = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <DropdownMenu actions={[{ name: 'Delete', action: () => {} }]}>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: '#A0A0A0',
                    strokeWidth: 2,
                    strokeDasharray: '4 4',
                }}
            />
        </DropdownMenu>
    );
};
