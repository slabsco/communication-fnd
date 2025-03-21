import { FlowBuilderPanelCardType } from '../constants/flowbuilder.constant';

export const CreateNewNode = ({
    component,
    position = { x: 250, y: 5 },
}: {
    position?: { x: number; y: number };
    component: FlowBuilderPanelCardType;
}) => {
    return {
        id: generateIdFromTimestamp(),
        type: component,
        position,
        data: {},
    };
};

export const generateIdFromTimestamp = (): string => {
    return Date.now().toString(36);
};
