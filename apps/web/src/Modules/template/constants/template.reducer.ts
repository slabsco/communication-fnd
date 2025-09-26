import { TemplateState } from '../types/template.category.types';

export const initialState: TemplateState = {
    activeStep: 'setup_template',
    steps: {
        setup_template: {
            complete: false,
            category: undefined,
            type: undefined,
        },
        edit_template: {
            complete: false,
            configuration: {
                name: undefined,
                language: undefined,
            },
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
                limited_time_offer: {
                    text: undefined,
                    has_expiration: true,
                },
                carousel: {
                    cards: [],
                },
                buttons: [
                    {
                        type: 'QUICK_REPLY',
                        text: undefined,
                    },
                    {
                        type: 'COPY_CODE',
                        example: undefined,
                    },
                    {
                        type: 'PHONE_NUMBER',
                        text: '<TEXT>',
                        phone_number: '<PHONE_NUMBER>',
                    },
                    {
                        type: 'URL',
                        text: '<TEXT>',
                        url: '<URL>',
                        example: ['<EXAMPLE>'],
                    },
                ],
            },
        },
    },
};
