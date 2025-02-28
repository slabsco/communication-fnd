import axios from 'axios';

import { ObjectDto } from '../backend/Dtos';
import { FileData } from '../Types';
import { IsEmptyArray } from './common.utils';
import { UploadImagesToServer, UploadInterfaceProps } from './upload.utils';

export type FileUploadSource =
    | 'common'
    | 'business'
    | 'vendor'
    | 'document'
    | 'analysable_document'
    | 'public_vendor'
    | 'waUpload';

export interface ProcessUploadDataType
    extends Pick<
        UploadInterfaceProps,
        'onProgressComplete' | 'signal' | 'headers'
    > {
    images: File | File[];
    resolve: any;
    uploadFile: any;
    source?: FileUploadSource;
    endpoint?: string;
    classParams?: ObjectDto;
}
export async function ProcessUploadData({
    images,
    resolve,
    uploadFile,
    source = 'business',
    headers,
    endpoint,
    onProgressComplete,
    signal,
    classParams,
}: ProcessUploadDataType): Promise<FileData[]> {
    let imagesArray: FileData[];

    if (!resolve) {
        return new Promise((newResolve) => {
            resolve = newResolve;
        });
    }

    if (!Array.isArray(images)) {
        imagesArray = [images];
    } else {
        imagesArray = images;
    }

    // uri is standard property of image object
    // imagesArray
    //     .filter((image) => !IsEmptyObject(image))
    //     .map((image) => (image.uri = image.path || image.uri));

    if (IsEmptyArray(imagesArray)) {
        resolve([]);
    }

    if (!uploadFile) {
        resolve(imagesArray);
        return imagesArray;
    }

    const result = await UploadImagesToServer({
        files: imagesArray as File[],
        source,
        headers,
        endpoint,
        onProgressComplete,
        signal,
        classParams,
    });
    // since server is expected to return an array always,
    // hence if not valid array
    if (IsEmptyArray(result)) {
        // resolve empty array response
        if (typeof resolve == 'function') return resolve([]);
        return [];
    }

    console.log({ result });

    // attach serverUrl property to each image object
    result.forEach((imageUrl, index) => {
        imagesArray[index].id = imageUrl.id;
        imagesArray[index].serverUrl = imageUrl.serverUrl;
    });

    if (typeof resolve == 'function') resolve(imagesArray);

    return imagesArray;
}
