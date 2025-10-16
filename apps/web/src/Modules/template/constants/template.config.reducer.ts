// apps/web/src/Modules/template/constants/template.config.reducer.ts
export type TemplateConfigState = {
    is_unsubscribe_template: boolean;
};

export const templateConfigInitialState: TemplateConfigState = {
    is_unsubscribe_template: false,
};

export type TemplateConfigAction =
    | { type: 'SET_UNSUBSCRIBE_TEMPLATE'; payload: boolean }
    | { type: 'RESET_TEMPLATE_CONFIG' };

export function templateConfigReducer(
    state: TemplateConfigState,
    action: TemplateConfigAction
): TemplateConfigState {
    switch (action.type) {
        case 'SET_UNSUBSCRIBE_TEMPLATE':
            return { ...state, is_unsubscribe_template: action.payload };
        case 'RESET_TEMPLATE_CONFIG':
            return { ...templateConfigInitialState };
        default:
            return state;
    }
}
