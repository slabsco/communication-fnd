import { getVariableParamsFromString, ObjectDto } from '@finnoto/core';
import { IsEmptyObject } from '@finnoto/design-system';

import { TemplateState } from '../types/template.category.types';

export const TemplateCategoryConstant = {
    marketing: 'MARKETING',
    utility: 'UTILITY',
    authentication: 'AUTHENTICATION',
};

export type creationSteps =
    | 'setup_template'
    | 'edit_template'
    | 'submit_review';

export type activeStep = {
    step: creationSteps;
    type: string;
};

export interface HeaderNavigationButton {
    name: string;
    key: creationSteps;
    icon: React.ReactNode;
    hasComplete?: boolean;
    active?: boolean;
    onClick?: () => void;
}

export type templateActionType =
    | 'UPDATE_CATEGORY'
    | 'UPDATE_NAME'
    | 'UPDATE_LANGUAGE'
    | 'UPDATE_HEADER'
    | 'UPDATE_HEADER_MEDIA'
    | 'UPDATE_BODY'
    | 'UPDATE_FOOTER'
    | 'UPDATE_BODY_PARAMS_ONLY'
    | 'UPDATE_BUTTONS'
    | 'REMOVE_COMPONENT'
    | 'UPDATE_PARAMETER_FORMAT'
    | 'UPDATE_ALLOW_CATEGORY_CHANGE'
    | 'RESET_STATE'
    | 'UPDATE_TIME_TO_LIVE';

export type TemplateCategorySupport =
    | 'MARKETING'
    | 'UTILITY'
    | 'AUTHENTICATION';

export type TemplateAction = {
    type: templateActionType;
    payload: any;
};

export interface ExtractedVariable {
    name: string;
    example?: string;
    source: 'HEADER' | 'BODY' | 'BOTH' | 'BUTTON';
    locations: string[];
}

export interface AvailableVariables {
    allVariables: ExtractedVariable[];
    variableNames: string[];
    variablesBySource: {
        header: string[];
        body: string[];
    };
}

export const initializeVariablesInState = (
    state: TemplateState,
    params: ObjectDto
): TemplateState => {
    if (!state) return;

    if (state && state.category === 'AUTHENTICATION') {
        (params as any).code = '*****';
    }

    if (IsEmptyObject(params)) return state;

    // Create a new state with updated components
    const updatedComponents = state.components.map((component) => {
        if (component.type === 'HEADER') {
            const headerParams =
                component?.example?.header_text_named_params?.map((_val) => {
                    return {
                        ..._val,
                        example: params[_val?.param_name],
                    };
                });

            return {
                ...component,
                example: {
                    ...component.example,
                    header_text_named_params: headerParams,
                },
            };
        }

        if (component.type === 'BODY') {
            const bodyParams = component?.example?.body_text_named_params?.map(
                (_val) => {
                    return {
                        ..._val,
                        example: params[_val?.param_name],
                    };
                }
            );

            return {
                ...component,
                example: {
                    ...component.example,
                    body_text_named_params: bodyParams,
                },
            };
        }

        // Return other components unchanged
        return component;
    });

    return {
        ...state,
        components: updatedComponents,
    };
};

/**
 * Extracts all available variables from the template state
 * @param state - The current template state
 * @returns Object containing all variables organized by source and type
 */
