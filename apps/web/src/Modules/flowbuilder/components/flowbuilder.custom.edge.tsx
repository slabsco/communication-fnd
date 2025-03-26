import { Trash2 } from 'lucide-react'; // For the trash icon
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
} from 'reactflow';

import { cn } from '@finnoto/design-system';

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

    const isHovered = data?.isHovered;

    const isTrueCondition = id?.includes('condition-true');
    const isFalseCondition = id?.includes('condition-false');

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
                    stroke: isTrueCondition
                        ? 'green'
                        : isFalseCondition
                        ? 'red'
                        : '#A0A0A0', // Changed to blue color
                    strokeWidth: 2,
                    strokeDasharray: '4 4',
                }}
            />

            {/* Delete Button as Edge Label */}
            <EdgeLabelRenderer>
                <div
                    className={cn(
                        'opacity-0 bg-base-100 transition-all hover:bg-error hover:!text-error-content  text-error p-[6px_12px] rounded-[12px] border border-error shadow-[0_2px_5px_rgba(0,0,0,0.15)] text-[12px] flex items-center gap-[4px] cursor-pointer pointer-events-auto',
                        {
                            'opacity-100': isHovered,
                        }
                    )}
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
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
