import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useUpdateEffect } from 'react-use';

import {
    FormatDisplayDate,
    IsEmptyArray,
    IsEmptyObject,
    IsUndefinedOrNull,
    IsValidString,
    PRODUCT_IDENTIFIER,
    useApp,
    useBulkUpload,
} from '@finnoto/core';
import {
    Button,
    cn,
    CommonFileUploader,
    Ellipsis,
    Icon,
    Loading,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    Tooltip,
} from '@finnoto/design-system';

import {
    BulkuploadSvgIcon,
    ConfirmCheckMarkSvgIcon,
    FileXSLSvgIcon,
    InfoCircleSvgIcon,
    UploadIcon,
} from 'assets';

interface BulkUploadProps {
    name: string;
    callback?: () => void;
    typeId: number;
}

const BulkUploadModal = ({
    name = 'Employee',
    typeId,
    callback,
}: BulkUploadProps) => {
    const { product_id, isArc } = useApp();
    const [uploadedFileAttributes, setUploadedFileAttributes] = useState<any>();

    const {
        uploadFile,
        templateLink,
        getTemplate,
        uploadedFileResponse,
        processFileResponse,
        lastBulkUpload,
    } = useBulkUpload({
        typeId,
    });

    const isFileUploaded = useMemo(
        () => !IsEmptyObject(uploadedFileAttributes),
        [uploadedFileAttributes]
    );

    useUpdateEffect(() => {
        if (IsValidString(templateLink)) {
            window.open(templateLink, '_blank');
        }
    }, [templateLink]);

    return (
        <ModalContainer title={`${name} Bulk Upload`} className='w-full'>
            {!IsEmptyObject(processFileResponse) ? (
                <ProcessingComponent
                    {...{
                        uploadedFileResponse,
                        uploadedFileAttributes,
                        processFileResponse,
                    }}
                />
            ) : (
                <>
                    <ModalBody className='gap-2 col-flex modal-background'>
                        {!isFileUploaded && (
                            <div className='flex gap-4 justify-between items-center p-4 rounded shadow bg-base-100'>
                                <p className='text-sm'>
                                    To download template click on the button.
                                </p>
                                <Link
                                    download
                                    href={templateLink || '#'}
                                    target='_blank'
                                >
                                    <Button
                                        onClick={(next) => {
                                            getTemplate(next);
                                        }}
                                        progress
                                        appearance='primary'
                                    >
                                        Download Template
                                    </Button>
                                </Link>
                            </div>
                        )}

                        <div className='gap-4 p-4 rounded shadow col-flex bg-base-100'>
                            {isFileUploaded ? (
                                <>
                                    <p className='text-base font-medium'>
                                        Steps to upload data from file
                                    </p>
                                    <ol className='gap-2 ml-4 text-sm col-flex'>
                                        <li className='list-decimal'>
                                            We analyze data from file
                                        </li>
                                        <li className='list-decimal'>
                                            We process data from a file
                                        </li>
                                        <li className='list-decimal'>
                                            After analyzing and processing the
                                            data, we store it in the database
                                        </li>
                                    </ol>
                                </>
                            ) : (
                                <>
                                    <p className='text-base font-medium'>
                                        How to upload
                                    </p>
                                    <ol className='gap-2 ml-4 text-sm col-flex'>
                                        <li className='list-decimal'>
                                            Download a template
                                        </li>
                                        <li className='list-decimal'>
                                            Add your data to the template (If
                                            using Excel , make sure to export or
                                            save as a .csv )
                                        </li>
                                        <li className='list-decimal'>
                                            Upload it below for processing
                                        </li>
                                    </ol>
                                </>
                            )}
                            {!isFileUploaded && (
                                <CommonFileUploader
                                    accept={{ 'text/csv': ['.xlsx'] }}
                                    source={
                                        product_id === PRODUCT_IDENTIFIER.VENDOR
                                            ? 'vendor'
                                            : 'business'
                                    }
                                    is_multiple={false}
                                    className='items-center justify-center h-[300px] p-6 transition-all border border-dashed rounded cursor-pointer upload-document-raise hover:border-primary bg-base-200/80 col-flex'
                                    onFileUpload={(files) => {
                                        const newFile = files.map((file) => {
                                            return {
                                                document_url: file.serverUrl,
                                                attributes: {
                                                    name: file.name,
                                                    size: file.size,
                                                    type: file.type,
                                                },
                                            };
                                        });

                                        setUploadedFileAttributes(newFile[0]);
                                    }}
                                >
                                    {({ uploading }) => {
                                        return (
                                            <div className='gap-2 py-6 col-flex'>
                                                <Icon
                                                    source={UploadIcon}
                                                    iconColor='text-base-secondary upload-document-raise--icon '
                                                    isSvg
                                                    size={32}
                                                />
                                                <div className='text-sm text-center col-flex'>
                                                    <div className='text-base text-base-primary'>
                                                        Select a file or drag
                                                        and drop here
                                                    </div>
                                                    <div className='text-base-tertiary'>
                                                        Max file size: 5MB
                                                    </div>
                                                </div>
                                                <div className='justify-center w-full row-flex'>
                                                    <Button
                                                        outline
                                                        appearance='primary'
                                                        disabled={uploading}
                                                    >
                                                        {uploading
                                                            ? 'Uploading...'
                                                            : 'Select File'}
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </CommonFileUploader>
                            )}
                        </div>
                        {!isFileUploaded && !IsEmptyObject(lastBulkUpload) && (
                            <div className='flex gap-4 items-center px-4 py-3 text-sm rounded shadow bg-base-100'>
                                <Icon
                                    source={BulkuploadSvgIcon}
                                    isSvg
                                    size={24}
                                />
                                <div>
                                    Last added at{' '}
                                    <span className='font-medium'>
                                        {FormatDisplayDate(
                                            lastBulkUpload?.created_at,
                                            true
                                        )}{' '}
                                    </span>
                                    <span
                                        className='no-underline link'
                                        onClick={() => {}}
                                    >
                                        {lastBulkUpload?.attributes?.name}
                                    </span>
                                </div>
                            </div>
                        )}
                        {isFileUploaded && (
                            <div className='flex justify-between items-center p-4 rounded shadow bg-base-100'>
                                <div className='flex flex-1 gap-2 items-center'>
                                    <Icon
                                        source={FileXSLSvgIcon}
                                        isSvg
                                        size={32}
                                    />
                                    <div className='flex-1 col-flex'>
                                        <Tooltip
                                            message={
                                                uploadedFileAttributes
                                                    ?.attributes?.name
                                            }
                                            align='start'
                                        >
                                            <div>
                                                <Ellipsis className='text-sm font-medium'>
                                                    {
                                                        uploadedFileAttributes
                                                            ?.attributes?.name
                                                    }
                                                </Ellipsis>
                                            </div>
                                        </Tooltip>
                                        <p className='text-xs text-base-tertiary'>
                                            {(
                                                Number(
                                                    uploadedFileAttributes
                                                        ?.attributes?.size || 0
                                                ) / 1024
                                            ).toFixed(2)}{' '}
                                            KB
                                        </p>
                                    </div>
                                </div>{' '}
                                <Link
                                    href={
                                        uploadedFileAttributes?.document_url ||
                                        '#'
                                    }
                                    target='_blank'
                                >
                                    <Button appearance='primary'>
                                        View File
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </ModalBody>
                    {isFileUploaded && (
                        <ModalFooter>
                            <div className='flex gap-2 items-center'>
                                <Button
                                    onClick={() => {
                                        Modal.closeAll();
                                    }}
                                    appearance='error'
                                    outline
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() =>
                                        uploadFile({
                                            files: [uploadedFileAttributes],
                                        } as any)
                                    }
                                    appearance='primary'
                                    wide
                                    outline
                                >
                                    Proceed
                                </Button>
                            </div>
                        </ModalFooter>
                    )}
                </>
            )}
        </ModalContainer>
    );
};

const ProcessingComponent = (props) => {
    const {
        uploadedFileResponse,
        uploadedFileAttributes,
        processFileResponse,
    } = props;
    const { isArc } = useApp();

    const analyzedStats = useMemo(() => {
        if (IsUndefinedOrNull(processFileResponse?.stats?.analysis)) return [];
        const keys = Object?.keys(processFileResponse?.stats?.analysis);
        const value = Object?.values(processFileResponse?.stats?.analysis);

        return keys.map((val, index) => {
            return {
                key: val,
                value: value[index] as number,
            };
        });
    }, [processFileResponse?.stats?.analysis]);

    const errorStats = useMemo(() => {
        if (IsUndefinedOrNull(processFileResponse?.stats?.error)) return [];
        const keys = Object?.keys(processFileResponse?.stats?.error);
        const value = Object?.values(processFileResponse?.stats?.error);

        return keys.map((val, index) => {
            return {
                key: val,
                value: value[index] as number,
            };
        });
    }, [processFileResponse?.stats?.error]);

    const hasError = useMemo(() => {
        const errors = errorStats.filter((val) => val?.value !== 0);
        return !IsEmptyArray(errors);
    }, [errorStats]);

    const loadingState = useMemo(() => {
        if (IsUndefinedOrNull(processFileResponse?.analysed_at)) {
            return 'Analyzing File...';
        }
        if (IsUndefinedOrNull(processFileResponse?.processed_at)) {
            return 'Processing File...';
        }
        return 'Generating Log File...';
    }, [processFileResponse?.analysed_at, processFileResponse?.processed_at]);

    return (
        <ModalBody className='gap-2 col-flex modal-background'>
            {processFileResponse?.processed_at ? (
                <div
                    className={cn(
                        'flex gap-2 items-center px-3 py-2 rounded border border-error bg-error/20 text-error',
                        {
                            'border-success bg-success/20 text-success':
                                !hasError,
                        }
                    )}
                >
                    <Icon
                        source={
                            !hasError
                                ? ConfirmCheckMarkSvgIcon
                                : InfoCircleSvgIcon
                        }
                        isSvg
                        size={24}
                    />
                    <p className='text-sm'>
                        {!hasError
                            ? 'File successfully processed'
                            : `Some of the records are not being processed due to data
                        not being in a suitable format.`}
                    </p>
                </div>
            ) : (
                <div className='flex gap-2 px-3 py-2 rounded border border-info bg-info/20 text-info'>
                    <Icon source={InfoCircleSvgIcon} isSvg size={24} />
                    <p className='text-sm'>
                        Feel free to close this window as we diligently analyze
                        the data file, a task that warrants a bit of time.
                    </p>
                </div>
            )}

            <div className='flex justify-between items-center p-4 w-full text-sm rounded shadow bg-base-100'>
                <div className='col-flex'>
                    <p>Bulk Upload ID</p>
                    <p className='font-medium'>
                        {processFileResponse?.definition?.name ||
                            uploadedFileResponse?.attributes?.name}
                    </p>
                </div>
                <div className='col-flex'>
                    <p>Upload On</p>
                    <p className='font-medium'>
                        {FormatDisplayDate(
                            uploadedFileResponse.created_at,
                            true
                        )}
                    </p>
                </div>
            </div>
            {!IsEmptyObject(processFileResponse?.stats) && (
                <div className='gap-2 col-flex'>
                    <div className='text-sm rounded shadow bg-base-100'>
                        <p className='px-4 py-3 text-sm font-medium'>
                            {processFileResponse?.processed_at
                                ? 'Processed At'
                                : 'Analyzed At'}{' '}
                            File Info
                        </p>
                        <div className='col-flex'>
                            <div className='flex justify-between px-4 py-3 bg-base-200'>
                                <p className='flex-1 font-medium'>
                                    Sheets Name
                                </p>
                                <p className='font-medium text-center'>
                                    No. of Entries
                                </p>
                                {processFileResponse?.processed_at && (
                                    <p className='flex-1 font-medium text-end'>
                                        Record with Error
                                    </p>
                                )}
                            </div>
                            {analyzedStats
                                .filter((val) => val?.key !== 'item category')
                                .map((val) => {
                                    return (
                                        <div
                                            key={`${val?.value}s`}
                                            className='flex items-center px-4 py-3 capitalize'
                                        >
                                            <p className='flex-1'>{val?.key}</p>
                                            <p
                                                onClick={() => {}}
                                                className={cn('text-center ', {
                                                    'table-link':
                                                        val?.value > 0 &&
                                                        !isArc,
                                                })}
                                            >
                                                {val?.value}
                                            </p>

                                            {processFileResponse?.processed_at &&
                                                errorStats?.map((errorVal) => {
                                                    if (
                                                        val?.key ===
                                                        errorVal?.key
                                                    )
                                                        return (
                                                            <p
                                                                key={`${errorVal.value}e`}
                                                                className={cn(
                                                                    'flex-1 text-end ',
                                                                    {
                                                                        'text-error table-link':
                                                                            errorVal.value !==
                                                                                0 &&
                                                                            !isArc,
                                                                    }
                                                                )}
                                                                onClick={() => {
                                                                    // if (
                                                                    //     errorVal?.value >
                                                                    //     0
                                                                    // )
                                                                    //     openBulkUploadItems(
                                                                    //         {
                                                                    //             errors: 'invalid',
                                                                    //             sheet: val?.key?.toLowerCase(),
                                                                    //         }
                                                                    //     );
                                                                }}
                                                            >
                                                                {errorVal.value}
                                                            </p>
                                                        );
                                                })}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
            <div className='flex gap-4 justify-between p-4 rounded shadow bg-base-100'>
                <div className='flex gap-2 items-start'>
                    <Icon source={FileXSLSvgIcon} isSvg size={32} />
                    <div className='col-flex'>
                        <p className='text-sm font-medium max-w-[250px] overflow-hidden overflow-ellipsis'>
                            {uploadedFileAttributes?.attributes.name}
                        </p>
                        <p className='text-xs text-base-tertiary'>
                            {(
                                Number(
                                    uploadedFileAttributes?.attributes.size || 0
                                ) / 1024
                            ).toFixed(2)}{' '}
                            KB
                        </p>
                    </div>
                </div>{' '}
                {processFileResponse?.stats?.log_file ? (
                    <Link
                        target='_blank'
                        href={processFileResponse?.stats?.log_file}
                    >
                        <Button outline className='flex gap-2 items-center'>
                            <ArrowDown size={18} />
                            <span>Download Log File</span>
                        </Button>
                    </Link>
                ) : (
                    <div className='justify-center items-center col-flex'>
                        <Loading type='infinity' color='primary' size='lg' />
                        <p className='-mt-1 text-sm'>{loadingState}</p>
                    </div>
                )}
            </div>
        </ModalBody>
    );
};

export default BulkUploadModal;
