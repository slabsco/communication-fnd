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
import { useFlowBuilder } from './flowbuilder.context';
import {
    AskQuestionButtonNodeType,
    AskQuestionListNodeType,
    AskQuestionNodeType,
} from './utils/ask.question.node.type';
import { SendMessageNode } from './utils/send.message.node.type';
import SetConditionNodeType from './utils/set.condition.node.type';

const nodeTypes = {
    send_message: SendMessageNode,
    ask_question: AskQuestionNodeType,
    ask_question_button: AskQuestionButtonNodeType,
    ask_question_list: AskQuestionListNodeType,
    set_condition: SetConditionNodeType,
};

const edgeTypes: any = { custom_edge: FlowBuilderCustomEdge };

export type NodeTypesInternal = keyof typeof nodeTypes;

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
