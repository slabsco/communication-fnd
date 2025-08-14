import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Loading } from '@finnoto/design-system';

import { useTeamInboxChatListing } from '../hooks/useTeaminboxChatListing.hook';
import { MessageItem } from './message.item';

export const ChatMessageListingMain = () => {
    const {
        scrollableDivRef,
        fetchNextPage,
        flatData,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchMessage,
    } = useTeamInboxChatListing();

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessage();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchMessage]);

    return (
        <div
            ref={scrollableDivRef}
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            className='overflow-y-auto flex-1 scrollbar-xs bg-[#ece5dd]'
            id='scrollableDiv111'
        >
            <InfiniteScroll
                dataLength={flatData.length}
                next={fetchNextPage}
                hasMore={hasNextPage ?? false}
                loader={
                    isFetchingNextPage && (
                        <div className='h-full centralize'>
                            <Loading
                                size='lg'
                                color='primary'
                                type='infinity'
                            />
                        </div>
                    )
                }
                endMessage={
                    <p className='mb-3 h-full text-center text-base-secondary'>
                        {isLoading ? (
                            <div className='my-7 centralize'>
                                <Loading
                                    size='xl'
                                    color='primary'
                                    type='infinity'
                                />
                            </div>
                        ) : (
                            'Yay! You have seen it all'
                        )}
                    </p>
                }
                scrollableTarget='scrollableDiv111'
                inverse
                className='gap-2 p-4'
                style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
            >
                {flatData.map((message) => (
                    <MessageItem key={message?.id} message={message} />
                ))}
            </InfiniteScroll>
        </div>
    );
};
