import { createContext, Dispatch, useContext, useReducer } from 'react';

import { TemplateAction } from './constants/template.format';
import { initialState, templateReducer } from './constants/template.reducer';
import { TemplateState } from './types/template.category.types';

interface TemplateContextTypes {
    state: TemplateState;
    dispatch: Dispatch<TemplateAction>;
}

const TemplateContext = createContext<TemplateContextTypes>(null);

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(templateReducer, initialState);

    return (
        <TemplateContext.Provider value={{ state, dispatch }}>
            {children}
        </TemplateContext.Provider>
    );
};
