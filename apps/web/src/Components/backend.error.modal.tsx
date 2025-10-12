import { Button, Icon, Modal } from '@finnoto/design-system';

import { ErrorSvgIcon } from 'assets';

const BackendErrorModal = ({ response }) => {
    return (
        <div className='gap-3 p-5 centralize col-flex'>
            <div className='p-2 rounded-full bg-error/10 text-error-content centralize'>
                <div className='p-4 rounded-full bg-error'>
                    <Icon source={ErrorSvgIcon} isSvg />
                </div>
            </div>
            <p className='font-medium'>{response?.title || 'Request Error'}</p>
            <p className='text-base-secondary'>
                {response?.message ||
                    `An error occurred while processing your request. The following
                message is provided by the server. Please review it or try again
                later.`}
            </p>
            <Button
                defaultMinWidth
                onClick={() => Modal.close()}
                appearance='success'
            >
                Close
            </Button>
        </div>
    );
};

export default BackendErrorModal;

const DTOValidationErrorModal = ({ response }: { response: any }) => {
    // Group errors by field
    const errorsByField = response?.reduce((acc, error) => {
        if (!acc[error.field]) {
            acc[error.field] = [];
        }
        acc[error.field].push(error.message);
        return acc;
    }, {});

    return (
        <div className='gap-4 p-5 col-flex'>
            <div className='gap-3 items-center col-flex'>
                <div className='items-center p-2 rounded-full bg-error/10 text-error-content centralize'>
                    <div className='p-4 rounded-full bg-error'>
                        <Icon source={ErrorSvgIcon} isSvg />
                    </div>
                </div>

                <div className='gap-2 items-center col-flex'>
                    <p className='text-lg font-medium'>
                        {response?.title || 'Validation Error'}
                    </p>
                    <p className='text-base-secondary'>
                        Please fix the following validation errors:
                    </p>
                </div>
            </div>

            <div className='gap-3 col-flex'>
                {Object.entries(errorsByField).map(([field, messages]) => (
                    <div key={field} className='gap-1 col-flex'>
                        <div className='flex gap-2 items-center'>
                            <span className='font-medium capitalize text-error'>
                                {field.replace(/_/g, ' ')}:
                            </span>
                        </div>
                        <div className='pl-4 col-flex'>
                            {(messages as any).map((message, index) => (
                                <div
                                    key={index}
                                    className='flex gap-2 items-start text-sm'
                                >
                                    <span className='mt-1 text-error'>•</span>
                                    <span className='text-error'>
                                        {message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Button
                defaultMinWidth
                onClick={() => Modal.close()}
                appearance='success'
                className='mt-2'
            >
                Close
            </Button>
        </div>
    );
};

/**
 * Handles error shape:
 * {
 *   "columns": { "name": ["Duplicate Template Name"] },
 *   "others": []
 * }
 */
const ColumnsValidationErrorModal = ({ response }: { response: any }) => {
    const columns = response?.columns || {};
    const others = response?.others || [];

    return (
        <div className='gap-4 p-5 col-flex'>
            <div className='gap-3 items-center col-flex'>
                <div className='items-center p-2 rounded-full bg-error/10 text-error-content centralize'>
                    <div className='p-4 rounded-full bg-error'>
                        <Icon source={ErrorSvgIcon} isSvg />
                    </div>
                </div>

                <div className='gap-2 items-center col-flex'>
                    <p className='text-lg font-medium'>
                        {response?.title || 'Validation Error'}
                    </p>
                    <p className='text-base-secondary'>
                        Please fix the following validation errors:
                    </p>
                </div>
            </div>

            <div className='gap-3 col-flex'>
                {Object.entries(columns).map(([field, messages]) => (
                    <div key={field} className='gap-1 col-flex'>
                        <div className='flex gap-2 items-center'>
                            <span className='font-medium capitalize text-error'>
                                {String(field).replace(/_/g, ' ')}:
                            </span>
                        </div>
                        <div className='pl-4 col-flex'>
                            {(messages as any).map(
                                (message: any, index: number) => (
                                    <div
                                        key={index}
                                        className='flex gap-2 items-start text-sm'
                                    >
                                        <span className='mt-1 text-error'>
                                            •
                                        </span>
                                        <span className='text-error'>
                                            {String(message)}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}

                {Array.isArray(others) && others.length > 0 && (
                    <div className='gap-1 col-flex'>
                        <div className='flex gap-2 items-center'>
                            <span className='font-medium text-error'>
                                Others:
                            </span>
                        </div>
                        <div className='pl-4 col-flex'>
                            {others.map((message: any, index: number) => (
                                <div
                                    key={index}
                                    className='flex gap-2 items-start text-sm'
                                >
                                    <span className='mt-1 text-error'>•</span>
                                    <span className='text-error'>
                                        {String(message)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Button
                defaultMinWidth
                onClick={() => Modal.close()}
                appearance='success'
                className='mt-2'
            >
                Close
            </Button>
        </div>
    );
};

// Enhanced version that can handle multiple error shapes
const EnhancedBackendErrorModal = ({ response }: { response: any }) => {
    if (Array.isArray(response))
        return <DTOValidationErrorModal response={response} />;

    const hasColumnsObject =
        response &&
        response.columns &&
        typeof response.columns === 'object' &&
        !Array.isArray(response.columns);

    if (hasColumnsObject)
        return <ColumnsValidationErrorModal response={response} />;

    return <BackendErrorModal response={response} />;
};

export {
    DTOValidationErrorModal,
    ColumnsValidationErrorModal,
    EnhancedBackendErrorModal,
};
