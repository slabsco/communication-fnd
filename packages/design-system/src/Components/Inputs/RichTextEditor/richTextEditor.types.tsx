import { ReactEditor } from 'slate-react';

import { LabelInterface } from '../InputField/input.types';

import { ErrorSvgIcon, InfoCircleSvgIcon, WarningOutlineSvgIcon } from 'assets';

export interface RichEditorTextInfoProps {
    text: string;
    type: keyof typeof richEditorTextInfoTypes;
}

export const richEditorTextInfoTypes = {
    warning: {
        style: 'text-warning bg-warning/20',
        icon: WarningOutlineSvgIcon,
    },
    info: {
        style: 'text-info bg-info/20',
        icon: InfoCircleSvgIcon,
    },
    error: {
        style: 'text-error bg-error/20',
        icon: ErrorSvgIcon,
    },
    primary: {
        style: 'text-primary bg-primary/20',
        icon: InfoCircleSvgIcon,
    },
};

type EditorFeature = 'bold' | 'italic' | 'underline';

export interface RichTextEditor extends ReactEditor {
    undo?: () => void;
    redo?: () => void;
}

interface CommonRichTextEditorType {
    state: { bold: boolean; underline: boolean; italic: boolean };
    dispatch: (_: any) => void;
    editor: RichTextEditor;
}
export interface RichTextEditorToolbarProps extends CommonRichTextEditorType {
    features?: EditorFeature[];
    onVariableClick?: () => void;
    enablePreview?: boolean;
    addEmoji?: (emoji: string) => void;
}

export interface RichTextAreaProps extends CommonRichTextEditorType {
    mentions?: MentionsType[];
    mentionPrefix?: keyof typeof richTextMentionPrefixRegex;
    getHtml?: (html: string) => void;
    placeholder?: string;
    initialValue?: any;
    readOnly?: boolean;
    editorClassName?: string;
    containerClassName?: string;
    height?: number;
    withoutDefaultHeight?: boolean;
}

export interface MentionsType {
    key: string;
    name: string;
    default: string;
    description?: string;
}

export const richTextMentionPrefixRegex = {
    '@': /@(\w+)?$/,
    '#': /#(\w+)?$/,
};

export interface RichTextEditorProps {
    getHtml?: (html: string) => void;
    placeholder?: string;
    labelProps: LabelInterface;
    features: EditorFeature[];
    infoProps?: RichEditorTextInfoProps;
    mentions?: MentionsType[];
    enablePreview?: boolean;
    readOnly?: boolean;
    mentionPrefix?: keyof typeof richTextMentionPrefixRegex;
    html?: string;
    showInfo?: boolean;
    showBorder?: boolean;
    containerClassName?: string;
    editorClassName?: string;
    error?: string;
    warning?: string;
    height?: number;
    withoutDefaultHeight?: boolean;
}
