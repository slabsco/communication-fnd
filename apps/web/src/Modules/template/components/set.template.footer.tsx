import { useMemo } from 'react';

import { InputField, Switch } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

const SetTemplateFooter = () => {
    const { state, dispatch, configState, configDispatch } = useTemplate();

    const { text } =
        state.components?.find((_component) => _component?.type === 'FOOTER') ||
        {};

    const footerError = useMemo(() => {
        if (!configState?.is_unsubscribe_template) return;
        if (text?.toUpperCase()?.includes('STOP')) return;
        return [
            'If Unsubscribe feature is enabled the footer must contain the "STOP" keyword.',
        ];
    }, [configState?.is_unsubscribe_template, text]);

    return (
        <div className='gap-2 col-flex'>
            <InputField
                placeholder={'Enter Text'}
                label='Footer'
                maxLength={60}
                onChange={(v) =>
                    dispatch({
                        type: 'UPDATE_FOOTER',
                        payload: {
                            text: v,
                        },
                    })
                }
                value={text}
                error={footerError}
            />
            <div className='flex gap-2 items-center'>
                <Switch
                    size='sm'
                    checked={configState?.is_unsubscribe_template}
                    onChange={(val) => {
                        if (val) {
                            dispatch({
                                type: 'UPDATE_FOOTER',
                                payload: {
                                    text: 'Reply STOP to unsubscribe from our messages',
                                },
                            });
                        }
                        configDispatch({
                            type: 'SET_UNSUBSCRIBE_TEMPLATE',
                            payload: val,
                        });
                    }}
                />{' '}
                <span>Enable Unsubscribe </span>
            </div>
        </div>
    );
};

export default SetTemplateFooter;
