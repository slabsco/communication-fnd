export const TemplateCategoryConstant = {
    marketing: 'MARKETING',
    utility: 'UTILITY',
    authentication: 'AUTHENTICATION',
};

export type creationSteps =
    | 'setup_template'
    | 'edit_template'
    | 'submit_review';

export interface HeaderNavigationButton {
    name: string;
    key: creationSteps;
    icon: React.ReactNode;
    hasComplete?: boolean;
    active?: boolean;
    onClick?: () => void;
}

export type templateActionType =
    | 'CHANGE_TEMPLATE_ACTION'
    | 'UPDATE_CATEGORY'
    | 'UPDATE_TYPE'
    | 'UPDATE_NAME'
    | 'UPDATE_LANGUAGE'
    | 'UPDATE_HEADER_FORMAT'
    | 'UPDATE_HEADER_TEXT'
    | 'UPDATE_BODY_TEXT'
    | 'UPDATE_FOOTER_TEXT'
    | 'UPDATE_BUTTONS'
    | 'UPDATE_CAROUSEL'
    | 'UPDATE_CALL_PERMISSION'
    | 'UPDATE_LIMITED_TIME_OFFER';

export type TemplateCategorySupport =
    | 'MARKETING'
    | 'UTILITY'
    | 'AUTHENTICATION';

export type TemplateAction = {
    type: templateActionType;
    payload: any;
};
