'use client';

import { useCallback, useMemo, useState } from 'react';

import { GetObjectFromArray } from '../../../Utils/common.ui.utils';

export const useWizard = ({ onSubmit, steps, onComplete, offset }) => {
    const [stepWizard, setStepWizard] = useState(null);
    const [activeStep, setActiveStep] = useState(1);

    //assign wizard instance
    const assignStepWizard = (instance) => {
        setStepWizard(instance);
    };
    const [noOfCompleteSteps, setNoOfCompleteSteps] = useState<number>(0);

    // handle activestep and number of complete step
    const handleStepChange = (e) => {
        if (e.activeStep > noOfCompleteSteps)
            setNoOfCompleteSteps(e.activeStep);
        setActiveStep(e.activeStep);
    };

    const onPreviousStep = () => {
        stepWizard?.previousStep();
    };

    //filter and sanitize wizard step
    const wizardFilterStep = useMemo(() => {
        const tempSteps = steps.filter((step) => step?.visible !== false);
        return tempSteps.map((step, index) => {
            return {
                ...step,
                step: index + 1,
            };
        });
    }, [steps]);

    //checks final step or next step
    const handleNextStep = useCallback(() => {
        if (wizardFilterStep?.length === activeStep) onComplete();
        else stepWizard?.nextStep();
    }, [activeStep, onComplete, stepWizard, wizardFilterStep?.length]);
    const activeWizardStep: any = useMemo(() => {
        return GetObjectFromArray(wizardFilterStep, 'step', activeStep);
    }, [activeStep, wizardFilterStep]);

    //trigger next step
    const onNextStep = useCallback(
        async (response?: any) => {
            const activeKey = activeWizardStep?.key;

            console.log({ response });

            if (typeof response === 'object') {
                onSubmit(response, activeKey);
            }
            handleNextStep();
        },
        [activeWizardStep?.key, handleNextStep, onSubmit]
    );

    //it is skip function
    const onSkip = useCallback(() => handleNextStep(), [handleNextStep]);

    //check is active step
    const isActiveStep = useCallback(
        (step: number) => activeStep === step,
        [activeStep]
    );

    //make active wizard key
    const activeWizardKey = useMemo(
        () => `${activeWizardStep?.key}.wizard.${activeStep}`,
        [activeStep, activeWizardStep?.key]
    );

    //render wizard content
    const renderContent = useCallback(
        (step: any) => {
            const Component = step?.component;
            if (!Component) return <></>;

            return (
                <div className='wizard_step_container' key={step.key}>
                    <Component
                        {...(step?.props || {})}
                        onNextStep={onNextStep}
                        key={step?.key}
                        isActiveStep={isActiveStep(step?.step)}
                        formKey={
                            isActiveStep(step?.step)
                                ? activeWizardKey
                                : undefined
                        }
                    />
                </div>
            );
        },
        [activeWizardKey, isActiveStep, onNextStep]
    );

    //handle jump step
    const handleJumpStep = useCallback(
        (targetStep?: number) => {
            // if (targetStep > noOfCompleteSteps || offset - 1 === targetStep)
            //     return null;
            stepWizard?.goToStep(targetStep);
        },
        [stepWizard]
    );
    return {
        activeWizardKey,
        isActiveStep,
        onPreviousStep,
        onSkip,
        onNextStep,
        handleStepChange,
        assignStepWizard,
        activeWizardStep,
        wizardFilterStep,
        activeStep,
        renderContent,
        noOfCompleteSteps,
        handleJumpStep,
    };
};
