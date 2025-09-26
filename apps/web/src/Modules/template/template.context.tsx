import { createContext, useContext, useState } from 'react';

import { creationSteps } from './constants/template.format';

interface TemplateContextTypes {
    activeStep: creationSteps;
    handleActiveStep: (key: creationSteps) => void;
}

const TemplateContext = createContext<TemplateContextTypes>({
    activeStep: string,
    handleActiveStep,
});

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [activeStep, setActiveStep] =
        useState<creationSteps>('setup_template');

    const handleActiveStep = (key: creationSteps) => {
        setActiveStep(key);
    };

    return (
        <TemplateContext.Provider value={{ activeStep, handleActiveStep }}>
            {children}
        </TemplateContext.Provider>
    );
};
