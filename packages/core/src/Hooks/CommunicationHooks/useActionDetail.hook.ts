import { Toast } from '@finnoto/design-system';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ActionDetailsController } from '../../backend/communication/controller/action.details.controller';
import { toastBackendError } from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useActionDetail = () => {
    const invalidate = useQueryClient();

    const { mutateAsync: addAction } = useMutation({
        onSuccess: () => {},
        mutationKey: ['add-action'],
        mutationFn: async (values) => {
            const { success, response } = await FetchData({
                className: ActionDetailsController,
                method: 'create',
                classParams: values,
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'Added Keyword Successfully' });
        },
    });

    return { addAction };
};
