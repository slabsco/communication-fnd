import {
    FetchData,
    Navigation,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { Button } from '@finnoto/design-system';

import { toastBackendErrorModal } from '../../../Utils/functions.utils';
import { templateNavigationGuard } from '../constants/template.reducer';
import { useTemplate } from '../template.context';

const TemplateNavigationFooter = () => {
    const { state, activeStep, handleChangeStep } = useTemplate();

    const sendForApproval = async (next: any) => {
        const { response, success } = await FetchData({
            className: CommunicationTemplateController,
            method: 'create',
            classParams: state,
        });

        if (!success) {
            toastBackendErrorModal(response);
        }

        return next();
    };

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
                    // progress
                    onClick={sendForApproval}
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
