'use client';

import { ReactNode } from 'react';

import { useFetchParams } from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    AnimatedTabs,
    Conversation,
    FilterProvider,
} from '@finnoto/design-system';

import ChatMessageDetailComponent from './components/chat.message.detail.component';
import ChatMessageListingComponent from './components/ChatMessageListing.component';
import { RightSection } from './components/right.section';
import { TeamInboxProvider } from './context/teaminbox.context.main';
import TeamInboxFilter from './team.inbox.filter';

import { ArcInfoSvgIcon, MessageSvgIcon, NotesSvgIcon } from 'assets';

const TeamInboxModuleDetail = () => {
    const { id: teamInboxId } = useFetchParams();

    return (
        <Container>
            <ChatMessageListingComponent />
            <AnimatedTabs
                active='conversation'
                containerClassName='overflow-hidden col-span-12 gap-1 h-full lg:col-span-9 col-flex overflow-hidden bg-transparent'
                querykey='inside_tab'
                contentContainerClass='flex-1 overflow-hidden p-0 h-full bg-transparent'
                tabs={[
                    {
                        title: 'Conversation',
                        key: 'conversation',
                        component: <ChatMessageDetailComponent />,
                        icon: MessageSvgIcon,
                    },
                    {
                        title: 'Detail',
                        key: 'detail',
                        icon: ArcInfoSvgIcon,
                        component: <RightSection />,
                    },
                    {
                        title: 'Notes / Documents',
                        key: 'notes',
                        icon: NotesSvgIcon,
                        component: (
                            <Conversation
                                id={teamInboxId}
                                controller={TeamInboxController}
                                className='p-3'
                            />
                        ),
                    },
                ]}
            />
        </Container>
    );
};

export default TeamInboxModuleDetail;

const Container = ({ children }: { children: ReactNode }) => {
    return (
        <FilterProvider
            name={'Team Inbox'}
            definitionKey={'team_inbox'}
            disableNav={false}
            filters={[
                {
                    title: 'Status',
                    controller_type: 'lookup',
                    key: 'status_ids',
                    type: 'multi_select',
                    methodParams: 1111,
                },
                {
                    title: 'Assignee To',
                    controller_type: 'business_users',
                    subLabelKey: 'email',
                    key: 'assignee_ids',
                    type: 'multi_select',
                },
            ]}
        >
            <TeamInboxProvider>
                <div className='overflow-hidden gap-1 p-2 h-content-screen col-flex'>
                    <TeamInboxFilter />
                    <div className='grid overflow-hidden flex-1 grid-cols-12 gap-2 items-center'>
                        {children}
                    </div>
                </div>
            </TeamInboxProvider>
        </FilterProvider>
    );
};
