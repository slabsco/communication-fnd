import { FetchData, toastBackendError, useQueryClient } from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Badge,
    ConfirmUtil,
    Loading,
    NoDataFound,
    Tooltip,
} from '@finnoto/design-system';

import DropdownActionButton from '../../../Components/DropdownButton/dropdown.action.button';
import { TeamInboxStatusTypeEnum } from '../../broadcast/your-templates/enums/whatsapp.template.category.enum';
import { useTeamInbox } from '../context/teaminbox.context.main';
import { ChatMessageListingMain } from './chat.message.main.listing';
import { MessageChat } from './message.chat.component';

import { EyeSvgIcon, RobotSvgIcon } from 'assets';

const ChatMessageDetailComponent = () => {
    const { currentInboxDetail, isLoading } = useTeamInbox();

    if (!currentInboxDetail || isLoading)
        return (
            <div className='col-span-7 centralize'>
                {isLoading ? (
                    <Loading size='lg' type='spinner' color='primary' />
                ) : (
                    <NoDataFound />
                )}
            </div>
        );
    return (
        <div className='overflow-hidden h-full col-flex'>
            <ChatHeader currentInboxDetail={currentInboxDetail} />
            <ChatMessageListingMain />
            <MessageChat data={currentInboxDetail} />
        </div>
    );
};

export default ChatMessageDetailComponent;

const ChatHeader = ({ currentInboxDetail }: { currentInboxDetail: any }) => {
    const query = useQueryClient();

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
            query.invalidateQueries({
                queryKey: ['team_inbox_detail', currentInboxDetail.id],
            });
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
        <div className='flex overflow-hidden gap-2 justify-between items-center px-3 py-2 bg-base-100'>
            <p className='flex gap-3 items-center'>
                <DisplayTeamInboxStatus
                    currentInboxDetail={currentInboxDetail}
                />
                {currentInboxDetail?.assignee?.user?.name && (
                    <Badge
                        label={currentInboxDetail?.assignee?.user?.name}
                        size='sm'
                        appearance='secondary'
                        lefticon={EyeSvgIcon}
                    />
                )}

                {currentInboxDetail?.contact?.is_assigned_to_bot && (
                    <Tooltip message='Bot mode is activated on this chat'>
                        <div>
                            <Badge
                                label={''}
                                lefticon={RobotSvgIcon}
                                size='sm'
                                appearance='accent'
                            />
                        </div>
                    </Tooltip>
                )}
            </p>

            {!currentInboxDetail?.expired_at && (
                <DropdownActionButton
                    buttonName='Change Status'
                    actions={[
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
                    ]}
                />
            )}
        </div>
    );
};

export const DisplayTeamInboxStatus = ({
    currentInboxDetail,
}: {
    currentInboxDetail: any;
}) => {
    if (currentInboxDetail?.only_broadcast)
        return <Badge label={'Only Broadcast'} size='sm' appearance='orange' />;
    if (currentInboxDetail?.expired_at)
        return <Badge label={'Expired'} size='sm' appearance='error' />;
    if (currentInboxDetail?.status_id === TeamInboxStatusTypeEnum.PENDING)
        return <Badge label={'Pending'} size='sm' appearance='warning' />;
    if (currentInboxDetail?.status_id === TeamInboxStatusTypeEnum.SOLVED)
        return <Badge label={'Solved'} size='sm' appearance='success' />;

    return <Badge label={'Open'} size='sm' appearance='info' />;
};
