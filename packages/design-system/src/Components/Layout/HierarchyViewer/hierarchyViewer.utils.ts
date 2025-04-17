import { useEffect, useState } from 'react';
import { useNodesInitialized, useReactFlow } from 'reactflow';

import {
    AccessNestedObject,
    IsEmptyArray,
    IsUndefinedOrNull,
    ObjectDto,
} from '@finnoto/core';

import Dagre from '@dagrejs/dagre';
import { Edge, Node, Position, ReactFlowInstance } from '@reactflow/core';

import { BuildHierachyOptions, HierachyReturn } from './hierarchyViewer.types';

/**
 * Builds a hierarchy tree from an array of items.
 *
 * @template TItemObject - The type of the item object.
 * @param {TItemObject[]} items - The array of items.
 * @param {keyof TItemObject} [idKey='id'] - The key of the item's unique identifier.
 * @param {keyof TItemObject} [parentKey='parent_id'] - The key of the item's parent identifier.
 * @return  - The roots of the hierarchy tree.
 */
export const buildHierarchy = <TItemObject extends ObjectDto>({
    items,
    idKey = 'id',
    parentKey = 'parent_id',
}: BuildHierachyOptions<TItemObject>): HierachyReturn<TItemObject>[] => {
    const itemMap = new Map<number | string, HierachyReturn<TItemObject>>();

    if (IsEmptyArray(items)) return [];

    // Create a map of employee_id to employee object
    items.forEach((item) => {
        if (!AccessNestedObject(item, idKey as string)) return;
        itemMap.set(AccessNestedObject(item, idKey as string), {
            id: item.id,
            data: item,
            children: [],
        });
    });
    const roots: HierachyReturn<TItemObject>[] = [];

    // Build the tree structure
    items.forEach((item) => {
        if (IsUndefinedOrNull(AccessNestedObject(item, parentKey as string)))
            return roots.push(
                itemMap.get(AccessNestedObject(item, idKey as string))
            );

        const parent = itemMap.get(
            AccessNestedObject(item, parentKey as string)
        );
        if (!parent) return;

        parent.children.push(
            itemMap.get(AccessNestedObject(item, idKey as string))
        );
    });

    return roots;
};

// Function to collect edges from the hierarchy tree
export function collectEdges<TItemObject extends ObjectDto>(
    node: HierachyReturn<TItemObject>,
    idKey = 'id',
    parentKey = 'parent_id',
    edges: Edge[] = []
) {
    node.children.forEach((child) => {
        const nodeId = AccessNestedObject(node.data, idKey);
        const childId = AccessNestedObject(child.data, idKey);
        edges.push({
            id: `${nodeId}-${childId}`,
            source: String(nodeId),
            target: String(childId),
        });
        collectEdges(child, idKey, parentKey, edges);
    });
    return edges;
}

// Function to assign positions to nodes
export function assignPositions<TItemObject extends ObjectDto>(
    node: HierachyReturn<TItemObject>,
    x = 0,
    y = 0,
    nodePositions: Node[] = [],
    currentLevel = 0,
    levelHeight = 100,
    levelWidth = 200
) {
    nodePositions.push({
        id: String(node.id),
        data: {
            ...node.data,
            label: node.data.name,
            hasChildren: !IsEmptyArray(node.children),
        },
        position: { x, y },
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        // type: !node.data.manager_id ? 'input' : undefined,
        type: node.data.type ?? 'card',
    });

    const childCount = node.children.length;
    let childY = y - ((childCount - 1) * levelHeight) / 2;

    node.children.forEach((child, index) => {
        assignPositions(
            child,
            x + levelWidth,
            childY + index * levelHeight,
            nodePositions,
            currentLevel + 1,
            levelHeight,
            levelWidth
        );
    });

    return nodePositions;
}

export const getEdges = <TItemObject>(
    hierarchy: HierachyReturn<TItemObject>[],
    idKey = 'id',
    parentKey = 'parent_id'
) => {
    const edges: Edge[] = [];
    hierarchy.forEach((tree) => {
        if (IsEmptyArray(tree.children)) return;

        edges.push(...collectEdges(tree, idKey as string, parentKey as string));
    });

    return edges;
};

export const getNodes = <TItemObject>(
    hierarchy: HierachyReturn<TItemObject>[]
) => {
    let nodePositions: Node[] = [];
    hierarchy.forEach((tree, index) => {
        nodePositions = assignPositions(tree, 0, index * 100, nodePositions); // Starting x-position offset for each tree
    });
    return nodePositions;
};

export const getHierarchyLayoutedElements = (
    nodes: any[],
    edges: Edge[],
    reactflowInstance: ReactFlowInstance,
    options: any
) => {
    const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(
        () => ({})
    );

    dagreGraph.setGraph({
        rankdir: options.direction,
        ranker: 'tight-tree',
        ranksep: 150,
    });

    edges.forEach((edge) =>
        dagreGraph.setEdge(
            reactflowInstance?.getEdge(edge.id)?.source ?? edge.source,
            reactflowInstance?.getEdge(edge.id)?.target ?? edge.target
        )
    );

    const newNodes = nodes.map((node, idx) => {
        const newNode = reactflowInstance?.getNode(node.id) ?? node;
        if (idx < 3)
            console.log(reactflowInstance?.getNode(node.id), 'flow node');
        dagreGraph.setNode(node.id, newNode);

        return newNode;
    });

    Dagre.layout(dagreGraph);

    console.log({ newNodes });
    return {
        nodes: newNodes.map((node, idx) => {
            const position = dagreGraph.node(node.id);
            if (idx < 3) console.log(position, node);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - node.width / 2;
            const y = position.y - node.height / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

export function useNodesMeasuredEffect(callback: () => void): void {
    const nodesInitialized = useNodesInitialized({
        includeHiddenNodes: true,
    });

    return useEffect(() => {
        // make sure that the callback is only executed once
        if (nodesInitialized) {
            callback();
        }
    }, [callback, nodesInitialized]);
}
