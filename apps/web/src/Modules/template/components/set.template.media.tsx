import { FetchData } from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { InputField, IsEmptyObject, SelectBox } from '@finnoto/design-system';
import { SingleFileUploader } from '@finnoto/design-system/src/Composites/Uploader/Components/SingleFile.upload.component copy';

import { toastBackendErrorModal } from '../../../Utils/functions.utils';
import { useTemplate } from '../template.context';

const FILE_TYPE_CONFIGS = {
    IMAGE: {
        accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
        supportText: 'PNG, JPG, JPEG',
        maxSize: 5 * 1024 * 1024, // 5MB
    },
    VIDEO: {
        accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv'] },
        supportText: 'MP4, MOV, AVI, MKV',
        maxSize: 16 * 1024 * 1024, // 16MB
    },
    DOCUMENT: {
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
            'application/vnd.ms-excel': ['.xls', '.xlsx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
            'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                ['.pptx'],
            'application/zip': ['.zip'],
            'application/x-rar-compressed': ['.rar'],
            'application/vnd.oasis.opendocument.text': ['.odt'],
            'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
            'application/vnd.oasis.opendocument.presentation': ['.odp'],
            'text/plain': ['.txt'],
            'application/json': ['.json'],
            'application/xml': ['.xml'],
            'application/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
                ['.dotx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
                ['.xltx'],
            'application/vnd.openxmlformats-officedocument.presentationml.template':
                ['.potx'],
        },
        supportText:
            'PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, ODT, ODS, ODP, TXT, JSON, XML, CSV',
        maxSize: 10 * 1024 * 1024, // 10MB
    },
} as const;

const MEDIA_FORMAT_OPTIONS = [
    { label: 'None', value: undefined },
    { label: 'Text', value: 'TEXT' },
    { label: 'Image', value: 'IMAGE' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Document', value: 'DOCUMENT' },
    // { label: 'Location', value: 'LOCATION' },
] as const;

const SetTemplateMedia = () => {
    const { dispatch, state } = useTemplate();

    const { format, text, example } =
        state.components.find((_val) => _val?.type === 'HEADER') || {};

    const { header_media_detail } = state || {};
    const { dynamic_media } = header_media_detail || {};

    const handleFormatChange = (option: any) => {
        if (!option?.value) {
            dispatch({
                type: 'REMOVE_COMPONENT',
                payload: 'HEADER',
            });
            return;
        }
        dispatch({
            type: 'UPDATE_HEADER',
            payload: {
                format: option?.value,
                text: undefined,
            },
        });

        dispatch({
            type: 'UPDATE_HEADER_MEDIA',
            payload: undefined,
        });
    };

    const handleTextChange = (value: string) => {
        dispatch({
            type: 'UPDATE_HEADER',
            payload: {
                text: value,
            },
        });
    };

    const renderMediaUploader = () => {
        if (
            !format ||
            !FILE_TYPE_CONFIGS[format as keyof typeof FILE_TYPE_CONFIGS]
        )
            return null;

        const config =
            FILE_TYPE_CONFIGS[format as keyof typeof FILE_TYPE_CONFIGS];

        return (
            <RenderDocumentField
                accept={config.accept}
                fileSupportText={config.supportText}
                maxSize={config.maxSize}
            />
        );
    };

    return (
        <div className='gap-3 mt-6 col-flex'>
            <div className='flex gap-3 items-end'>
                <SelectBox
                    width={200}
                    value={format}
                    size='sm'
                    label='Media sample'
                    onChange={(e) => {
                        handleFormatChange(e);
                    }}
                    options={MEDIA_FORMAT_OPTIONS as any}
                    isDisabled={!IsEmptyObject(state?.header_media_detail)}
                />
                {['IMAGE', 'VIDEO', 'DOCUMENT'].includes(format) &&
                    !header_media_detail?.document_url && (
                        <>
                            <span className='justify-center items-center text-base font-medium'>
                                With
                            </span>
                            <SelectBox
                                label='Variable'
                                width={200}
                                value={dynamic_media?.enabled}
                                size='sm'
                                onChange={(e) => {
                                    if (e?.value) {
                                        dispatch({
                                            type: 'UPDATE_HEADER_MEDIA',
                                            payload: {
                                                dynamic_media: {
                                                    enabled: e?.value,
                                                },
                                            },
                                        });
                                    } else {
                                        dispatch({
                                            type: 'UPDATE_HEADER_MEDIA',
                                            payload: undefined,
                                        });
                                    }
                                }}
                                options={[
                                    { label: 'No', value: false },
                                    { label: 'Yes', value: true },
                                ]}
                            />
                        </>
                    )}
            </div>

            {format === 'TEXT' && (
                <InputField
                    className='w-full'
                    label='Header'
                    value={text}
                    placeholder='Add a sort line of text to the header of your message in English'
                    onChange={(e) => handleTextChange(e)}
                />
            )}

            {!dynamic_media?.enabled && renderMediaUploader()}
        </div>
    );
};

export default SetTemplateMedia;

interface RenderDocumentFieldProps {
    accept: any;
    fileSupportText: string;
    maxSize: number;
}

const RenderDocumentField = ({
    accept,
    fileSupportText,
    maxSize,
}: RenderDocumentFieldProps) => {
    const { dispatch, state } = useTemplate();
    const { header_media_detail } = state;

    const handleMediaUpload = async (file: any) => {
        if (!file) return;

        try {
            const uploadToFb = await uploadToFacebook(file?.document_url);

            dispatch({
                type: 'UPDATE_HEADER_MEDIA',
                payload: file,
            });

            dispatch({
                type: 'UPDATE_HEADER',
                payload: {
                    example: {
                        header_handle: [uploadToFb?.['h']],
                    },
                },
            });
        } catch (error) {
            console.error('Error uploading media:', error);
            toastBackendErrorModal('Failed to upload media');
        }
    };

    const handleRemoveMedia = () => {
        dispatch({
            type: 'UPDATE_HEADER_MEDIA',
            payload: undefined,
        });

        dispatch({
            type: 'UPDATE_HEADER',
            payload: {
                example: {},
            },
        });
    };

    return (
        <SingleFileUploader
            value={header_media_detail ? [header_media_detail] : []}
            onFileUpload={(data: any) => {
                if (!data?.length) return handleRemoveMedia();
                handleMediaUpload(data[0]);
            }}
            accept={accept}
            fileSupportText={fileSupportText}
            maxSize={maxSize}
        />
    );
};

export const uploadToFacebook = async (url: string) => {
    const { response, success } = await FetchData({
        className: CommunicationTemplateController,
        method: 'uploadToFacebook',
        classParams: { url },
    });

    if (success) return response;
    toastBackendErrorModal(response);
    throw new Error('Upload failed');
};
