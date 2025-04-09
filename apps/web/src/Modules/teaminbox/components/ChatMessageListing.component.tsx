import { SearchIcon } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useFetchParams } from '@finnoto/core';
import {
    Avatar,
    Badge,
    cn,
    FormatDisplayDateStyled,
    IconButton,
    InputField,
    Loading,
} from '@finnoto/design-system';

import { useTeamInboxMessageListing } from '../hooks/useTeamInboxMessageListing.hook';
import { navigateToTeamInboxDetail } from '../utils/teaminbox.utils';
import { openAddInbox } from './add.inbox.modal';

import { AddSvgIcon } from 'assets';

const ChatMessageListingComponent = () => {
    const {
        setSearch,
        search,
        flatData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchMessage,
    } = useTeamInboxMessageListing();

    return (
        <div className='overflow-hidden w-full h-full rounded-lg col-flex bg-base-100 lg:col-span-3'>
            <div className='flex gap-2 items-center px-3 py-2'>
                <InputField
                    placeholder={'Search here'}
                    className='flex-1 min-w-0'
                    value={search}
                    onDebounceChange={(val) => {
                        setSearch(val);
                    }}
                    prefix={<SearchIcon size={14} />}
                />
                <IconButton
                    icon={AddSvgIcon}
                    name='New Message'
                    size='lg'
                    outline
                    iconSize={24}
                    appearance='info'
                    onClick={() => {
                        openAddInbox({
                            callback: () => {},
                        });
                    }}
                />
            </div>
            <div className='overflow-y-auto flex-1 p-1' id='scrollableDiv'>
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
                                'Yay! You have seen it all'
                            )}
                        </p>
                    }
                    scrollableTarget='scrollableDiv'
                    refreshFunction={() => {
                        fetchMessage();
                    }}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>
                            &#8595; Pull down to refresh
                        </h3>
                    }
                    releaseToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>
                            &#8593; Release to refresh
                        </h3>
                    }
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
    const { id } = useFetchParams();
    const isActive = data?.id === +id;

    return (
        <div
            onClick={() => {
                data.attributes = { ...data.attributes, unread_count: 0 };
                navigateToTeamInboxDetail(data.id);
            }}
            className={cn(
                'flex gap-3 items-start p-2 mb-2 rounded transition-all cursor-pointer hover:shadow',
                {
                    'bg-secondary text-secondary-content': isActive,
                }
            )}
        >
            <Avatar
                color='polaris'
                size='sm'
                shape='circle'
                alt={data?.contact_name}
            />

            <div className='flex-1'>
                <div className='flex gap-2 items-center'>
                    <span
                        className={cn('font-normal', {
                            'font-medium': data?.attributes?.unread_count,
                        })}
                    >
                        {data?.contact_name}
                    </span>
                    {data?.attributes?.unread_count > 0 && (
                        <Badge
                            className='ml-auto animate-pulse'
                            label={data?.attributes?.unread_count}
                            size='xs'
                            solid
                            appearance='info'
                        />
                    )}
                </div>
                <div className='mt-0'>
                    <span
                        className={cn('text-sm', {
                            'font-medium': data?.attributes?.unread_count,
                        })}
                    >
                        {FormatDisplayDateStyled({
                            value: data?.last_activity_at,
                        })}
                    </span>
                </div>
            </div>
            {data?.expired_at && (
                <Badge label={'Expired'} size='sm' appearance='error' />
            )}
        </div>
    );
};
