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

interface CommonComponentTypes {
    type: 'HEADER' | 'BODY' | 'BUTTONS' | 'FOOTER';
    format?: string;
    text?: string;
    example?: {
        body_text_named_params?: any;
        header_text_named_params?: any;
        header_handle?: any;
    };
    buttons?: Button[];
    add_security_recommendation?: boolean; // body
    code_expiration_minutes?: boolean; // footer
}

export interface TemplateState {
    allow_category_change: boolean;
    parameter_format: string;
    message_send_ttl_seconds?: number;
    header_media_detail: any;
    name?: string;
    language?: string;
    category?: CategoryName;
    components: CommonComponentTypes[];
}
