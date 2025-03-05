import EmojiPicker from 'emoji-picker-react';
import {
    BoldIcon,
    ItalicIcon,
    Redo2,
    UnderlineIcon,
    Undo2,
} from 'lucide-react';

import { useApp } from '@finnoto/core';

import { Modal } from '../../../Utils';
import { cn } from '../../../Utils/common.ui.utils';
import { Popover } from '../../Surfaces/Popover/popover.component';
import { Button } from '../Button/button.component';
import { IconButton } from '../Icon-Button/iconButton.component';
import { RichTextEditorToolbarProps } from './richTextEditor.types';
import { serializeRichText } from './richTextEditorRenderElement.utils';
import RichTextPreviewModal from './richTextPreview.modal';

import { EmojiSvgIcon } from 'assets';

export const RichTextEditorToolbar = ({
    state,
    dispatch,
    editor,
    features,
    onVariableClick,
    enablePreview = false,
    addEmoji,
}: RichTextEditorToolbarProps) => {
    const { isArc } = useApp();

    const openPrevModal = () => {
        Modal.open({
            component: RichTextPreviewModal,
            props: { html: serializeRichText(editor, 'default') },
        });
    };
    return (
        <div
            className={cn(
                'flex gap-4 justify-between items-center p-2 border-b'
            )}
        >
            <div className='flex gap-2 items-center'>
                {features?.map((val) => (
                    <RichTextButton
                        key={val}
                        type={val}
                        active={state[val]}
                        onClick={() =>
                            dispatch({ type: val.toLocaleUpperCase() })
                        }
                    />
                ))}
                <Popover
                    align='start'
                    side='top'
                    element={
                        <EmojiPicker
                            className='absolute'
                            allowExpandReactions
                            onEmojiClick={({ emoji }) => {
                                addEmoji(emoji);
                            }}
                        />
                    }
                >
                    <IconButton
                        name='Add Emoji'
                        icon={EmojiSvgIcon}
                        appearance='plain'
                    />
                </Popover>
            </div>
            <div className='flex gap-2 items-center'>
                <Button
                    onClick={() => {
                        editor.undo();
                    }}
                    className='!px-0.5 hover:bg-polaris-bg-surface-secondary-active'
                    appearance='ghost'
                    size='xs'
                    shape='square'
                >
                    <Undo2 size={16} />
                </Button>
                <Button
                    onClick={() => {
                        editor.redo();
                    }}
                    className='!px-0.5 hover:bg-polaris-bg-surface-secondary-active'
                    appearance='ghost'
                    size='xs'
                    shape='square'
                >
                    <Redo2 size={16} />
                </Button>

                {/* {IsFunction(onVariableClick) && (
                    <Button
                        onClick={onVariableClick}
                        size='sm'
                        appearance='plain'
                        className='text-[#303030] border border-base-300'
                    >
                        Variables
                    </Button>
                )} */}
                {enablePreview && (
                    <Button
                        onClick={openPrevModal}
                        appearance='plain'
                        className='text-[#303030] border border-base-300'
                        size='sm'
                    >
                        Preview
                    </Button>
                )}
            </div>
        </div>
    );
};

const IconsType = {
    bold: <BoldIcon size={16} />,
    italic: <ItalicIcon size={16} />,
    underline: <UnderlineIcon size={16} />,
};
const RichTextButton = ({
    type,
    onClick,
    active,
}: {
    onClick: () => void;
    active: boolean;
    type: keyof typeof IconsType;
}) => {
    return (
        <Button
            className={cn('!px-0 ', {
                'bg-polaris-bg-surface-secondary-active hover:bg-polaris-bg-surface-secondary-active':
                    active,
                'hover:bg-polaris-bg-surface-secondary-hover': !active,
            })}
            appearance='ghost'
            shape='square'
            size='xs'
            onClick={onClick}
        >
            {IconsType[type]}
        </Button>
    );
};
