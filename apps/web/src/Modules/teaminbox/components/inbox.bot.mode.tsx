import { FetchData, toastBackendError } from '@finnoto/core';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import { Functions } from '@finnoto/core/src/Utils/ui.utils';
import { Switch } from '@finnoto/design-system';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useTeamInbox } from '../context/teaminbox.context.main';

const InboxBotMode = () => {
    const { currentInboxDetail } = useTeamInbox();
    const query = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: async (is_assigned_to_bot: boolean) => {
            const { hide: hideLoading = () => {} } = Functions.toastLoading({
                description: 'Please wait. Changing Mode...',
            });
            const { success, response } = await FetchData({
                className: ContactController,
                method: 'botMode',
                methodParams: currentInboxDetail?.contact?.id,
                classParams: {
                    is_assigned_to_bot,
                },
            });
            hideLoading();
            if (success) {
                query.invalidateQueries({
                    queryKey: ['team_inbox_detail', currentInboxDetail.id],
                });

                return;
            }
            return toastBackendError(response);
        },
    });
    return (
        <Switch
            onChange={(val) => {
                mutateAsync(val);
            }}
            checked={currentInboxDetail?.contact?.is_assigned_to_bot}
        />
    );
};

export default InboxBotMode;
