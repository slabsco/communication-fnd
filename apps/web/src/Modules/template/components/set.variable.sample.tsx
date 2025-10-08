import { useCallback, useMemo } from 'react';

import { InputField } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

interface ParamItem {
    param_name: string;
    example: string;
}

const SetVariableSample = () => {
    const { dispatch, state } = useTemplate();

    // Get components
    const headerComponent = useMemo(
        () => state?.components?.find((c: any) => c.type === 'HEADER'),
        [state?.components]
    );
    const bodyComponent = useMemo(
        () => state?.components?.find((c: any) => c.type === 'BODY'),
        [state?.components]
    );

    // Get parameters from state
    const bodyParams = useMemo(
        () => bodyComponent?.example?.body_text_named_params || [],
        [bodyComponent?.example?.body_text_named_params]
    );

    const headerParams = useMemo(
        () => headerComponent?.example?.header_text_named_params || [],
        [headerComponent?.example?.header_text_named_params]
    );

    // Simple parameter update handler
    const handleParamChange = useCallback(
        (paramName: string, newValue: string, paramType: 'body' | 'header') => {
            if (paramType === 'body') {
                const updatedParams = (bodyParams as ParamItem[]).map(
                    (param: ParamItem) =>
                        param.param_name === paramName
                            ? { ...param, example: newValue }
                            : param
                );

                dispatch({
                    type: 'UPDATE_BODY',
                    payload: {
                        example: {
                            ...(bodyComponent?.example || {}),
                            body_text_named_params: updatedParams,
                        },
                    },
                });
                return;
            }

            const updatedParams = (headerParams as ParamItem[]).map(
                (param: ParamItem) =>
                    param.param_name === paramName
                        ? { ...param, example: newValue }
                        : param
            );

            dispatch({
                type: 'UPDATE_HEADER',
                payload: {
                    example: {
                        ...(headerComponent?.example || {}),
                        header_text_named_params: updatedParams,
                    },
                },
            });
        },
        [
            bodyParams,
            headerParams,
            dispatch,
            bodyComponent?.example,
            headerComponent?.example,
        ]
    );

    // Render parameter input
    const renderParamInput = (
        param: ParamItem,
        paramType: 'body' | 'header'
    ) => (
        <InputField
            key={`${paramType}-${param.param_name}`}
            placeholder={`Enter ${param.param_name}`}
            value={param.example || ''}
            onChange={(val) =>
                handleParamChange(param.param_name, val, paramType)
            }
        />
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
                    {headerParams.map((param: ParamItem) =>
                        renderParamInput(param, 'header')
                    )}
                </div>
            )}

            {bodyParams.length > 0 && (
                <div className='gap-2 mt-4 col-flex'>
                    <h3 className='font-medium'>Body</h3>
                    {bodyParams.map((param: ParamItem) =>
                        renderParamInput(param, 'body')
                    )}
                </div>
            )}
        </div>
    );
};

export default SetVariableSample;
