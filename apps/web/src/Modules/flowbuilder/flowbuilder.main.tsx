import { useCallback } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    NodeTypes,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { useFlowBuilder } from './flowbuilder.context';
import { AskQuestionNodeType } from './utils/ask.question.node.type';
import { SendMessageNode } from './utils/send.message.node.type';

const nodeTypes = {
    send_message: SendMessageNode,
    ask_question: AskQuestionNodeType,
};
export type NodeTypesInternal = keyof typeof nodeTypes;

const FlowBuilderMain = () => {
    const { nodes, onEdgesChange, edges, setEdges, onNodesChange } =
        useFlowBuilder();

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className='w-full h-full'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
                <Controls />
                <MiniMap />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={12}
                    size={1}
                />
            </ReactFlow>
        </div>
    );
};

export default FlowBuilderMain;
