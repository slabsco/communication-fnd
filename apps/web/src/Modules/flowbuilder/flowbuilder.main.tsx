import { useCallback, useMemo } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
} from 'reactflow';

import * as NODE_COMPONENT from './node-component/index';

import 'reactflow/dist/style.css';

import { FlowBuilderCustomEdge } from './components/flowbuilder.custom.edge';
import { useFlowBuilderApi } from './flowbuilder.api.context';
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

    const { availableNodes } = useFlowBuilderApi();

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
                Object.entries(availableNodes).map(([key, value]: any) => [
                    key,
                    NODE_COMPONENT[key],
                ])
            ),
        [availableNodes]
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
