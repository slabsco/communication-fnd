import { useMemo } from 'react';

import {
    FetchData,
    FormBuilderSubmitType,
    IsEmptyObject,
    IsUndefinedOrNull,
    Navigation,
    toastBackendError,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';

import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useHandleTemplate = (
    id: number,
    options?: { is_duplicate?: boolean }
) => {
    const queryClient = useQueryClient();

    const onSubmit: FormBuilderSubmitType = async (
        value: any,
        { setError }
    ) => {
        const formValue = value;
        if (options?.is_duplicate) formValue.id = undefined;

        const { success, response } = await FetchData({
            className: CommunicationTemplateController,
            method: 'create',
            classParams: formValue,
        });

        if (response?.columns) return setError(response?.columns);
        if (!success) return toastBackendError(response);

        queryClient.invalidateQueries({ queryKey: ['template_detail', id] });
        Navigation.navigate({ url: WHATSAPP_TEMPLATE_LIST_ROUTE });
    };

    const {
        data: response,
        isLoading,
        isFetched = true,
    } = useQuery({
        initialData: {},
        queryKey: ['template_detail', id],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: CommunicationTemplateController,
                method: 'show',
                methodParams: id,
            });
            if (success) return response;
            Promise.reject('');
        },
        enabled: !IsUndefinedOrNull(id),
    });

    const defaultData = useMemo(() => {
        if (IsEmptyObject(response)) return {} as any;
        return ConvertRawApiDataIntoFormSuitable(response);
    }, [response]);

    return {
        onSubmit,
        isLoading,
        defaultData,
        isFetched,
        response,
    };
};
export const ConvertRawApiDataIntoFormSuitable = (apiResponse: any) => {
    return {
        category_id: apiResponse?.category_id,
        language_id: apiResponse?.language_id,
        name: apiResponse.name,
        body: apiResponse.body?.script,
        footer: apiResponse.footer?.script,
        title: apiResponse?.title,
        button_configurations: apiResponse?.button_configurations,
        sample_contents: apiResponse?.sample_contents,
        id: apiResponse?.id,
    };
};
