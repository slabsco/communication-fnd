import escapeHtml from 'escape-html';
import { BaseEditor, Editor, Text, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor, useFocused, useSelected } from 'slate-react';

import { IsEmptyString } from '@finnoto/core';

import { Modal } from '../../../Utils';
import { MentionElement } from '../MentionInput/mentionInput.component';
import RichTextEditorVariable from './richTextEditorVariable.modal';

const Mention = ({ attributes, children, element, prefix }) => {
    const selected = useSelected();
    const focused = useFocused();
    const style: React.CSSProperties = {
        padding: '0px 8px',
        margin: '2px 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        border: '#E3E3E3 solid 1px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
        textTransform: 'capitalize',
    };
    // See if our empty text child has any styling marks applied and apply those
    if (element.children[0].bold) {
        style.fontWeight = 'bold';
    }
    if (element.children[0].italic) {
        style.fontStyle = 'italic';
    }

    return (
        <span
            {...attributes}
            contentEditable={false}
            data-cy={`mention-${element?.character?.name?.replace(' ', '-')}`}
            style={style}
        >
            {prefix}
            {element.character.group ? element.character.group + ' : ' : ''}
            {element.character.name}
            {children}
        </span>
    );
};

const RichTextEditorRenderElement = {
    paragraph: (props: any) => <p>{props.children}</p>,
    b: (props: any) => <b>{props.children}</b>,
    i: (props: any) => <em>{props.children}</em>,
    u: (props: any) => <u>{props.children}</u>,
};

export const richTextEditorRenderLeaf = (props: any) => {
    const { bold, italic, underline } = props.leaf;

    const activeStylesCount =
        (bold ? 1 : 0) + (italic ? 1 : 0) + (underline ? 1 : 0);

    if (activeStylesCount >= 2) {
        return (
            <span
                style={{
                    fontWeight: bold ? 'bold' : 'normal',
                    fontStyle: italic ? 'italic' : 'normal',
                    textDecoration: underline ? 'underline' : 'none',
                }}
                {...props.attributes}
            >
                {props.children}
            </span>
        );
    } else {
        return (
            <span {...props.attributes}>
                {bold && <strong>{props.children}</strong>}
                {italic && <em>{props.children}</em>}
                {underline && <u>{props.children}</u>}
                {!bold && !italic && !underline && props.children}
            </span>
        );
    }
};

export const renderRichTextEditorElement = (props: any, prefix?: string) => {
    if (props.element.type === 'mention')
        return <Mention {...props} prefix={prefix} />;

    const renderElement = RichTextEditorRenderElement[props.element.type];
    const defaultElement = RichTextEditorRenderElement['paragraph']?.(props);

    return renderElement?.(props) || defaultElement;
};

export const handleRichTextEvent = (event: any, editor: any) => {
    if (event.ctrlKey && event.key === 'b') {
        const [match] = Editor.nodes(editor, {
            match: (n: any) => n.type === 'b',
        });

        Editor.addMark(editor, 'bold', true);
    }
};

export const serializeRichText = (node, key = 'key') => {
    if (Text.isText(node as any)) {
        let string = escapeHtml(node.text);

        if (IsEmptyString(string)) return '<br/>';

        if (node.bold) {
            string = `<strong>${string}</strong>`;
        }
        if (node.italic) {
            string = `<em>${string}</em>`;
        }
        if (node.underline) {
            string = `<u>${string}</u>`;
        }

        return string;
    }

    const children = node.children
        .map((n) => {
            if (n.type === 'mention') {
                const mentionText =
                    key === 'key'
                        ? `<code style="background-color: blue; padding: 2px 5px; border-radius: 4px; color: white;" data-internalid='${n.character.key}'>{{${n.character[key]}}}</code>`
                        : n.character[key];
                return mentionText;
            }
            return serializeRichText(n, key);
        })
        .join('');

    switch (node.type) {
        case 'paragraph':
            return `<p style="padding:0; margin:0">${children}</p>`;
        default:
            return children;
    }
};

export const deserializeRichText = (
    el,
    markAttributes = {},
    mentions?: any[]
) => {
    if (el.nodeType === Node.TEXT_NODE) {
        return jsx('text', markAttributes, el.textContent);
    } else if (el.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const nodeAttributes: any = { ...markAttributes };

    switch (el.nodeName) {
        case 'STRONG':
            nodeAttributes.bold = true;
            break;
        case 'EM':
            nodeAttributes.italic = true;
            break;
        case 'U':
            nodeAttributes.underline = true;
            break;
        case 'CODE':
            const key = el.attributes['data-internalid']?.value;
            const attributes = mentions?.find((men) => men.key === key);

            nodeAttributes.character = { ...attributes };
            break;
    }

    const children = Array.from(el.childNodes)
        .map((node) => deserializeRichText(node, nodeAttributes, mentions))
        .flat();

    if (children.length === 0) {
        children.push(jsx('text', {}, ''));
    }

    switch (el.nodeName) {
        case 'BODY':
            return jsx('fragment', {}, children);
        case 'BR':
            return '';
        case 'P':
            return jsx('element', { type: 'paragraph' }, children);
        case 'STRONG':
            return jsx('element', { type: 'bold' }, children);
        case 'ITALIC':
            return jsx('element', { type: 'italic' }, children);
        case 'SPAN':
            return jsx('element', { type: 'span' }, children);
        case 'UNDERLINE':
            return jsx('element', { type: 'underline' }, children);
        case 'CODE':
            return jsx(
                'element',
                { type: 'mention', character: nodeAttributes?.character },
                children
            );
        default:
            return children;
    }
};
export const withMentions = (editor: any): BaseEditor & ReactEditor => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element) => {
        return element.type === 'mention' ? true : isInline(element);
    };

    editor.isVoid = (element) => {
        return element.type === 'mention' ? true : isVoid(element);
    };

    editor.markableVoid = (element) => {
        return element.type === 'mention' || markableVoid(element);
    };

    return editor;
};

export const insertMention = (editor, character) => {
    const mention: MentionElement = {
        type: 'mention',
        character,
        children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
};

export const openRichTextVariablesModal = (props) => {
    const { mentions, mentionPrefix, onApplyAll: onApplyVariables } = props;

    Modal.open({
        component: RichTextEditorVariable,
        props: {
            mentions,
            mentionPrefix,
            onApplyAll: onApplyVariables,
        },
    });
};
