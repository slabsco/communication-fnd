import { useCallback } from 'react';
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

const edgeTypes: any = { custom_edge: FlowBuilderCustomEdge };

const nodeTypes = Object.fromEntries(
    Object.entries(FlowBuilderCardConstants).map(([key, value]) => [
        value.identifier,
        value.nodeComponent,
    ])
);

const FlowBuilderMain = () => {
    const { nodes, onEdgesChange, edges, setEdges, onNodesChange } =
        useFlowBuilder();

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) => addEdge({ ...params, type: 'custom_edge' }, eds)),
        [setEdges]
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
                edgeTypes={edgeTypes} // Add Custom Edge Here
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Cross} />
            </ReactFlow>
        </div>
    );
};

export default FlowBuilderMain;
