'use client';

import { ReactNode } from 'react';

import { HOME_ROUTE } from '@finnoto/core';
import {
    AnimatedTabs,
    Breadcrumbs,
    FilterProvider,
} from '@finnoto/design-system';

import ChatMessageDetailComponent from './components/chat.message.detail.component';
import ChatMessageListingComponent from './components/ChatMessageListing.component';
import { RightSection } from './components/right.section';
import { TeamInboxProvider } from './context/teaminbox.context.main';
import TeamInboxFilter from './team.inbox.filter';

import { ArcInfoSvgIcon, MessageSvgIcon } from 'assets';

const TeamInboxModuleDetail = () => {
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
                <div className='overflow-hidden gap-1 px-7 py-6 h-content-screen col-flex'>
                    <Breadcrumbs
                        title={'Team inbox'}
                        route={[
                            { name: 'Home', link: HOME_ROUTE },
                            { name: 'Team Inbox' },
                        ]}
                    />
                    <TeamInboxFilter />
                    <div className='grid overflow-hidden flex-1 grid-cols-12 gap-2 items-center'>
                        {children}
                    </div>
                </div>
            </TeamInboxProvider>
        </FilterProvider>
    );
};
