import InfiniteScroll from 'react-infinite-scroll-component';

import { useFetchParams } from '@finnoto/core';
import {
    Avatar,
    Badge,
    cn,
    FormatDisplayDateStyled,
    HoverCard,
    Loading,
} from '@finnoto/design-system';

import { useTeamInboxUi } from '../context/teaminbox.ui.context.main';
import { useTeamInboxMessageListing } from '../hooks/useTeamInboxMessageListing.hook';
import { navigateToTeamInboxDetail } from '../utils/teaminbox.utils';
import {
    AssignedToBotStatus,
    DisplayTeamInboxStatus,
    getTeamInboxStatusKey,
    team_inbox_status_preference,
} from './chat.message.detail.component';

const ChatMessageListingComponent = () => {
    const {
        flatData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchMessage,
    } = useTeamInboxMessageListing();

    return (
        <div className='overflow-hidden w-full h-full col-flex bg-base-100'>
            <div
                className='overflow-y-auto flex-1 p-1 scrollbar-xs'
                id='scrollableDiv'
            >
                <InfiniteScroll
                    dataLength={flatData.length}
                    next={fetchNextPage}
                    hasMore={hasNextPage ?? false}
                    loader={
                        isFetchingNextPage && (
                            <div className='centralize'>
                                <Loading
                                    size='lg'
                                    color='primary'
                                    type='infinity'
                                />
                            </div>
                        )
                    }
                    endMessage={
                        <p className='mt-3 text-center text-base-secondary'>
                            {isLoading ? (
                                <div className='centralize'>
                                    <Loading
                                        size='lg'
                                        color='primary'
                                        type='infinity'
                                    />
                                </div>
                            ) : (
                                'Ended!'
                            )}
                        </p>
                    }
                    scrollableTarget='scrollableDiv'
                    refreshFunction={() => {
                        fetchMessage();
                    }}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                >
                    {flatData.map((message) => (
                        <Card data={message} key={message.id} />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default ChatMessageListingComponent;

const Card = ({ data }: { data: any }) => {
    const { id, ...others } = useFetchParams();
    const isActive = data?.id === +id;

    const { isLeftPanelOpen } = useTeamInboxUi();

    return (
        <div
            onClick={() => {
                data.attributes = { ...data.attributes, unread_count: 0 };
                navigateToTeamInboxDetail(data.id, others);
            }}
            className={cn(
                'flex overflow-hidden gap-4 items-center p-2 h-14 rounded transition-all cursor-pointer hover:shadow-md',
                {
                    'bg-secondary text-secondary-content': isActive,
                }
            )}
        >
            <HoverCard
                position='right'
                disabled={isActive || isLeftPanelOpen}
                align='center'
                offSet={10}
                openDelay={0}
                closeDelay={0}
                contentClassName='p-3 bg-base-100 shadow z-[9999999]'
                content={<CardMainContent data={data} />}
            >
                <div className='relative'>
                    <Avatar
                        color={
                            team_inbox_status_preference[
                                getTeamInboxStatusKey(data)
                            ]?.appearance as any
                        }
                        size='sm'
                        shape='circle'
                        alt={data?.contact_name}
                    />

                    {data?.attributes?.unread_count > 0 && (
                        <Badge
                            className='absolute -top-1 -right-1 ml-auto animate-pulse !text-[10px] p-1'
                            label={data?.attributes?.unread_count}
                            size='xs'
                            circle
                            solid
                            appearance='primary'
                        />
                    )}
                </div>
            </HoverCard>
            <CardMainContent data={data} />
        </div>
    );
};

const CardMainContent = ({ data }: any) => {
    return (
        <div className='flex flex-1 gap-2 items-center'>
            <div className='flex-1 min-w-0'>
                <div className='flex gap-2 items-center min-w-0'>
                    <span
                        className={cn('font-normal min-w-0 truncate', {
                            'font-medium': data?.attributes?.unread_count,
                        })}
                        title={data?.contact_name}
                    >
                        {data?.contact_name}
                    </span>
                </div>
                <div className='mt-0'>
                    <span
                        className={cn('text-sm whitespace-nowrap', {
                            'font-medium': data?.attributes?.unread_count,
                        })}
                    >
                        {FormatDisplayDateStyled({
                            value: data?.last_activity_at,
                        })}
                    </span>
                </div>
            </div>
            <div className='hidden gap-3 items-center xl:flex'>
                <AssignedToBotStatus
                    is_assigned_to_bot={data?.is_assigned_to_bot}
                />
                <DisplayTeamInboxStatus currentInboxDetail={data} />
            </div>
        </div>
    );
};
