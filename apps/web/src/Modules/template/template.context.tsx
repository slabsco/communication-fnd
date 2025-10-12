import {
    createContext,
    Dispatch,
    useCallback, // Add this import
    useContext,
    useMemo, // Add this import
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
    resetState: (hardReset?: boolean) => void;
    dispatch: Dispatch<TemplateAction>;
    activeStep?: activeStep;
    handleChangeStep?: (name: creationSteps) => void;
    handleChangeType?: (type: string) => void;
}

const TemplateContext = createContext<TemplateContextTypes>(null);

export const useTemplate = () => useContext(TemplateContext);

const defaultStep: activeStep = {
    step: 'setup_template',
    type: 'DEFAULT',
};

export const TemplateProvider = ({
    edit_data = initialState,
    defaultActiveState = defaultStep,
    children,
}: {
    edit_data?: typeof initialState;
    children: React.ReactNode;
    defaultActiveState?: activeStep;
}) => {
    const [state, dispatch] = useReducer(templateReducer, edit_data);

    const [activeStep, setActiveStep] =
        useState<activeStep>(defaultActiveState);

    // Memoize these functions
    const handleChangeStep = useCallback((name: creationSteps) => {
        setActiveStep((prev) => ({
            ...prev,
            step: name,
        }));
    }, []);

    const handleChangeType = useCallback((type: string) => {
        setActiveStep((prev) => ({
            ...prev,
            type: type,
        }));
    }, []);

    const resetState = useCallback(
        (hard_reset?: boolean) => {
            dispatch({
                type: 'RESET_STATE',
                payload: hard_reset ? initialState : edit_data,
            });
            handleChangeType('DEFAULT');
        },
        [dispatch, edit_data, handleChangeType]
    );

    // Memoize the context value
    const contextValue = useMemo(
        () => ({
            state,
            dispatch,
            activeStep,
            handleChangeStep,
            handleChangeType,
            resetState,
        }),
        [
            state,
            dispatch,
            activeStep,
            handleChangeStep,
            handleChangeType,
            resetState,
        ]
    );

    return (
        <TemplateContext.Provider value={contextValue}>
            {children}
        </TemplateContext.Provider>
    );
};
