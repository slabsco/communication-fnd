import { useEffect } from 'react';

import { Navigation, WHATSAPP_TEMPLATE_LIST_ROUTE } from '@finnoto/core';
import { Button } from '@finnoto/design-system';

import { templateNavigationGuard } from '../constants/template.reducer';
import { useTemplate } from '../template.context';

const TemplateNavigationFooter = () => {
    const { dispatch, state } = useTemplate();

    return (
        <div className='flex static gap-3 justify-between items-center p-4 rounded bg-base-100'>
            {state.activeStep === 'edit_template' ? (
                <Button
                    outline
                    onClick={() => {
                        templateNavigationGuard(() => {
                            dispatch({
                                type: 'CHANGE_TEMPLATE_ACTION',
                                payload: 'setup_template',
                            });
                        });
                    }}
                >
                    Back
                </Button>
            ) : (
                <Button
                    outline
                    onClick={() =>
                        Navigation.navigate({
                            url: WHATSAPP_TEMPLATE_LIST_ROUTE,
                        })
                    }
                >
                    Discard
                </Button>
            )}
            <Button
                appearance='primary'
                defaultMinWidth
                onClick={() => {
                    dispatch({
                        type: 'CHANGE_TEMPLATE_ACTION',
                        payload: 'edit_template',
                    });
                }}
            >
                Next
            </Button>
        </div>
    );
};

export default TemplateNavigationFooter;
