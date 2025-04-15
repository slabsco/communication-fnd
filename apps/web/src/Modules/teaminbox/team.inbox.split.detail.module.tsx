'use client';

import { ReactNode } from 'react';

import { HOME_ROUTE, useFetchParams } from '@finnoto/core';
import { Breadcrumbs, PageLoader } from '@finnoto/design-system';

import ChatMessageDetailComponent from './components/chat.message.detail.component';
import ChatMessageInfoSection from './components/chat.message.info.section';
import ChatMessageListingComponent from './components/ChatMessageListing.component';
import { TeamInboxProvider } from './context/teaminbox.context.main';

const TeamInboxModuleDetail = () => {
    const { id: team_inbox_id } = useFetchParams();
    return (
        <Container>
            <ChatMessageListingComponent />
            {!team_inbox_id ? (
                <div className='col-span-9'>
                    <PageLoader />
                </div>
            ) : (
                <>
                    <ChatMessageDetailComponent />
                    <ChatMessageInfoSection />
                </>
            )}
        </Container>
    );
};

export default TeamInboxModuleDetail;

const Container = ({ children }: { children: ReactNode }) => {
    return (
        <TeamInboxProvider>
            <div className='overflow-hidden gap-6 px-7 py-6 h-content-screen col-flex'>
                <Breadcrumbs
                    title={'Team inbox'}
                    route={[
                        { name: 'Home', link: HOME_ROUTE },
                        { name: 'Team Inbox' },
                    ]}
                />
                <div className='grid overflow-hidden flex-1 grid-cols-12 gap-2 items-center'>
                    {children}
                </div>
            </div>
        </TeamInboxProvider>
    );
};