export const extractAvailableVariables = (
    state: TemplateState
): AvailableVariables => {
    if (!state) return;

    const variableMap = new Map<string, ExtractedVariable>();
    const headerVariables: string[] = [];
    const bodyVariables: string[] = [];

    // Track if we need to add the manual coupon_code variable
    let couple_code_example;

    // Process each component in the state
    state?.components?.forEach((component) => {
        // Check for COPY_CODE button
        if (component.type === 'BUTTONS' && Array.isArray(component.buttons)) {
            for (const btn of component.buttons) {
                if (btn?.type === 'COPY_CODE') {
                    couple_code_example = btn.example;
                    break;
                }
            }
        }

        if (component.type === 'HEADER') {
            const headerText = component.text || '';
            const headerVars = getVariableParamsFromString(headerText);

            // Also check existing parameters in the state
            const existingHeaderParams =
                component.example?.header_text_named_params || [];
            const existingHeaderVarNames = existingHeaderParams.map(
                (param) => param.param_name
            );

            // Combine variables from text and existing parameters
            const allHeaderVars = [
                ...new Set([...headerVars, ...existingHeaderVarNames]),
            ];

            allHeaderVars.forEach((variableName) => {
                const existingParam = existingHeaderParams.find(
                    (param) => param.param_name === variableName
                );

                if (variableMap.has(variableName)) {
                    // Variable exists in multiple sources
                    const existing = variableMap.get(variableName)!;
                    existing.source = 'BOTH';
                    existing.locations.push('HEADER');
                    existing.example =
                        existingParam?.example || existing.example;
                } else {
                    // New variable
                    variableMap.set(variableName, {
                        name: variableName,
                        example: existingParam?.example,
                        source: 'HEADER',
                        locations: ['HEADER'],
                    });
                }

                headerVariables.push(variableName);
            });
        }

        if (component.type === 'BODY') {
            const bodyText = component.text || '';
            const bodyVars = getVariableParamsFromString(bodyText);

            // Also check existing parameters in the state
            const existingBodyParams =
                component.example?.body_text_named_params || [];
            const existingBodyVarNames = existingBodyParams.map(
                (param) => param.param_name
            );

            // Combine variables from text and existing parameters
            const allBodyVars = [
                ...new Set([...bodyVars, ...existingBodyVarNames]),
            ];

            allBodyVars.forEach((variableName) => {
                const existingParam = existingBodyParams.find(
                    (param) => param.param_name === variableName
                );

                if (variableMap.has(variableName)) {
                    // Variable exists in multiple sources
                    const existing = variableMap.get(variableName)!;
                    existing.source = 'BOTH';
                    existing.locations.push('BODY');
                    existing.example =
                        existingParam?.example || existing.example;
                } else {
                    // New variable
                    variableMap.set(variableName, {
                        name: variableName,
                        example: existingParam?.example,
                        source: 'BODY',
                        locations: ['BODY'],
                    });
                }

                bodyVariables.push(variableName);
            });
        }
    });

    // If there is a COPY_CODE button, add a manual variable coupon_code
    if (couple_code_example && !variableMap.has('coupon_code')) {
        variableMap.set('coupon_code', {
            name: 'coupon_code',
            example: couple_code_example,
            source: 'BUTTON',
            locations: ['MANUAL'],
        });
    }

    return {
        allVariables: Array.from(variableMap.values()),
        variableNames: Array.from(variableMap.keys()),
        variablesBySource: {
            header: [...new Set(headerVariables)],
            body: [...new Set(bodyVariables)],
        },
    };
};

/**
 * Utility function to get just the variable names as a simple array
 * @param state - The current template state
 * @returns Array of unique variable names
 */
export const getVariableNames = (state: TemplateState): string[] => {
    return extractAvailableVariables(state).variableNames;
};

/**
 * Utility function to check if a specific variable exists in the state
 * @param state - The current template state
 * @param variableName - The variable name to check
 * @returns Boolean indicating if the variable exists
 */
export const hasVariable = (
    state: TemplateState,
    variableName: string
): boolean => {
    return extractAvailableVariables(state).variableNames.includes(
        variableName
    );
};

/**
 * Extracts variables and their example values as a simple key-value object
 * @param state - The current template state
 * @returns Object with variable names as keys and example values as values
 */
export const getVariableExamples = (
    state: TemplateState
): Record<string, string | undefined> => {
    const availableVariables = extractAvailableVariables(state);
    if (!availableVariables) return {};

    return availableVariables?.allVariables?.reduce((acc, variable) => {
        acc[variable.name] = variable.example;
        return acc;
    }, {} as Record<string, string | undefined>);
};
