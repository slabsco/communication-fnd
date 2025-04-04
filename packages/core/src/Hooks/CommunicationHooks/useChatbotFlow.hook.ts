import { IsUndefinedOrNull, Modal, Toast } from '@finnoto/design-system';

import { useMutation, useQuery } from '@tanstack/react-query';

import { ChatbotFLowController } from '../../backend/communication/controller/chatbot.flow.controller';
import {
    RefetchGenericListing,
    toastBackendError,
} from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';

export const useChatbotFlow = (id?: number) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: [id, 'flow_detail'],
        enabled: !IsUndefinedOrNull(id),
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: ChatbotFLowController,
                method: 'show',
                methodParams: id,
            });

            if (success) return response;
        },
    });

    const { mutateAsync: addChatBotFlow } = useMutation({
        mutationKey: ['add_flow'],
        mutationFn: async (options: { id: number; name: string }) => {
            const { response, success } = await FetchData({
                className: ChatbotFLowController,
                method: 'create',
                classParams: options,
            });

            Modal.close();
            if (success) return response;
            return toastBackendError(response);
        },
    });

    const { mutateAsync: deleteAction } = useMutation({
        onSuccess: () => {},
        mutationFn: async (id) => {
            const { success, response } = await FetchData({
                className: ChatbotFLowController,
                method: 'remove',
                methodParams: id,
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'Deleted' });
            RefetchGenericListing();
        },
    });

    const updateRawJson = async (data: any) => {
        const loading = Toast.loading({
            description: `Updating...`,
            position: 'top-center',
        });

        const { response, success } = await FetchData({
            className: ChatbotFLowController,
            method: 'updateFlow',
            methodParams: id,
            classParams: {
                data,
            },
        });

        loading.hide();

        if (success) {
            Toast.success({
                description: 'Updated Successfully!!',
                position: 'top-center',
            });
            refetch();
            return response;
        }

        return toastBackendError(response);
    };

    return {
        addChatBotFlow,
        deleteAction,
        updateRawJson,
        data,
        isLoading,
        refetch,
    };
};
