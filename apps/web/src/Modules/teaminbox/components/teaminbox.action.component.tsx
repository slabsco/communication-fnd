import { FetchData, toastBackendError } from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import { ConfirmUtil } from '@finnoto/design-system';

import DropdownActionButton from '../../../Components/DropdownButton/dropdown.action.button';
import { TeamInboxStatusTypeEnum } from '../../broadcast/your-templates/enums/whatsapp.template.category.enum';
import { addAssignee } from '../add.assignee.form.util';
import {
    RefetchTeamInboxDetail,
    useTeamInbox,
} from '../context/teaminbox.context.main';
import { RefetchTeamInboxListing } from '../hooks/useTeamInboxMessageListing.hook';
import { openAddInbox } from './add.inbox.modal';

const TeamInboxActionComponent = () => {
    const { currentInboxDetail } = useTeamInbox();

    const handleUpdateStatus = async (status_id: TeamInboxStatusTypeEnum) => {
        const { response, success } = await FetchData({
            className: TeamInboxController,
            method: 'changeStatus',
            methodParams: currentInboxDetail?.id,
            classParams: {
                status_id,
            },
        });
        if (success) {
            RefetchTeamInboxDetail();
            RefetchTeamInboxListing();
            return response;
        }

        return toastBackendError(response);
    };

    const updateStatus = (status_id: TeamInboxStatusTypeEnum) => {
        ConfirmUtil({
            isArc: true,
            appearance: 'warning',
            title: 'Update Status',
            message:
                'Are you sure you want to update the status? Changing the status might effect yor chatbot and other related message flows.',
            isReverseAction: true,
            onConfirmPress: () => handleUpdateStatus(status_id),
        });
    };
    return (
        <DropdownActionButton
            hideOnNoAction
            searchable
            size='sm'
            actions={[
                {
                    name: 'Send New Message',
                    action: () => {
                        openAddInbox({
                            callback: async () => {
                                await RefetchTeamInboxListing();
                            },
                        });
                    },
                },
                {
                    name: 'Change Status',
                    expandableActions: [
                        {
                            name: 'Solved',
                            visible:
                                currentInboxDetail?.status_id !==
                                TeamInboxStatusTypeEnum.SOLVED,
                            action: () =>
                                updateStatus(TeamInboxStatusTypeEnum.SOLVED),
                        },
                        {
                            name: 'Pending',
                            visible:
                                currentInboxDetail?.status_id !==
                                TeamInboxStatusTypeEnum.PENDING,
                            action: () =>
                                updateStatus(TeamInboxStatusTypeEnum.PENDING),
                        },
                        {
                            name: 'Open',
                            visible:
                                currentInboxDetail?.status_id !==
                                TeamInboxStatusTypeEnum.OPEN,
                            action: () =>
                                updateStatus(TeamInboxStatusTypeEnum.OPEN),
                        },
                    ],
                },
                {
                    name: 'Change Assignee',
                    action: () => {
                        addAssignee(
                            currentInboxDetail?.id,
                            currentInboxDetail,
                            RefetchTeamInboxDetail
                        );
                    },
                },
            ]}
        />
    );
};

export default TeamInboxActionComponent;
