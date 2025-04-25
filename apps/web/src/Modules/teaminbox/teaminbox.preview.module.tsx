import React from 'react';

import { HOME_ROUTE, useFetchParams } from '@finnoto/core';
import { Breadcrumbs } from '@finnoto/design-system';

import ChatMessageDetailComponent from './components/chat.message.detail.component';
import ChatMessageInfoSection from './components/chat.message.info.section';
import { TeamInboxProvider } from './context/teaminbox.context.main';

const TeamInboxPreviewModule = () => {
    const { id: team_inbox_id } = useFetchParams();

    return (
        <TeamInboxProvider>
            <div className='overflow-hidden gap-6 px-7 py-6 h-content-screen col-flex'>
                <Breadcrumbs
                    title={'Team inbox'}
                    route={[
                        { name: 'Home', link: HOME_ROUTE },
                        { name: 'Team Inbox Preview' },
                    ]}
                />
                <div className='grid overflow-hidden flex-1 grid-cols-9 gap-2 items-center'>
                    <ChatMessageDetailComponent />
                    <ChatMessageInfoSection />
                </div>
            </div>
        </TeamInboxProvider>
    );
};

export default TeamInboxPreviewModule;
