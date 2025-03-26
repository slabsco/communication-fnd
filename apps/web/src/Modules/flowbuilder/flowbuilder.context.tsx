import { createContext, useContext } from 'react';

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
    updateNodeData: (nodeId: string, newData: any) => void; // Added updateNodeData method
    deleteNode: (nodeId: string) => void; // New method to delete a node
    getNodeData: (nodeId: string) => FlowNode | undefined; // New method to get node data
    addEdge: (edge: FlowEdge) => void;
    updateEdge: (edge: FlowEdge) => void;
    updateEdgeData: (edgeId: string, newData: any) => void; // New method to update edge data
    addMultipleNodes: (newNodes: FlowNode[]) => void; // New method to add multiple nodes
    addMultipleEdges: (newEdges: FlowEdge[]) => void; // New method to add multiple edges
    getAllData: () => { nodes: FlowNode[]; edges: FlowEdge[] }; // New method to get all node and edge data
    setStartingStep: (nodeId: string) => void; // New method to set a starting step
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
    updateNodeData: () => {}, // Default implementation
    deleteNode: () => {}, // Default implementation
    getNodeData: () => undefined, // Default implementation
    addEdge: () => {},
    updateEdge: () => {},
    updateEdgeData: () => {}, // Default implementation
    addMultipleNodes: () => {}, // Default implementation
    addMultipleEdges: () => {}, // Default implementation
    getAllData: () => ({ nodes: [], edges: [] }), // Default implementation
    setStartingStep: () => {}, // Default implementation
});

export const FlowBuilderProvider = ({ children, rawJsonData }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(
        rawJsonData?.nodes || []
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge[]>(
        rawJsonData?.edges || []
    );

    const addNode = (node: FlowNode) => {
        setNodes((prevNodes) => [...prevNodes, node]);
    };

    const updateNode = (node: FlowNode) => {
        setNodes((prevNodes) =>
            prevNodes.map((n) => (n.id === node.id ? node : n))
        );
    };

    const updateNodeData = (nodeId: string, newData: any) => {
        // Implemented updateNodeData
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...newData } }
                    : node
            )
        );
    };

    const deleteNode = (nodeId: string) => {
        setNodes((prevNodes) => prevNodes.filter((n) => n.id !== nodeId));
    };

    const getNodeData = (nodeId: string) => {
        return nodes.find((node) => node.id === nodeId);
    };

    const addEdge = (edge: FlowEdge) => {
        setEdges((prevEdges) => [...prevEdges, edge]);
    };

    const updateEdge = (edge: FlowEdge) => {
        setEdges((prevEdges) =>
            prevEdges.map((e) => (e.id === edge.id ? edge : e))
        );
    };

    const updateEdgeData = (edgeId: string, newData: any) => {
        setEdges((edges) =>
            edges.map((edge) =>
                edge.id === edgeId
                    ? { ...edge, data: { ...edge.data, ...newData } }
                    : edge
            )
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

    const getAllData = () => {
        return { nodes, edges }; // Return current nodes and edges
    };

    const setStartingStep = (nodeId: string) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => ({
                ...node,
                isStartingStep: node.id === nodeId, // Only one node can be the starting step
            }))
        );
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
        updateNodeData, // Added to values
        deleteNode,
        getNodeData, // Added to values
        addEdge,
        updateEdge,
        updateEdgeData, // Added to values
        addMultipleNodes,
        addMultipleEdges,
        getAllData, // Added to values
        setStartingStep, // Added to values
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
