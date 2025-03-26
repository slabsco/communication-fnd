import { useCallback, useMemo } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { FlowBuilderCustomEdge } from './components/flowbuilder.custom.edge';
import { FlowBuilderCardConstants } from './constants/flowbuilder.constant';
import { useFlowBuilder } from './flowbuilder.context';

const FlowBuilderMain = () => {
    const {
        nodes,
        onEdgesChange,
        edges,
        setEdges,
        onNodesChange,
        updateEdgeData,
    } = useFlowBuilder();

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) => addEdge({ ...params, type: 'custom_edge' }, eds)),
        [setEdges]
    );

    const edgeTypes: any = useMemo(
        () => ({
            custom_edge: FlowBuilderCustomEdge,
        }),
        []
    );

    const nodeTypes = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(FlowBuilderCardConstants).map(([key, value]) => [
                    value.identifier,
                    value.nodeComponent,
                ])
            ),
        []
    );

    return (
        <div className='overflow-hidden flex-1 w-full h-full bg-white rounded border'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineStyle={{
                    strokeWidth: 3,
                    stroke: 'blue',
                }}
                onEdgeMouseEnter={(_, edge) => {
                    updateEdgeData(edge.id, { isHovered: true });
                }}
                onEdgeMouseLeave={(_, edge) => {
                    updateEdgeData(edge.id, { isHovered: false });
                }}
                fitView
            >
                <Controls />
                <MiniMap zoomable pannable nodeColor='#3498db' />
                <Background variant={BackgroundVariant.Cross} />
            </ReactFlow>
        </div>
    );
};

export default FlowBuilderMain;
