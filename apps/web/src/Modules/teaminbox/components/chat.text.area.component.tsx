import { useCallback, useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { IsUndefinedOrNull, useOperatingSystem } from '@finnoto/core';
import { Popover, TextareaField } from '@finnoto/design-system';

import { QuickReplySelectBox } from './quick.reply.select.box';

export const ChatTextareaComponent = ({
    setInput,
    input,
    onSelect,
}: {
    input: string;
    setInput: any;
    onSelect: (data: any) => void;
}) => {
    const ref = useRef<any>(null);
    const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);

    useClickAway(ref, () => {
        setIsQuickReplyOpen(false);
    });

    const { type: osType } = useOperatingSystem();

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            const isMac = osType === 'mac';

            const hasPressed = isMac ? e.metaKey : e.ctrlKey;

            //ctrl+l or ctrl+shift+l
            if (e?.key === '/' && hasPressed) {
                setIsQuickReplyOpen((prev) => !prev);
            }
        },
        [osType]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    return (
        <Popover
            trigger='manual'
            side='top'
            offsetY={120}
            offsetX={10}
            align='start'
            visible={isQuickReplyOpen}
            element={
                <QuickReplySelectBox
                    ref={ref}
                    onSelect={(data) => {
                        onSelect(data);
                        setIsQuickReplyOpen(false);
                    }}
                />
            }
        >
            <TextareaField
                inputClassName='leading-5 py-2 h-full'
                rows={3}
                value={IsUndefinedOrNull(input) ? '' : input}
                onChange={(val) => setInput(val)}
                placeholder={
                    'Type your message here or press (⌘ + /) for the quick replies.'
                }
                className='w-full h-[100px]'
                size='lg'
            />
        </Popover>
    );
};
