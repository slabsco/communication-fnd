import { ObjectDto } from '../backend/Dtos';
import { PRODUCT_IDENTIFIER } from '../Constants';
import { user } from '../Models/User';
import { IsEmptyArray, IsEmptyObject } from './common.utils';
import { Post } from './http.utils';
import { Toast } from './toast.utils';

export interface FILE {
    uri: string;
    fileName?: string;
    name?: string;
    type?: string;
}

export interface UploadInterfaceProps {
    files: File[] | File;
    source?:
        | 'common'
        | 'business'
        | 'vendor'
        | 'document'
        | 'analysable_document'
        | 'public_vendor'
        | 'waUpload';
    sourceId?: number;
    endpoint?: string;
    headers?: { [x: string]: string };
    classParams?: ObjectDto;
    onProgressComplete?: (percentage: number) => void;
    signal?: any;
}

export async function UploadImagesToServer({
    files,
    source: propSource = 'business',
    endpoint: propEndpoint,
    headers: uploadHeaders = {},
    onProgressComplete,
    signal,
    classParams,
}: UploadInterfaceProps) {
    const endpoint = {
        common: 'api/upload-files',
        business: 'api/b/upload-files',
        waUpload: 'api/b/business-details/upload-file',
        vendor: 'api/v/upload-files',
        document: 'api/b/document-upload',
        analysable_document: 'api/b/document-upload/analyse',
        public_vendor: 'p/business-vendor/upload-files',
    };

    const product_id = user.getProductId();

    let source =
        product_id === PRODUCT_IDENTIFIER.VENDOR ? 'vendor' : propSource;

    if (!Array.isArray(files)) {
        files = [files];
    }

    const headers = { 'Content-Type': 'multipart/form-data', ...uploadHeaders };
    const payload = new FormData();

    if (!IsEmptyObject(classParams)) {
        Object.entries(classParams).forEach(([key, value]) => {
            payload.append(key, value);
        });
    }

    (files as File[]).forEach((file) => {
        payload.append('file', file as unknown as Blob);
    });

    if (source === 'analysable_document' && files.length > 1) {
        source = 'document';
    }

    const result = await Post({
        url: propEndpoint || endpoint[source],
        headers,
        data: payload,
        onProgressComplete,
        signal,
    });

    const uploadedImages: any = [];
    if (!IsEmptyObject(result) && !IsEmptyArray(result.data)) {
        if (source === 'analysable_document') {
            result.data.forEach((item: any) => {
                const img: any = {};
                img.id = item.id;
                img.serverUrl = item.document_url;
                uploadedImages.push(img);
            });
        } else {
            result.data.forEach((item: any) => {
                const img: any = {};
                img.serverUrl = item;
                uploadedImages.push(img);
            });
        }
    }
    if (!result?.success && result?.data?.message) {
        Toast.error({ description: result?.data?.message });
    }
    return uploadedImages;
}
