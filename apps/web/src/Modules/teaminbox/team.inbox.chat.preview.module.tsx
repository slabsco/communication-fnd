'use client';

import { Badge } from '@finnoto/design-system';

import { ChatMessageListingMain } from './components/chat.message.main.listing';
import { TeamInboxProvider } from './context/teaminbox.context.main';

const TeamInboxChatPreviewModule = () => {
    return (
        <TeamInboxProvider>
            <div className='overflow-hidden relative rounded h-content-screen'>
                <div className='absolute top-0 left-1/2 z-10 mt-2 -translate-x-1/2'>
                    <Badge label={'Preview Mode'} solid appearance='warning' />
                </div>
                <div className='overflow-hidden gap-1 h-full col-flex'>
                    <ChatMessageListingMain />
                </div>
            </div>
        </TeamInboxProvider>
    );
};

export default TeamInboxChatPreviewModule;
