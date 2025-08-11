import { useState } from 'react';
import { useUpdateEffect } from 'react-use';

import { useMutation, useQuery } from '@tanstack/react-query';

import { LISTING_CONTROLLER_ROUTER } from '../../Constants';
import {
    IsUndefinedOrNull,
    RefetchGenericListing,
} from '../../Utils/common.utils';
import { useCustomQueryDetail } from '../useCustomQueryDetail.hook';
import { FetchData } from '../useFetchData.hook';

const className = LISTING_CONTROLLER_ROUTER.bulk_uploads;
type FileProcessedType = 'success' | 'error';

export const useBulkUpload = ({ typeId }: { typeId?: number }) => {
    // once the file is uploaded then the state will be saved here
    const [uploadedFileResponse, setUploadedFileResponse] = useState(undefined);

    // this will save the file processedAt data response
    const [processFileResponse, setProcessFileResponse] = useState(undefined);

    // if the file Processing is complete then the success and error status of the file will be save in this state
    const [fileProcessStatus, setFileProcessStatus] =
        useState<FileProcessedType>(undefined);

    // Getting Template url
    const { data: templateLink, mutate: getTemplate } = useMutation({
        mutationKey: ['getTemplate', typeId],
        mutationFn: async (next: () => void = () => {}) => {
            const { success, response } = await FetchData({
                className,
                method: 'getTemplate',
                methodParams: typeId,
            });

            if (success) {
                next();
                return response.file;
            }
            throw new Error('Something went wrong....');
        },
    });

    // Getting Last Bulk upload record
    // const { data: lastBulkUpload } = useQuery({
    //     queryKey: ['lastBulkUpload', typeId],
    //     queryFn: async () => {
    //         const { success, response } = await FetchData({
    //             className,
    //             method: 'list',
    //             classParams: {
    //                 limit: 1,
    //                 type_id: typeId,
    //             },
    //         });
    //         if (success) {
    //             return response.records[0];
    //         }
    //         throw new Error('Something went wrong....');
    //     },
    // });
    const { data: lastBulkUpload } = useCustomQueryDetail({
        type: 'bulk_uploads',
        methodParams: typeId,
        method: 'lastRecord',
    });

    // Uploading the file
    const { isSuccess: isFileUploaded, mutate: uploadFile } = useMutation({
        onSuccess: (data: any) => {
            setUploadedFileResponse(data);
            processFile(data?.id);
        },
        mutationFn: async (file) => {
            const { success, response } = await FetchData({
                className,
                method: 'set',
                methodParams: typeId,
                classParams: file,
            });
            if (success) {
                return response;
            }
            throw new Error('Sorry! File was not uploaded...');
        },
    });

    // Checking if the file has been processed or not
    const { mutate: processFile } = useMutation({
        onSuccess: (data) => {
            setProcessFileResponse(data);
        },
        mutationFn: async (id) => {
            const { success, response } = await FetchData({
                className,
                method: 'show',
                methodParams: id,
            });

            if (success) {
                RefetchGenericListing();
                return response;
            }
            throw new Error('Something went wrong...');
        },
    });

    // fetching continuously until the file is processed
    useUpdateEffect(() => {
        if (
            isFileUploaded &&
            (IsUndefinedOrNull(processFileResponse?.stats?.log_file) ||
                IsUndefinedOrNull(processFileResponse?.processed_at))
        ) {
            const refetchProcessFile = setTimeout(
                () => processFile(uploadedFileResponse?.id),
                3000
            );
            // if the user close the modal the api request and all process will be destroyed.
            return () => {
                clearTimeout(refetchProcessFile);
            };
        }
        setFileProcessStatus('success');
    }, [processFileResponse]);

    return {
        uploadFile,
        templateLink,
        isFileUploaded,
        fileProcessStatus,
        uploadedFileResponse,
        processFileResponse,
        lastBulkUpload,
        getTemplate,
    };
};

export const useBulkUploadDetail = ({
    typeId,
    id,
}: {
    typeId?: number;
    id: number;
}) => {
    const { data: bulkUploadData, isInitialLoading } = useQuery({
        queryKey: ['getDetail', typeId, id],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className,
                method: 'show',
                methodParams: id,
            });

            if (success) {
                return response;
            }
            throw new Error('Something went wrong...');
        },
    });

    return {
        bulkUploadData,
        isLoading: isInitialLoading,
    };
};
