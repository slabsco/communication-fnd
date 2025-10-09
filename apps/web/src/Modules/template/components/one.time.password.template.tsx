import { useMemo } from 'react';
import { useEffectOnce } from 'react-use';

import { IsUndefinedOrNull } from '@finnoto/core';
import { CheckBox, InputField, SelectBox } from '@finnoto/design-system';

import { useTemplate } from '../template.context';
import EditTemplateSectionContainer from './edit.template.section.container';
import SetTemplateNameLanguage from './set.template.name.language';
import { CategoryTypeSelector } from './setup.template';

const OneTimePasswordTemplate = () => {
    const { state, dispatch } = useTemplate();
    const body = useMemo(() => {
        return state?.components?.find(
            (_component) => _component?.type === 'BODY'
        );
    }, [state?.components]);

    const footer = useMemo(() => {
        return state?.components?.find(
            (_component) => _component?.type === 'FOOTER'
        );
    }, [state?.components]);

    const initialize = () => {
        dispatch({ type: 'UPDATE_ALLOW_CATEGORY_CHANGE', payload: false });
        dispatch({ type: 'UPDATE_PARAMETER_FORMAT', payload: 'POSITIONAL' });
        dispatch({ type: 'REMOVE_COMPONENT', payload: 'HEADER' });

        if (!state?.message_send_ttl_seconds) {
            dispatch({
                type: 'UPDATE_TIME_TO_LIVE',
                payload: 600,
            });
        }

        dispatch({
            type: 'UPDATE_BUTTONS',
            payload: [
                {
                    type: 'otp',
                    otp_type: 'copy_code',
                    text: 'Copy Code',
                },
            ],
        });
        dispatch({
            type: 'UPDATE_BODY_PARAMS_ONLY',
            payload: {
                example: {
                    body_text_named_params: [
                        {
                            param_name: 'code',
                            example: '{{12}}',
                        },
                    ],
                },
            },
        });
    };

    useEffectOnce(() => {
        initialize();
    });

    const addCodeExpirationMinutes = (time: number) => {
        dispatch({
            type: 'UPDATE_FOOTER',
            payload: { code_expiration_minutes: time },
        });
    };
    const addSecurityRecommendation = (enabled: boolean) => {
        dispatch({
            type: 'UPDATE_BODY',
            payload: {
                add_security_recommendation: enabled,
            },
        });
    };

    return (
        <>
            <SetTemplateNameLanguage />
            <EditTemplateSectionContainer
                title='Code delivery setup'
                description={`
                    Choose how customers send the code from WhatsApp to your
                    app. Edits to this section won't require review or count
                    towards edit limits. Learn how to send authentication
                    message templates. `}
                link={{
                    link: 'https://www.meta.com/learn/meta-cloud-api',
                    text: 'authentication message templates.',
                }}
            >
                <div className='gap-3 mt-2 col-flex'>
                    <CategoryTypeSelector
                        description='Basic authentication with quick setup. Your customers copy and paste the code into your app.'
                        header='Copy Code'
                        active={true}
                    />
                </div>
            </EditTemplateSectionContainer>
            <EditTemplateSectionContainer
                title='Content'
                description={`
                  Content for authentication message templates can't be edited. You can add additional content from the options below.`}
            >
                <div className='gap-3 mt-2 col-flex'>
                    <CheckBox
                        rightLabel='Add security recommendation'
                        key={'add-security'}
                        checked={!!body?.add_security_recommendation}
                        onChange={(value) => {
                            addSecurityRecommendation(value);
                        }}
                    />
                    <CheckBox
                        rightLabel='Add expiration time for the code'
                        key={'add-expiration'}
                        checked={!!footer?.code_expiration_minutes}
                        onChange={(value) => {
                            addCodeExpirationMinutes(value ? 10 : undefined);
                        }}
                    />

                    {!IsUndefinedOrNull(footer?.code_expiration_minutes) && (
                        <InputField
                            type='number'
                            suffix='Minutes'
                            maxLength={90}
                            minLength={1}
                            size='sm'
                            label='Expires In'
                            value={footer?.code_expiration_minutes}
                            onChange={(e) => {
                                addCodeExpirationMinutes(e);
                            }}
                        />
                    )}
                </div>
            </EditTemplateSectionContainer>
            <EditTemplateSectionContainer
                title='Message validity period'
                description={`
                  It's recommended to set a custom validity period that your authentication message must be delivered by before it expires. If a message is not delivered within this timeframe, you will not be charged and your customer will not see the message.`}
            >
                <div className='gap-3 mt-2 col-flex'>
                    <SelectBox
                        size='sm'
                        label='Validity period'
                        onChange={({ value }) => {
                            dispatch({
                                type: 'UPDATE_TIME_TO_LIVE',
                                payload: value,
                            });
                        }}
                        value={state?.message_send_ttl_seconds}
                        options={[
                            { label: '30 seconds', value: 30 },
                            { label: '1 minute', value: 60 },
                            { label: '2 minutes', value: 120 },
                            { label: '3 minutes', value: 180 },
                            { label: '4 minutes', value: 240 },
                            { label: '5 minutes', value: 300 },
                            { label: '10 minutes', value: 600 },
                            { label: '15 minutes', value: 900 },
                        ]}
                    />
                </div>
            </EditTemplateSectionContainer>
        </>
    );
};

export default OneTimePasswordTemplate;
