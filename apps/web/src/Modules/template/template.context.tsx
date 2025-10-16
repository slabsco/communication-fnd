import {
    createContext,
    Dispatch,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    useState,
} from 'react';

import {
    TemplateConfigAction,
    templateConfigInitialState,
    templateConfigReducer,
    TemplateConfigState,
} from './constants/template.config.reducer';
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
    configState: TemplateConfigState;
    configDispatch: Dispatch<TemplateConfigAction>;
}

const TemplateContext = createContext<TemplateContextTypes>(null);

export const useTemplate = () => useContext(TemplateContext);

const defaultStep: activeStep = {
    step: 'setup_template',
    type: 'DEFAULT',
};

export const TemplateProvider = ({
    edit_data = initialState,
    templateConfigState = templateConfigInitialState,
    defaultActiveState = defaultStep,
    children,
}: {
    edit_data?: typeof initialState;
    templateConfigState?: typeof templateConfigInitialState;
    children: React.ReactNode;
    defaultActiveState?: activeStep;
}) => {
    const [state, dispatch] = useReducer(templateReducer, edit_data);
    const [configState, configDispatch] = useReducer(
        templateConfigReducer,
        templateConfigState
    );

    const [activeStep, setActiveStep] =
        useState<activeStep>(defaultActiveState);

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
            configDispatch({ type: 'RESET_TEMPLATE_CONFIG' });
        },
        [dispatch, edit_data, handleChangeType, configDispatch]
    );

    const contextValue = useMemo(
        () => ({
            state,
            dispatch,
            activeStep,
            handleChangeStep,
            handleChangeType,
            resetState,
            configState,
            configDispatch,
        }),
        [
            state,
            dispatch,
            activeStep,
            handleChangeStep,
            handleChangeType,
            resetState,
            configState,
            configDispatch,
        ]
    );

    return (
        <TemplateContext.Provider value={contextValue}>
            {children}
        </TemplateContext.Provider>
    );
};
