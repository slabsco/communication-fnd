import { Badge, Loading, NoDataFound, Tooltip } from '@finnoto/design-system';

import { TeamInboxStatusTypeEnum } from '../../broadcast/your-templates/enums/whatsapp.template.category.enum';
import { useTeamInbox } from '../context/teaminbox.context.main';
import { ChatMessageListingMain } from './chat.message.main.listing';
import { MessageChat } from './message.chat.component';

import { RobotSvgIcon } from 'assets';

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
            <ChatMessageListingMain />
            <MessageChat data={currentInboxDetail} />
        </div>
    );
};

export default ChatMessageDetailComponent;

export const team_inbox_status_preference = {
    expired: {
        color: 'bg-error',
        label: 'Expired',
        appearance: 'error',
    },
    only_broadcast: {
        color: 'bg-orange-500',
        label: 'Only Broadcast',
        appearance: 'orange',
    },
    pending: {
        color: 'bg-warning',
        label: 'Pending',
        appearance: 'warning',
    },
    solved: {
        color: 'bg-success',
        label: 'Solved',
        appearance: 'success',
    },
    open: {
        color: 'bg-info',
        label: 'Open',
        appearance: 'info',
    },
};

export const getTeamInboxStatusKey = (data: any) => {
    if (data?.only_broadcast) return 'only_broadcast';
    if (data?.expired_at) return 'expired';
    if (data?.status_id === TeamInboxStatusTypeEnum.PENDING) return 'pending';
    if (data?.status_id === TeamInboxStatusTypeEnum.SOLVED) return 'solved';
    return 'open';
};

export const DisplayTeamInboxStatus = ({
    currentInboxDetail,
}: {
    currentInboxDetail: any;
}) => {
    const statusKey = getTeamInboxStatusKey(currentInboxDetail);
    const statusPref = team_inbox_status_preference[statusKey];

    return (
        <Badge
            label={statusPref.label}
            size='sm'
            appearance={statusPref.appearance as any}
        />
    );
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
