import { NodeTypesInternal } from '../flowbuilder.main';

export const generateIdFromTimestamp = (): string => {
    return Date.now().toString(36);
};

export const CreateNewNode = ({
    component,
    position = { x: 250, y: 5 },
}: {
    position?: { x: number; y: number };
    component: NodeTypesInternal;
}) => {
    return {
        id: generateIdFromTimestamp(),
        type: component,
        position,
        data: {},
    };
};
