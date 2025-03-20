import { Trash2 } from 'lucide-react'; // For the trash icon
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
} from 'reactflow';

import { DropdownMenu, IconButton } from '@finnoto/design-system';

import DropdownActionButton from '../../../Components/DropdownButton/dropdown.action.button';

import { DeleteSvgIcon } from 'assets';

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
        <>
            {/* Custom Edge Path */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: '#A0A0A0',
                    strokeWidth: 2,
                    strokeDasharray: '4 4',
                }}
            />

            {/* Delete Button as Edge Label */}
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: '#fff',
                        color: '#E53935',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        border: '1px solid #E53935',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        pointerEvents: 'all', // Ensures it's clickable
                    }}
                    onClick={handleDelete}
                >
                    <Trash2 size={16} />
                    Delete
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
