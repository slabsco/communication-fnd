import React, { useState } from 'react';

import { FetchData } from '@finnoto/core';
import { QuickReplyController } from '@finnoto/core/src/backend/communication/controller/quick.reply.controller';
import { InputField } from '@finnoto/design-system';

import { useQuery } from '@tanstack/react-query';

export const QuickReplySelectBox = React.forwardRef<
    HTMLDivElement,
    { onSelect: (data: any) => void }
>(({ onSelect }, ref) => {
    const [input, setInput] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['find', 'quick_reply'],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: QuickReplyController,
                method: 'find',
                classParams: { str: input },
            });

            if (success) return response;
        },
    });

    return (
        <div
            ref={ref}
            className='gap-2 items-center p-3 rounded shadow-lg bg-base-100 col-flex'
        >
            <InputField
                placeholder={'search here..'}
                size='sm'
                value={input}
                onChange={(e) => setInput(e)}
            />
            <div className='w-full'>
                {isLoading ? (
                    <div className='p-2 text-sm'>Loading...</div>
                ) : (
                    <div className='overflow-y-auto max-h-60'>
                        {data?.map((val) => (
                            <div
                                key={val?.id}
                                onClick={() => onSelect(val)}
                                className='p-2 text-sm rounded cursor-pointer hover:bg-primary hover:text-primary-content'
                            >
                                {val?.name}{' '}
                                <span className='text-accent'>
                                    (/{val?.shortcut})
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

QuickReplySelectBox.displayName = 'QuickReplySelectBox';
