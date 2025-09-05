'use client';

import { ReactNode } from 'react';

import { useFetchParams } from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    AnimatedTabs,
    cn,
    Conversation,
    FilterProvider,
} from '@finnoto/design-system';

import ChatMessageDetailComponent from './components/chat.message.detail.component';
import ChatMessageListingComponent from './components/ChatMessageListing.component';
import { RightSection } from './components/right.section';
import TogglePanelComponent from './components/toggle.panel.component';
import { TeamInboxProvider } from './context/teaminbox.context.main';
import {
    panelType,
    TeamInboxUiProvider,
    useTeamInboxUi,
} from './context/teaminbox.ui.context.main';
import TeamInboxFilter from './team.inbox.filter';

import { ArcInfoSvgIcon, MessageSvgIcon, NotesSvgIcon } from 'assets';

// 12
const girdMapping: any = {
    left: {
        small: 70, // col-span-1
        big: 400,
        ipad: 200,
    },
    right: {
        small: 0, // col-span-1
        big: 270,
    },
};

const TeamInboxModuleDetail = () => {
    return (
        <TeamInboxContainer>
            <TeamInboxBody />
        </TeamInboxContainer>
    );
};

export const TeamInboxBody = () => {
    const { id: teamInboxId } = useFetchParams();
    const { toggleInboxPanel, isLeftPanelOpen, isRightPanelOpen } =
        useTeamInboxUi();
    return (
        <>
            {/* Card Listing Section */}
            <ToggleHandleContainer type='left' isOpen={isLeftPanelOpen}>
                <ChatMessageListingComponent />
            </ToggleHandleContainer>

            {teamInboxId && (
                <>
                    {/* Middle Chat section */}
                    <AnimatedTabs
                        active='conversation'
                        containerClassName={cn(
                            'overflow-hidden flex-1  gap-1 h-full  col-flex  bg-transparent transition-all'
                        )}
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
                                title: 'Info',
                                key: 'detail',
                                icon: ArcInfoSvgIcon,
                                component: <RightSection />,
                            },
                            {
                                title: 'Notes',
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
                        rightComponent={
                            <div className='hidden mr-2 xl:flex'>
                                <TogglePanelComponent
                                    open={isLeftPanelOpen}
                                    onClick={() => toggleInboxPanel('left')}
                                />
                                <TogglePanelComponent
                                    open={isRightPanelOpen}
                                    direction='right'
                                    onClick={() => toggleInboxPanel('right')}
                                />
                            </div>
                        }
                    />

                    <ToggleHandleContainer
                        type='right'
                        isOpen={isRightPanelOpen}
                    >
                        <RightSection compress />
                    </ToggleHandleContainer>
                </>
            )}
        </>
    );
};

export default TeamInboxModuleDetail;

export const TeamInboxContainer = ({ children }: { children: ReactNode }) => {
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
                <TeamInboxUiProvider>
                    <div className='overflow-hidden gap-1 p-2 h-content-screen col-flex'>
                        <TeamInboxFilter />
                        <div className='flex overflow-hidden flex-1 gap-2 items-center'>
                            {children}
                        </div>
                    </div>
                </TeamInboxUiProvider>
            </TeamInboxProvider>
        </FilterProvider>
    );
};

const ToggleHandleContainer = ({
    isOpen,
    children,
    type,
}: {
    isOpen: boolean;
    children: ReactNode;
    type: panelType;
}) => {
    if (type === 'right') {
        return (
            <div
                className={cn(
                    'hidden overflow-hidden h-full transition-all xl:flex'
                )}
                style={{
                    width: isOpen
                        ? girdMapping[type].big
                        : girdMapping[type].small,
                }}
            >
                {children}
            </div>
        );
    }
    return (
        <div
            className={cn(
                'overflow-hidden h-full transition-all',
                girdMapping[type]?.ipad && `w-[${girdMapping[type]?.ipad}px]`,
                `xl:w-[${girdMapping[type]?.big}px]`
            )}
            style={{
                width: !isOpen && girdMapping[type].small,
            }}
        >
            {children}
        </div>
    );
};
