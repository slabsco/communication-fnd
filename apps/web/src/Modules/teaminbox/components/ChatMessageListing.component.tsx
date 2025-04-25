import { SearchIcon } from 'lucide-react';
import { useEffect } from 'react';
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
    SelectBox,
} from '@finnoto/design-system';

import { TeamInboxStatusTypeEnum } from '../../broadcast/your-templates/enums/whatsapp.template.category.enum';
import { useTeamInboxMessageListing } from '../hooks/useTeamInboxMessageListing.hook';
import { navigateToTeamInboxDetail } from '../utils/teaminbox.utils';
import { openAddInbox } from './add.inbox.modal';
import { DisplayTeamInboxStatus } from './chat.message.detail.component';

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
        queryClient,
        teamInboxId,
        fetchMessage,
        setAssignToMe,
        assignToMe,
        status_id,
        setStatusId,
    } = useTeamInboxMessageListing();

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessage();
        }, 1000);

        return () => clearInterval(interval);
    }, [queryClient, search, assignToMe, fetchMessage]);

    return (
        <div className='overflow-hidden w-full h-full rounded-lg col-flex bg-base-100 lg:col-span-3'>
            <div className='gap-2 px-3 py-2 col-flex'>
                <div className='flex gap-2 items-center'>
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
                                callback: () => {
                                    queryClient.invalidateQueries([
                                        'team_inbox_message_list',
                                        +teamInboxId,
                                    ]);
                                },
                            });
                        }}
                    />
                </div>
                <div className='flex gap-1 items-center p-1 rounded bg-base-200'>
                    <span className='mr-2'>Filters:</span>
                    <div
                        onClick={() => setAssignToMe((prev) => !prev)}
                        className={cn(
                            'px-2 py-1 text-sm text-center rounded border transition-all cursor-pointer bg-base-100 hover:bg-primary hover:text-primary-content hover:border-primary',
                            {
                                'bg-primary text-primary-content border-primary':
                                    assignToMe,
                            }
                        )}
                    >
                        Assigned to me
                    </div>
                    <SelectBox
                        width={150}
                        placeholder='Select Status'
                        size='sm'
                        isClearable
                        value={status_id}
                        onChange={(_option) => {
                            setStatusId(_option?.value);
                        }}
                        options={[
                            {
                                label: 'Solved',
                                value: TeamInboxStatusTypeEnum.SOLVED,
                            },
                            {
                                label: 'Pending',
                                value: TeamInboxStatusTypeEnum.PENDING,
                            },
                            {
                                label: 'Open',
                                value: TeamInboxStatusTypeEnum.OPEN,
                            },

                            {
                                label: 'Expired',
                                value: TeamInboxStatusTypeEnum.EXPIRED,
                            },
                            {
                                label: 'Only Broadcast',
                                value: TeamInboxStatusTypeEnum.ONLY_BROADCAST,
                            },
                        ]}
                    />
                </div>
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
            <DisplayTeamInboxStatus currentInboxDetail={data} />
        </div>
    );
};
