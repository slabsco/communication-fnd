import { useTeamInbox } from '../context/teaminbox.context.main';
import { ChatMessageListingMain } from './chat.message.main.listing';
import { MessageChat } from './message.chat.component';

const ChatMessageDetailComponent = () => {
    const { currentInboxDetail } = useTeamInbox();
    return (
        <div className='overflow-hidden col-span-12 gap-4 h-full lg:col-span-7 col-flex'>
            {/* <div className='flex gap-2 items-center px-3 py-2 rounded bg-base-100'>
                something at top
            </div> */}
            <ChatMessageListingMain />
            <MessageChat data={currentInboxDetail} />
        </div>
    );
};

export default ChatMessageDetailComponent;
