import { NodeTypesInternal } from '../flowbuilder.main';

export const generateIdFromTimestamp = (): string => {
    return Date.now().toString(36);
};

export const CreateNewNode = ({
    component,
    onDelete,
    onCopy,
    position = { x: 250, y: 5 },
}: {
    onDelete: (id: any) => void;
    onCopy: (node: any) => void;
    position?: { x: number; y: number };
    component: NodeTypesInternal;
}) => {
    return {
        id: generateIdFromTimestamp(),
        type: component,
        data: {
            onDelete: (id: any) => {
                onDelete(id);
            },
            onCopy: (id: any) => {
                onCopy(
                    CreateNewNode({
                        onDelete,
                        onCopy,
                        position: { x: position.x, y: position.y + 20 },
                        component,
                    })
                );
            },
        },
        position,
    };
};
