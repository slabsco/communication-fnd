import { Badge, Loading, NoDataFound, Tooltip } from '@finnoto/design-system';

import { TeamInboxStatusTypeEnum } from '../../broadcast/your-templates/enums/whatsapp.template.category.enum';
import { useTeamInbox } from '../context/teaminbox.context.main';
import { ChatMessageListingMain } from './chat.message.main.listing';
import { MessageChat } from './message.chat.component';

import { EyeSvgIcon, RobotSvgIcon } from 'assets';

const ChatMessageDetailComponent = () => {
    const { currentInboxDetail, isLoading } = useTeamInbox();

    if (!currentInboxDetail || isLoading)
        return (
            <div className='h-full centralize'>
                {isLoading ? (
                    <Loading size='lg' type='spinner' color='primary' />
                ) : (
                    <NoDataFound />
                )}
            </div>
        );
    return (
        <div className='overflow-hidden gap-1 h-full col-flex'>
            {/* <ChatHeader currentInboxDetail={currentInboxDetail} /> */}
            <ChatMessageListingMain />
            <MessageChat data={currentInboxDetail} />
        </div>
    );
};

export default ChatMessageDetailComponent;

const ChatHeader = ({ currentInboxDetail }: { currentInboxDetail: any }) => {
    return (
        <div className='flex overflow-hidden gap-2 justify-between items-center px-3 py-2 bg-base-100'>
            <p className='flex gap-3 items-center'>
                <DisplayTeamInboxStatus
                    currentInboxDetail={currentInboxDetail}
                />
                {currentInboxDetail?.assignee?.user?.name && (
                    <Tooltip
                        message={`Chat is assign to ${currentInboxDetail?.assignee?.user?.name}`}
                    >
                        <div>
                            <Badge
                                label={currentInboxDetail?.assignee?.user?.name}
                                size='sm'
                                appearance='secondary'
                                lefticon={EyeSvgIcon}
                            />
                        </div>
                    </Tooltip>
                )}
                <AssignedToBotStatus
                    is_assigned_to_bot={
                        currentInboxDetail?.contact?.is_assigned_to_bot
                    }
                />
            </p>
        </div>
    );
};

export const DisplayTeamInboxStatus = ({
    currentInboxDetail,
}: {
    currentInboxDetail: any;
}) => {
    if (currentInboxDetail?.expired_at)
        return <Badge label={'Expired'} size='sm' appearance='error' />;
    if (currentInboxDetail?.only_broadcast)
        return <Badge label={'Only Broadcast'} size='sm' appearance='orange' />;
    if (currentInboxDetail?.status_id === TeamInboxStatusTypeEnum.PENDING)
        return <Badge label={'Pending'} size='sm' appearance='warning' />;
    if (currentInboxDetail?.status_id === TeamInboxStatusTypeEnum.SOLVED)
        return <Badge label={'Solved'} size='sm' appearance='success' />;

    return <Badge label={'Open'} size='sm' appearance='info' />;
};

export const AssignedToBotStatus = ({
    is_assigned_to_bot,
}: {
    is_assigned_to_bot: boolean;
}) => {
    if (!is_assigned_to_bot) return;
    return (
        <Tooltip message='Bot mode is activated on this chat'>
            <div>
                <Badge
                    label={''}
                    lefticon={RobotSvgIcon}
                    size='sm'
                    appearance='info'
                />
            </div>
        </Tooltip>
    );
};
