import { Toast } from '@finnoto/design-system';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { KeywordDetailsController } from '../../backend/communication/controller/keyword.details.controller';
import { CreateKeywordDetailDto } from '../../backend/communication/dto/create.keyword.detail.dto';
import {
    RefetchGenericListing,
    toastBackendError,
} from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useKeywordAction = () => {
    const invalidate = useQueryClient();

    const { mutateAsync: addKeyword } = useMutation({
        onSuccess: () => {},
        mutationKey: ['add-keyword'],
        mutationFn: async (values: CreateKeywordDetailDto) => {
            const { success, response } = await FetchData({
                className: KeywordDetailsController,
                method: 'create',
                classParams: values,
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'Added Keyword Successfully' });
            return response;
        },
    });

    const { mutateAsync: deleteKeyword } = useMutation({
        onSuccess: () => {
            RefetchGenericListing();
        },
        mutationKey: ['delete-keyword'],
        mutationFn: async (id: number) => {
            const { success, response } = await FetchData({
                className: KeywordDetailsController,
                method: 'remove',
                methodParams: id,
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'Keyword Deleted Successfully!!' });
        },
    });

    return { addKeyword, deleteKeyword };
};
