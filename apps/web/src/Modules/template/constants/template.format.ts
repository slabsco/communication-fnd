export const TemplateCategoryConstant = {
    marketing: 'MARKETING',
    utility: 'UTILITY',
    authentication: 'AUTHENTICATION',
};

export type creationSteps =
    | 'setup_template'
    | 'edit_template'
    | 'submit_review';

export type activeStep = {
    step: creationSteps;
    type: string;
};

export interface HeaderNavigationButton {
    name: string;
    key: creationSteps;
    icon: React.ReactNode;
    hasComplete?: boolean;
    active?: boolean;
    onClick?: () => void;
}

export type templateActionType =
    | 'UPDATE_CATEGORY'
    | 'UPDATE_NAME'
    | 'UPDATE_LANGUAGE'
    | 'UPDATE_HEADER'
    | 'UPDATE_HEADER_MEDIA'
    | 'UPDATE_BODY'
    | 'UPDATE_FOOTER'
    | 'UPDATE_BUTTONS';

export type TemplateCategorySupport =
    | 'MARKETING'
    | 'UTILITY'
    | 'AUTHENTICATION';

export type TemplateAction = {
    type: templateActionType;
    payload: any;
};
