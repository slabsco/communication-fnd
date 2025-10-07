import { Navigation, WHATSAPP_TEMPLATE_LIST_ROUTE } from '@finnoto/core';
import { ConfirmAsyncUtil } from '@finnoto/design-system';

import { TemplateState } from '../types/template.category.types';
import { TemplateAction } from './template.format';

export const initialState: TemplateState = {
    activeStep: 'setup_template',
    name: undefined,
    language: undefined,
    category: 'MARKETING',
    type: 'DEFAULT',
    components: {
        header: {
            format: undefined,
            text: undefined,
            example: {
                header_text_named_params: [],
                header_handle: [],
            },
        },
        body: {
            text: undefined,
            example: {
                body_text_named_params: [],
            },
        },
        footer: {
            text: undefined,
        },
        call_permission_request: {},
        limited_time_offer: {},
        carousel: {
            cards: [],
        },
        buttons: [],
    },
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

export function templateReducer(
    state: TemplateState,
    action: TemplateAction
): TemplateState {
    switch (action.type) {
        case 'CHANGE_TEMPLATE_ACTION': {
            return { ...initialState, activeStep: action?.payload };
        }
        case 'UPDATE_CATEGORY':
            return setIn(state, 'category', action?.payload);
        case 'UPDATE_TYPE':
            return setIn(state, 'type', action?.payload);
        case 'UPDATE_NAME':
            return setIn(state, 'name', action?.payload);
        case 'UPDATE_LANGUAGE':
            return setIn(state, 'language', action?.payload);
        case 'UPDATE_HEADER_FORMAT':
            return setIn(state, 'components.header.format', action?.payload);
        case 'UPDATE_HEADER_TEXT':
            return setIn(state, 'components.header.text', action?.payload);
        case 'UPDATE_BODY_TEXT':
            return setIn(state, 'components.body.text', action?.payload);
        case 'UPDATE_FOOTER_TEXT':
            return setIn(state, 'components.footer.text', action?.payload);
        case 'UPDATE_BUTTONS':
            return setIn(state, 'components.buttons', action?.payload);
        case 'UPDATE_CAROUSEL':
            return setIn(state, 'components.carousel', action?.payload);
        case 'UPDATE_CALL_PERMISSION':
            return setIn(
                state,
                'components.call_permission_request',
                action?.payload
            );
        case 'UPDATE_LIMITED_TIME_OFFER':
            return setIn(
                state,
                'components.limited_time_offer',
                action?.payload
            );

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
