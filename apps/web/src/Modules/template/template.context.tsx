import {
    createContext,
    Dispatch,
    useContext,
    useReducer,
    useState,
} from 'react';

import {
    activeStep,
    creationSteps,
    TemplateAction,
} from './constants/template.format';
import { initialState, templateReducer } from './constants/template.reducer';
import { TemplateState } from './types/template.category.types';

interface TemplateContextTypes {
    state: TemplateState;
    dispatch: Dispatch<TemplateAction>;
    activeStep?: activeStep;
    handleChangeStep?: (name: creationSteps) => void;
    handleChangeType?: (type: string) => void;
}

const TemplateContext = createContext<TemplateContextTypes>(null);

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({
    edit_data = initialState,
    children,
}: {
    edit_data?: typeof initialState;
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(templateReducer, edit_data);

    const [activeStep, setActiveStep] = useState<activeStep>({
        step: 'setup_template',
        type: 'DEFAULT',
    });

    const handleChangeStep = (name: creationSteps) => {
        setActiveStep((prev) => ({
            ...prev,
            step: name,
        }));
    };
    const handleChangeType = (type: string) => {
        setActiveStep((prev) => ({
            ...prev,
            type: type,
        }));
    };

    return (
        <TemplateContext.Provider
            value={{
                state,
                dispatch,
                activeStep,
                handleChangeStep,
                handleChangeType,
            }}
        >
            {children}
        </TemplateContext.Provider>
    );
};
