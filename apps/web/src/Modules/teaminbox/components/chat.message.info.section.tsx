import { useTeamInbox } from '../context/teaminbox.context.main';
import { RightSection } from './right.section';

const ChatMessageInfoSection = () => {
    const { currentInboxDetail, isLoading } = useTeamInbox();
    return (
        <div className='hidden col-span-12 h-full rounded-lg lg:block bg-base-100 lg:col-span-2'>
            <RightSection data={currentInboxDetail} isLoading={isLoading} />
        </div>
    );
};

export default ChatMessageInfoSection;
