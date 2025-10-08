import { ConfirmAsyncUtil } from '@finnoto/design-system';

import { TemplateState } from '../types/template.category.types';
import { TemplateAction } from './template.format';

export const initialState: TemplateState = {
    parameter_format: 'NAMED',
    allow_category_change: true,
    name: undefined,
    language: 'en_US',
    category: 'MARKETING',
    header_media_detail: undefined,
    components: [
        {
            type: 'HEADER',
            format: undefined,
            text: undefined,
            example: {
                header_text_named_params: [],
                header_handle: [],
            },
        },
        {
            type: 'BODY',
            text: undefined,
            example: {
                body_text_named_params: [],
            },
        },
        {
            type: 'FOOTER',
            text: undefined,
        },
        {
            type: 'BUTTONS',
            buttons: [],
        },
    ],
};

function setIn<T>(obj: T, path: string, next: any | ((prev: any) => any)): T {
    if (!path) return obj;
    const keys = path.split('.');
    const [key, ...rest] = keys;
    const isIndex = !isNaN(Number(key));

    const curr: any = (obj as any) ?? (isIndex ? [] : {});
    const clone: any = Array.isArray(curr) ? curr.slice() : { ...curr };

    if (rest.length === 0) {
        const prevVal = clone[key as any];
        clone[key as any] =
            typeof next === 'function' ? (next as any)(prevVal) : next;
        return clone as T;
    }

    const child = clone[key as any];
    clone[key as any] = setIn(child, rest.join('.'), next);
    return clone as T;
}

// Helper function to update a specific component in the components array
function updateComponent(
    state: TemplateState,
    componentType: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS',
    updates: any
): TemplateState {
    const updatedComponents = state.components.map((component) => {
        if (component.type === componentType) {
            return {
                ...component,
                ...updates,
            };
        }
        return component;
    });

    return {
        ...state,
        components: updatedComponents,
    };
}

// Updated reducer with all component update cases
export function templateReducer(
    state: TemplateState,
    action: TemplateAction
): TemplateState {
    switch (action.type) {
        case 'UPDATE_CATEGORY':
            return setIn(state, 'category', action?.payload);

        case 'UPDATE_NAME':
            return setIn(state, 'name', action?.payload);

        case 'UPDATE_LANGUAGE':
            return setIn(state, 'language', action?.payload);

        // HEADER COMPONENT UPDATES
        case 'UPDATE_HEADER':
            return updateComponent(state, 'HEADER', action?.payload);

        case 'UPDATE_HEADER_MEDIA':
            return setIn(state, 'header_media_detail', action?.payload);

        case 'UPDATE_BODY':
            return updateComponent(state, 'BODY', action?.payload);
        case 'UPDATE_FOOTER':
            return updateComponent(state, 'FOOTER', action?.payload);
        case 'UPDATE_BUTTONS':
            // Fix: Update only the buttons array, not the entire component
            return updateComponent(state, 'BUTTONS', {
                buttons: action?.payload,
            });

        // case 'UPDATE_HEADER_EXAMPLE':
        //     return updateComponent(state, 'HEADER', {
        //         example: {
        //             ...state.components.find((c) => c.type === 'HEADER')
        //                 ?.example,
        //             ...action?.payload,
        //         },
        //     });

        // // BODY COMPONENT UPDATES
        // case 'UPDATE_BODY':
        //     return updateComponent(state, 'BODY', action?.payload);

        // case 'UPDATE_BODY_TEXT':
        //     return updateComponent(state, 'BODY', { text: action?.payload });

        // case 'UPDATE_BODY_EXAMPLE':
        //     return updateComponent(state, 'BODY', {
        //         example: {
        //             ...state.components.find((c) => c.type === 'BODY')?.example,
        //             ...action?.payload,
        //         },
        //     });

        // // FOOTER COMPONENT UPDATES
        // case 'UPDATE_FOOTER':
        //     return updateComponent(state, 'FOOTER', action?.payload);

        // case 'UPDATE_FOOTER_TEXT':
        //     return updateComponent(state, 'FOOTER', { text: action?.payload });

        // // BUTTON COMPONENT UPDATES
        // case 'UPDATE_BUTTONS':
        //     return updateComponent(state, 'BUTTONS', action?.payload);

        // case 'UPDATE_BUTTON_ARRAY':
        //     return updateComponent(state, 'BUTTONS', {
        //         buttons: action?.payload,
        //     });

        default:
            return state;
    }
}

const showDiscardTemplateModal = async () => {
    return await ConfirmAsyncUtil({
        isArc: true,
        title: 'Changes will be lost if you go back',
        message: `You started editing this template, but haven't submitted it yet. If you discard now, all your progress will be lost`,
    });
};

export const templateNavigationGuard = async (
    fn: () => void,
    show: boolean = true
) => {
    const result = show ? await showDiscardTemplateModal() : true;
    if (!result) return;
    return fn();
};
