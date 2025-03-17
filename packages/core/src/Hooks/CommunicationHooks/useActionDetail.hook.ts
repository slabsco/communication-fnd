import { IsUndefined, Toast } from '@finnoto/design-system';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ActionDetailsController } from '../../backend/communication/controller/action.details.controller';
import { ActionTypeEnum } from '../../backend/communication/controller/keyword.details.controller';
import { toastBackendError } from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useActionDetail = (type_id?: ActionTypeEnum) => {
    const {
        data: actions,
        isInitialLoading: isActionsLoading,
        refetch: refetchActions,
    } = useQuery({
        enabled: !IsUndefined(type_id),
        queryKey: ['business_actions', type_id],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: ActionDetailsController,
                method: 'list',
                classParams: {
                    limit: 100,
                    type_id,
                },
            });

            if (success) return response?.records;
        },
    });

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
            Toast.success({ description: 'Added Action Successfully' });
            refetchActions();
        },
    });
    const { mutateAsync: deleteAction } = useMutation({
        onSuccess: () => {},
        mutationFn: async (id) => {
            const { success, response } = await FetchData({
                className: ActionDetailsController,
                method: 'remove',
                methodParams: id,
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'Deleted' });
            refetchActions();
        },
    });

    return {
        addAction,
        actions,
        isActionsLoading,
        refetchActions,
        deleteAction,
    };
};
