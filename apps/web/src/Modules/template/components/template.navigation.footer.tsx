import { useCallback } from 'react';

import {
    FetchData,
    Navigation,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { WhatsappTemplateCreationDto } from '@finnoto/core/src/backend/communication/dto/whatsapp.template.dto';
import { Button } from '@finnoto/design-system';

import { toastBackendErrorModal } from '../../../Utils/functions.utils';
import { templateNavigationGuard } from '../constants/template.reducer';
import { WhatsappTemplateCategoryEnum } from '../constants/whatsapp.template.category.enum';
import { useTemplate } from '../template.context';
import { TemplateState } from '../types/template.category.types';

const formatRemoveEmpty = (templateState: TemplateState) => {
    const newState = structuredClone(templateState);

    if (newState.components) {
        newState.components = newState.components
            .map((component: any) => {
                let updatedComponent = { ...component };

                // Remove empty example from BODY
                if (
                    updatedComponent.type === 'BODY' &&
                    updatedComponent.example &&
                    (!updatedComponent.example.body_text_named_params ||
                        !Array.isArray(
                            updatedComponent.example.body_text_named_params
                        ) ||
                        updatedComponent.example.body_text_named_params
                            .length === 0 ||
                        updatedComponent.example.body_text_named_params.every(
                            (param: any) =>
                                !param.example ||
                                (Array.isArray(param.example) &&
                                    param.example.length === 0)
                        ))
                ) {
                    const { example, ...rest } = updatedComponent;
                    updatedComponent = rest;
                }

                // Remove empty example from HEADER
                if (
                    updatedComponent.type === 'HEADER' &&
                    updatedComponent.example &&
                    (!updatedComponent.example.header_text_named_params ||
                        !Array.isArray(
                            updatedComponent.example.header_text_named_params
                        ) ||
                        updatedComponent.example.header_text_named_params
                            .length === 0 ||
                        updatedComponent.example.header_text_named_params.every(
                            (param: any) =>
                                !param.example ||
                                (Array.isArray(param.example) &&
                                    param.example.length === 0)
                        ))
                ) {
                    const { example, ...rest } = updatedComponent;
                    updatedComponent = rest;
                }

                // Remove empty buttons array
                if (
                    Array.isArray(updatedComponent.buttons) &&
                    updatedComponent.buttons.length === 0
                ) {
                    // Remove the whole component if there are no buttons
                    return null;
                }

                return updatedComponent;
            })
            .filter((component: any) => component !== null);
    }

    return newState;
};

const TemplateNavigationFooter = () => {
    const { state, activeStep, handleChangeStep } = useTemplate();

    const sendForApproval = useCallback(
        async (next: any, templateState: TemplateState) => {
            const { header_media_detail, ...restPayload } = templateState;

            const payload: WhatsappTemplateCreationDto = {
                header_media_detail,
                active_step: activeStep,
                category_id: WhatsappTemplateCategoryEnum[state.category],
                language_id: 1,
                name: state.name,
                raw_json: formatRemoveEmpty(restPayload as any),
            };

            const { response, success } = await FetchData({
                className: CommunicationTemplateController,
                method: 'create',
                classParams: payload,
            });
            if (success)
                return Navigation.navigate({
                    url: WHATSAPP_TEMPLATE_LIST_ROUTE,
                });

            toastBackendErrorModal(response);
            next();
        },
        [state, activeStep]
    );

    return (
        <div className='flex static gap-3 justify-between items-center p-4 rounded bg-base-100'>
            {activeStep.step === 'edit_template' ? (
                <Button
                    outline
                    onClick={() => {
                        templateNavigationGuard(() => {
                            handleChangeStep('setup_template');
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

            {activeStep.step === 'edit_template' ? (
                <Button
                    appearance='primary'
                    defaultMinWidth
                    progress
                    onClick={(n) => sendForApproval(n, state)}
                >
                    Submit
                </Button>
            ) : (
                <Button
                    appearance='primary'
                    defaultMinWidth
                    onClick={() => {
                        handleChangeStep('edit_template');
                    }}
                >
                    Next
                </Button>
            )}
        </div>
    );
};

export default TemplateNavigationFooter;
