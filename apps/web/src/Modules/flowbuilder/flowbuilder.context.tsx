import { createContext, useCallback, useContext } from 'react';

import {
    useEdgesState,
    useNodesState,
    type Edge as FlowEdge,
    type Node as FlowNode,
    type OnEdgesChange,
    type OnNodesChange,
} from '@reactflow/core';

interface FlowBuilderContextType {
    nodes: FlowNode[];
    setNodes: any;
    setEdges: any;
    edges: FlowEdge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    addNode: (node: FlowNode) => void;
    updateNode: (node: FlowNode) => void;
    deleteNode: (nodeId: string) => void; // New method to delete a node
    addEdge: (edge: FlowEdge) => void;
    updateEdge: (edge: FlowEdge) => void;
    addMultipleNodes: (newNodes: FlowNode[]) => void; // New method to add multiple nodes
    addMultipleEdges: (newEdges: FlowEdge[]) => void; // New method to add multiple edges
}

const FlowBuilderContext = createContext<FlowBuilderContextType>({
    nodes: [],
    setNodes: () => {},
    edges: [],
    setEdges: () => {},
    onNodesChange: () => {},
    onEdgesChange: () => {},
    addNode: () => {},
    updateNode: () => {},
    deleteNode: () => {}, // Default implementation
    addEdge: () => {},
    updateEdge: () => {},
    addMultipleNodes: () => {}, // Default implementation
    addMultipleEdges: () => {}, // Default implementation
});

export const FlowBuilderProvider = ({ children }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

    const addNode = (node: FlowNode) => {
        setNodes((prevNodes) => [...prevNodes, node]);
    };

    const updateNode = (node: FlowNode) => {
        setNodes((prevNodes) =>
            prevNodes.map((n) => (n.id === node.id ? node : n))
        );
    };

    const deleteNode = (nodeId: string) => {
        setNodes((prevNodes) => prevNodes.filter((n) => n.id !== nodeId));
    };

    const addEdge = (edge: FlowEdge) => {
        setEdges((prevEdges) => [...prevEdges, edge]);
    };

    const updateEdge = (edge: FlowEdge) => {
        setEdges((prevEdges) =>
            prevEdges.map((e) => (e.id === edge.id ? edge : e))
        );
    };

    const addMultipleNodes = (newNodes: FlowNode[]) => {
        setNodes((prevNodes) => {
            return [...prevNodes, ...newNodes];
        });
    };

    const addMultipleEdges = (newEdges: FlowEdge[]) => {
        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    };

    const values = {
        nodes,
        setNodes,
        edges,
        setEdges,
        onNodesChange,
        onEdgesChange,
        addNode,
        updateNode,
        deleteNode,
        addEdge,
        updateEdge,
        addMultipleNodes,
        addMultipleEdges,
    };

    return (
        <FlowBuilderContext.Provider value={values}>
            {children}
        </FlowBuilderContext.Provider>
    );
};

export const useFlowBuilder = () => {
    return useContext(FlowBuilderContext);
};
