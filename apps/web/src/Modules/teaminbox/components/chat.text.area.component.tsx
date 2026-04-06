import { useCallback, useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { IsUndefinedOrNull, useOperatingSystem } from '@finnoto/core';
import { Popover, TextareaField } from '@finnoto/design-system';

import { QuickReplySelectBox } from './quick.reply.select.box';

export const ChatTextareaComponent = ({
    setInput,
    input,
    onDebounceChange,
    onSelect,
}: {
    input: string;
    setInput: any;
    onDebounceChange?: (value: string) => void;
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
            offsetY={100}
            offsetX={5}
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
                showLimit
                inputClassName='leading-5 py-2 h-full'
                rows={4}
                value={IsUndefinedOrNull(input) ? '' : input}
                onChange={(val) => setInput(val)}
                onDebounceChange={onDebounceChange}
                placeholder={
                    'Type your message here or press (⌘ + /) for the quick replies.'
                }
                className='mb-1 w-full h-full'
                size='lg'
                max={1024}
            />
        </Popover>
    );
};
