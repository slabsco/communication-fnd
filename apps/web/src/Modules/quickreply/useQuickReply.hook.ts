import React from 'react';

import { FetchData } from '@finnoto/core';
import { QuickReplyController } from '@finnoto/core/src/backend/communication/controller/quick.reply.controller';
import { Toast } from '@finnoto/core/src/Utils/toast.utils';

import { useMutation } from '@tanstack/react-query';

export const useQuickReplyHook = (options?: { baseRefetchFn?: () => void }) => {
    const { mutate: deleteQuickReply } = useMutation({
        mutationFn: async (id) => {
            const { response, success } = await FetchData({
                className: QuickReplyController,
                method: 'remove',
                methodParams: id,
            });

            if (!success) return;
            Toast.success({ description: 'Quick Reply Deleted' });
            options?.baseRefetchFn?.();
        },
    });

    return { deleteQuickReply };
};
