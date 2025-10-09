import React, { useCallback, useMemo } from 'react';

import { InputField } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

interface ParamItem {
    param_name: string;
    example: string;
}

// Memoized parameter input component
const ParamInput = React.memo(
    ({
        param,
        paramType,
        onChange,
    }: {
        param: ParamItem;
        paramType: 'body' | 'header';
        onChange: (
            paramName: string,
            value: string,
            type: 'body' | 'header'
        ) => void;
    }) => (
        <InputField
            placeholder={`Enter ${param.param_name}`}
            value={param.example || ''}
            onChange={(val) => onChange(param.param_name, val, paramType)}
        />
    )
);

const SetVariableSample = React.memo(() => {
    const { dispatch, state } = useTemplate();

    // Get components - memoize with more specific dependencies
    const headerComponent = useMemo(
        () => state?.components?.find((c: any) => c.type === 'HEADER'),
        [state?.components]
    );

    const bodyComponent = useMemo(
        () => state?.components?.find((c: any) => c.type === 'BODY'),
        [state?.components]
    );

    // Get parameters - use JSON.stringify for deep comparison
    const bodyParams = useMemo(
        () => bodyComponent?.example?.body_text_named_params || [],
        [bodyComponent?.example?.body_text_named_params]
    );

    const headerParams = useMemo(
        () => headerComponent?.example?.header_text_named_params || [],
        [headerComponent?.example?.header_text_named_params]
    );

    // Simplified parameter update handler with minimal dependencies
    const handleParamChange = useCallback(
        (paramName: string, newValue: string, paramType: 'body' | 'header') => {
            console.log('in');

            if (paramType === 'body') {
                // Get current body component to avoid stale closure
                const currentBodyComponent = state?.components?.find(
                    (c: any) => c.type === 'BODY'
                );
                const currentParams =
                    currentBodyComponent?.example?.body_text_named_params || [];

                const updatedParams = currentParams.map((param: ParamItem) =>
                    param.param_name === paramName
                        ? { ...param, example: newValue }
                        : param
                );

                dispatch({
                    type: 'UPDATE_BODY_PARAMS_ONLY',
                    payload: {
                        example: {
                            ...(currentBodyComponent?.example || {}),
                            body_text_named_params: updatedParams,
                        },
                    },
                });
                return;
            }

            // Similar for header
            const currentHeaderComponent = state?.components?.find(
                (c: any) => c.type === 'HEADER'
            );
            const currentHeaderParams =
                currentHeaderComponent?.example?.header_text_named_params || [];

            const updatedParams = currentHeaderParams.map((param: ParamItem) =>
                param.param_name === paramName
                    ? { ...param, example: newValue }
                    : param
            );

            dispatch({
                type: 'UPDATE_HEADER',
                payload: {
                    example: {
                        ...(currentHeaderComponent?.example || {}),
                        header_text_named_params: updatedParams,
                    },
                },
            });
        },
        [dispatch, state?.components] // Only depend on dispatch and components array
    );

    // Don't render if no parameters
    if (!headerParams.length && !bodyParams.length) {
        return null;
    }

    return (
        <div className='p-4 rounded bg-base-200'>
            <h3 className='font-medium'>Variable Samples</h3>
            <p className='text-sm'>
                Include samples of all variables in your message to help Meta
                review your template. Remember not to include any customer
                information to protect your customer&apos;s privacy.
            </p>

            {headerParams.length > 0 && (
                <div className='gap-2 mt-4 col-flex'>
                    <h3 className='font-medium'>Header</h3>
                    {headerParams.map((param: ParamItem) => (
                        <ParamInput
                            key={`header-${param.param_name}`}
                            param={param}
                            paramType='header'
                            onChange={handleParamChange}
                        />
                    ))}
                </div>
            )}

            {bodyParams.length > 0 && (
                <div className='gap-2 mt-4 col-flex'>
                    <h3 className='font-medium'>Body</h3>
                    {bodyParams.map((param: ParamItem) => (
                        <ParamInput
                            key={`body-${param.param_name}`}
                            param={param}
                            paramType='body'
                            onChange={handleParamChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default SetVariableSample;
