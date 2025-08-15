import { FetchData, toastBackendError } from '@finnoto/core';
import { ContactController } from '@finnoto/core/src/backend/communication/controller/contact.controller';
import { Functions } from '@finnoto/core/src/Utils/ui.utils';
import { Switch } from '@finnoto/design-system';

import { useMutation } from '@tanstack/react-query';

import {
    RefetchTeamInboxDetail,
    useTeamInbox,
} from '../context/teaminbox.context.main';

const InboxBotMode = () => {
    const { currentInboxDetail } = useTeamInbox();

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
                RefetchTeamInboxDetail();

                return;
            }
            return toastBackendError(response);
        },
    });
    return (
        <Switch
            color='info'
            onChange={(val) => {
                mutateAsync(val);
            }}
            checked={currentInboxDetail?.contact?.is_assigned_to_bot}
        />
    );
};

export default InboxBotMode;
