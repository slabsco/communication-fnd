import { KeyboardEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useList } from 'react-use';

import {
    IsEmptyString,
    IsValidString,
    parseToServerFileFormat,
    useApp,
} from '@finnoto/core';

import { IconButton, MentionInput, openFullViewImage } from '../../Components';
import {
    CustomMention,
    MentionValueContext,
} from '../../Components/Inputs/MentionInput/mentionInput.types';
import { cn } from '../../Utils/common.ui.utils';
import { CommonFileUploader } from '../Uploader/Components/commonFileUploader.component';
import { ChatFileItem } from './conversation-message';

import { PaperClipSvgIcon, PaperPlaneSvgIcon } from 'assets';

export const ConversationInputBox = ({
    onMessage,
    messageBoxClassName,
    callback,
    disabled,
    isPwa,
    userFilterKey,
    userFilterValue,
    variant,
    customMentions,
}: {
    onMessage: (
        message: string,
        mentions: MentionValueContext[],
        files: any
    ) => void;
    messageBoxClassName?: string;
    callback?: () => void;
    disabled?: boolean;
    isPwa?: boolean;
    userFilterKey?: string;
    userFilterValue?: unknown;
    variant?: 'conversation' | 'notes';
    customMentions?: CustomMention[];
}): any => {
    const { isArc } = useApp();
    const inputRef = useRef(null);
    const [message, setMessage] = useState('');
    const [mentions, setMentions] = useState([]);
    const [files, { push: addFiles, removeAt: removeFile, clear: clearFiles }] =
        useList([]);

    const isValidInputs = useMemo(() => {
        return IsValidString(message);
    }, [message]);

    const handleSubmit = useCallback(
        (e?: any) => {
            e?.preventDefault();
            if (IsEmptyString(message)) return;

            onMessage?.(message, mentions, files);
            inputRef.current.clear();
            clearFiles();
            callback?.();
        },
        [message, onMessage, mentions, files, clearFiles, callback]
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            switch (event.key) {
                case 'Enter':
                    if (!event.ctrlKey && !event.metaKey) return;
                    event.preventDefault();
                    handleSubmit();
                    break;
            }
        },

        [handleSubmit]
    );

    const fileUploadIconClass = isArc
        ? '!text-polaris-text-secondary group-hover/file:!text-polaris-text-brand'
        : '!text-base-tertiary group-hover/file:!text-base-primary';

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'col-flex group relative border border-polaris-border bg-base-100 transition-all rounded-lg',
                {
                    rounded: !isArc,
                    'focus-within:border-base-primary': !isPwa && !disabled,
                    'overflow-hidden': isPwa,
                },
                messageBoxClassName
            )}
            noValidate
            tabIndex={0}
        >
            <MentionInput
                ref={inputRef}
                onChange={(value) => {
                    setMessage(value.text);
                    setMentions(value.context);
                }}
                onKeyDown={onKeyDown}
                className={cn('flex-1')}
                disabled={disabled}
                filterKey={userFilterKey}
                filterValue={userFilterValue}
                placeholder={variant === 'notes' ? 'Add a note' : undefined}
                customMentions={customMentions}
            />
            <div
                className={cn(
                    'flex overflow-hidden gap-2 justify-between px-2 pb-2 w-full rounded-b-lg',
                    {
                        'bg-base-200': disabled,
                    }
                )}
            >
                <div className='flex flex-col gap-2'>
                    <ConversationFileList
                        files={files}
                        onRemove={removeFile}
                        isPwa={isPwa}
                    />
                    <CommonFileUploader
                        onFileUpload={(files) => {
                            let newFiles = files.map((file) =>
                                parseToServerFileFormat(file)
                            );

                            addFiles(...newFiles);
                        }}
                        className='w-fit'
                        is_multiple
                    >
                        {({ uploading }) => (
                            <IconButton
                                icon={PaperClipSvgIcon}
                                disabled={uploading || disabled}
                                type='button'
                                size={isPwa ? 'sm' : 'lg'}
                                appearance='ghost'
                                iconClass={fileUploadIconClass}
                                className='bg-transparent transition-all'
                            />
                        )}
                    </CommonFileUploader>
                </div>
                <IconButton
                    type='submit'
                    icon={PaperPlaneSvgIcon}
                    size={isPwa ? 'sm' : 'lg'}
                    appearance='ghost'
                    disabled={!isValidInputs}
                    iconClass={
                        isValidInputs ? 'text-info' : 'text-base-tertiary'
                    }
                    className='!bg-transparent self-end'
                />
            </div>
        </form>
    );
};

const ConversationFileList = ({
    files,
    onRemove,
    className,
    isPwa,
}: {
    files: any[];
    onRemove: (index: number) => void;
    className?: string;
    isPwa?: boolean;
}) => {
    const renderFileList = useCallback(
        (list: any[]) => {
            return list.map((file, index) => {
                return (
                    <ChatFileItem
                        key={file.index}
                        file={file}
                        onRemove={onRemove}
                        className={className}
                        onClick={() => openFullViewImage(files, index)}
                        actionViewType='action'
                    />
                );
            });
        },
        [onRemove, className, files]
    );

    if (!files.length) return null;

    return (
        <div className='flex overflow-hidden flex-wrap flex-1 gap-1 mt-2'>
            {renderFileList(files)}
        </div>
    );
};
