import React, { useCallback, useMemo } from 'react';

import { InputField } from '@finnoto/design-system';
import { isValidURL } from '@finnoto/design-system/src/Components/Data-display/Typography/typography.utils';

import { useTemplate } from '../template.context';
import { DYNAMIC_MEDIA_URL_VARIABLE_NAME } from '../types/template.category.types';
import { uploadToFacebook } from './set.template.media';

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
        onBlur,
    }: {
        param: ParamItem;
        paramType: 'body' | 'header';
        onChange?: (
            paramName: string,
            value: string,
            type: 'body' | 'header'
        ) => void;
        onBlur?: (value: string) => void;
    }) => {
        return (
            <InputField
                placeholder={`Enter ${param.param_name}`}
                value={param.example || ''}
                onChange={(val) => onChange?.(param.param_name, val, paramType)}
                onBlur={onBlur}
            />
        );
    }
);

const SetVariableSample = React.memo(() => {
    const { dispatch, state } = useTemplate();

    const { dynamic_media } = state?.header_media_detail || {};

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

    const handleDynamicUrlChange = async (value: string) => {
        if (!isValidURL(value)) return;

        try {
            const uploadToFb = await uploadToFacebook(value);
            if (!uploadToFb?.['h']) return;

            dispatch({
                type: 'UPDATE_HEADER',
                payload: {
                    example: {
                        header_handle: [uploadToFb?.['h']],
                    },
                },
            });
            dispatch({
                type: 'UPDATE_HEADER_MEDIA',
                payload: {
                    dynamic_media: {
                        key: DYNAMIC_MEDIA_URL_VARIABLE_NAME,
                        url: value,
                        enabled: true,
                    },
                },
            });
        } catch (error) {}
    };

    // Don't render if no parameters
    if (!headerParams.length && !bodyParams.length && !dynamic_media?.enabled) {
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

            {dynamic_media?.enabled && (
                <div className='gap-2 mt-4 col-flex'>
                    <h3 className='font-medium'>Header Media Sample</h3>
                    <ParamInput
                        key={`header-dynamic_media`}
                        param={{
                            param_name: DYNAMIC_MEDIA_URL_VARIABLE_NAME,
                            example: dynamic_media?.url,
                        }}
                        paramType='header'
                        onBlur={handleDynamicUrlChange}
                    />
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
