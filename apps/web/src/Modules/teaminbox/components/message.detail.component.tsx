import { Loading } from '@finnoto/design-system';

import { useTeamInboxDetail } from '../hooks/useTeaminboxDetail.hook';
import { MessageItem } from './message.item';

export const RenderMessageDetail = ({ data }: { data: { id: string } }) => {
    const { isLoading, response } = useTeamInboxDetail(+data.id);

    return (
        <div
            key={data?.id}
            className='flex overflow-y-auto flex-col-reverse gap-2 p-4 h-full'
        >
            {isLoading && <Loading />}
            {response?.records.map((message: any) => (
                <MessageItem key={message?.id} message={message} />
            ))}
        </div>
    );
};
