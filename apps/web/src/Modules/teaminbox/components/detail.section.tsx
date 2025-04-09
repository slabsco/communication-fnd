import { MessageChat } from './message.chat.component';
import { RenderMessageDetail } from './message.detail.component';
import { RightSection } from './right.section';

export const DetailSection = ({
    data,
    isLoading,
}: {
    data: any;
    isLoading?: boolean;
}) => {
    return (
        <div className='grid overflow-hidden grid-cols-3 gap-2 items-center h-full'>
            <div className='overflow-y-auto col-span-2 h-full rounded border bg-polaris-bg-surface'>
                <div className='relative gap-1 p-2 h-full col-flex'>
                    <div className='overflow-hidden flex-1 border'>
                        <RenderMessageDetail key={data?.id} data={data} />
                    </div>
                    <MessageChat data={data} />
                </div>
            </div>
            <RightSection data={data} isLoading={isLoading} />
        </div>
    );
};
