import { IsUndefinedOrNull, Modal, Toast } from '@finnoto/design-system';

import { useMutation, useQuery } from '@tanstack/react-query';

import { ChatbotFLowController } from '../../backend/communication/controller/chatbot.flow.controller';
import {
    RefetchGenericListing,
    toastBackendError,
} from '../../Utils/common.utils';
import { FetchData } from '../useFetchData.hook';
import { useFetchParams } from '../useFetchParams.hook';

export const useChatbotFlow = (id?: number) => {
    const { version_id } = useFetchParams();

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

    const { mutateAsync: addVersion } = useMutation({
        mutationKey: ['add_flow_version', id],
        mutationFn: async (classParams: {
            name: string;
            id?: number;
            raw_react_flow: string;
        }) => {
            const { response, success } = await FetchData({
                className: ChatbotFLowController,
                method: 'createVersion',
                classParams: classParams,
                methodParams: +id,
            });

            Modal.close();

            if (success) {
                Toast.success({
                    description: 'Updated Successfully!!',
                    position: 'top-center',
                });
                refetchVersion();
                return response;
            }

            return toastBackendError(response);
        },
    });

    const {
        data: versionDetail,
        isLoading: versionIsLoading,
        refetch: refetchVersion,
    } = useQuery({
        queryKey: [id, 'version_detail', +version_id],
        enabled: !IsUndefinedOrNull(version_id),
        cacheTime: 0,
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: ChatbotFLowController,
                method: 'showVersion',
                methodParams: version_id,
            });

            if (success) return response;
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
    const { mutateAsync: publishVersion } = useMutation({
        onSuccess: () => {},
        mutationFn: async (id) => {
            const { success, response } = await FetchData({
                className: ChatbotFLowController,
                method: 'publishVersion',
                methodParams: id,
            });

            if (!success) return toastBackendError(response);
            refetchVersion();
            Toast.success({ description: 'Version Published Successfully' });
        },
    });
    const { mutateAsync: assignPublishedVersion } = useMutation({
        mutationFn: async (second_id) => {
            const { success, response } = await FetchData({
                className: ChatbotFLowController,
                method: 'assignPublishedVersion',
                methodParams: second_id,
            });

            if (!success) return toastBackendError(response);
            refetchVersion();
            refetch();
            Toast.success({
                description: 'Successfully !!',
            });
        },
    });
    const { mutateAsync: deleteVersion } = useMutation({
        mutationFn: async (id) => {
            const { success, response } = await FetchData({
                className: ChatbotFLowController,
                method: 'removeVersion',
                methodParams: id,
            });

            if (!success) return toastBackendError(response);
            Toast.success({ description: 'Deleted' });
            return response;
        },
    });

    return {
        addChatBotFlow,
        deleteAction,
        versionDetail,
        versionIsLoading,
        publishVersion,
        deleteVersion,
        addVersion,
        data,
        isLoading,
        assignPublishedVersion,
        refetch,
    };
};
