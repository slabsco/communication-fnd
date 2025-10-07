import { creationSteps } from '../constants/template.format';

export type TemplateCategoryType = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';

export interface MarketingCategory {
    name: TemplateCategoryType;
    type: 'DEFAULT' | 'CALL_PERMISSION' | 'CAROUSEL';
}

export interface UtilityCategory {
    name: 'UTILITY';
    type: 'DEFAULT' | 'CALL_PERMISSION';
}

export interface AuthenticationCategory {
    name: 'AUTHENTICATION';
    type: 'ONE_TIME_PASS';
}

export interface TemplateCategory {
    name: TemplateCategory;
}

export type CategoryName =
    | MarketingCategory['name']
    | UtilityCategory['name']
    | AuthenticationCategory['name'];

export type CategoryType =
    | MarketingCategory['type']
    | UtilityCategory['type']
    | AuthenticationCategory['type'];

type QuickReplyButton = {
    type: 'QUICK_REPLY';
    text?: string;
};

type CopyCodeButton = {
    type: 'COPY_CODE';
    example?: string;
};

type PhoneNumberButton = {
    type: 'PHONE_NUMBER';
    text: string;
    phone_number: string;
};

type UrlButton = {
    type: 'URL';
    text: string;
    url: string;
    example: string[];
    is_dynamic?: boolean; // dynamic vs static URL
};

type Button = QuickReplyButton | CopyCodeButton | PhoneNumberButton | UrlButton;

interface HeaderExample {
    header_text_named_params: string[];
    header_handle: string[];
}

interface BodyExample {
    body_text_named_params: string[];
}

interface ComponentsState {
    header: {
        format?: string;
        text?: string;
        example: HeaderExample;
    };
    body: {
        text?: string;
        example: BodyExample;
    };
    footer: {
        text?: string;
    };
    call_permission_request: Record<string, never>;
    limited_time_offer: Record<string, never>;
    carousel: {
        cards: unknown[];
    };
    buttons: Button[];
}

export interface TemplateState {
    activeStep: creationSteps;
    name?: string;
    language?: string;
    category?: CategoryName;
    type?: CategoryType;
    components: ComponentsState;
}
