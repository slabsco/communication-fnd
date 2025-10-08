import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createEditor, Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { jsx } from 'slate-hyperscript';
import { withReact } from 'slate-react';

import { IsEmptyArray, useQuery } from '@finnoto/core';

import { cn } from '../../../Utils/common.ui.utils';
import { InputErrorMessage } from '../InputField/inputMessage.component';
import { Label } from '../InputField/label.component';
import {
    richTextInitialState,
    richTextReducer,
} from './richText.reducer.state';
import RichTextArea from './richTextArea.component';
import { RichTextEditorProps } from './richTextEditor.types';
import {
    deserializeRichText,
    openRichTextVariablesModal,
    withMentions,
} from './richTextEditorRenderElement.utils';
import { RichTextEditorToolbar } from './richTextEditorToolToolbar.component';
import RichTextInfo from './richTextInfo.component';

export const RichTextEditor = ({
    labelProps,
    features,
    infoProps,
    mentionPrefix,
    getHtml,
    enablePreview = true,
    placeholder,
    html,
    readOnly = false,
    showInfo = false,
    showBorder = true,
    containerClassName,
    editorClassName,
    warning,
    error,
    height,
    withoutDefaultHeight,
}: RichTextEditorProps) => {
    const [state, dispatch] = useReducer(richTextReducer, richTextInitialState);
    const ref = useRef<any>();

    const [editor] = useState(() =>
        withMentions(withReact(withHistory(createEditor())))
    );

    const { data: mentions, isLoading: mentionsLoading } = useQuery({
        queryKey: ['mentions_identifiers'],
        queryFn: async () => {
            // const { success, response } = await FetchData({
            //     className: ContextMetadataController,
            //     method: 'list',
            // });

            // if (success) return response;
            return [];
        },
    });

    const onApplyVariables = (data: any) => {
        const children = data.map((val) => ({
            type: 'mention',
            character: { ...val },
            children: [
                {
                    text: '',
                },
            ],
        }));

        const range = ref.current?.afterRange;
        editor.insertNodes(children, { at: range || undefined });
    };

    const deserializeHtml = useMemo(() => {
        if (!html) return;

        // Clean up HTML entities before parsing
        const cleanHtml = html.replace(/&amp;amp;/g, '&');

        // If the HTML doesn't contain any HTML tags, treat it as plain text
        if (!/<[^>]+>/.test(cleanHtml)) {
            // Split by line breaks and create paragraphs
            const lines = cleanHtml
                .split('\n')
                .filter((line) => line.trim() !== '');
            return lines.map((line) =>
                jsx('element', { type: 'paragraph' }, [jsx('text', {}, line)])
            );
        }

        const dom = new DOMParser().parseFromString(
            cleanHtml,
            'text/html'
        ).body;

        const value = deserializeRichText(dom, {}, mentions);

        // Handle different return types from deserializeRichText
        if (!value) return undefined;

        // If value is a string (empty case), return undefined
        if (typeof value === 'string') return undefined;

        // If value is a single element object, wrap it in an array
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            // If it's a fragment, extract its children
            if (value.type === 'fragment') {
                return value.children || [];
            }
            return [value];
        }

        // If value is an array, process it properly
        if (Array.isArray(value)) {
            // Convert array of text objects to proper Slate structure
            const processedElements = [];

            for (let i = 0; i < value.length; i++) {
                const item = value[i];

                // If it's a text object, wrap it in a paragraph
                if (
                    item &&
                    typeof item === 'object' &&
                    item.text !== undefined
                ) {
                    processedElements.push(
                        jsx('element', { type: 'paragraph' }, [
                            jsx('text', {}, item.text),
                        ])
                    );
                }
                // If it's already a proper Slate element, keep it as is
                else if (item && typeof item === 'object' && item.type) {
                    processedElements.push(item);
                }
                // If it's an empty string (from BR tags), create an empty paragraph
                else if (item === '') {
                    processedElements.push(
                        jsx('element', { type: 'paragraph' }, [
                            jsx('text', {}, ''),
                        ])
                    );
                }
            }

            return processedElements.length > 0 ? processedElements : undefined;
        }

        return undefined;
    }, [html, mentions]);

    console.log({ deserializeHtml });

    // Update display on update if is readOnly.
    useEffect(() => {
        if (!deserializeHtml) return;
        if (!readOnly) return;

        Transforms.delete(editor, {
            at: {
                anchor: Editor.start(editor, []),
                focus: Editor.end(editor, []),
            },
        });

        editor.insertNodes(deserializeHtml);
    }, [html, readOnly, deserializeHtml, editor]);

    const addEmoji = async (emoji) => {
        editor.insertText(emoji);
    };

    return (
        <div className='col-flex'>
            <Label {...labelProps} />

            <div
                className={cn('col-flex', {
                    'rounded border': showBorder,
                    'bg-polaris-bg-surface': !readOnly,
                })}
            >
                {!readOnly && (
                    <RichTextEditorToolbar
                        editor={editor}
                        state={state}
                        dispatch={dispatch}
                        features={features}
                        enablePreview={enablePreview}
                        addEmoji={addEmoji}
                        onVariableClick={
                            !IsEmptyArray(mentions)
                                ? () =>
                                      openRichTextVariablesModal({
                                          mentions,
                                          mentionPrefix,
                                          onApplyAll: onApplyVariables,
                                      })
                                : undefined
                        }
                    />
                )}

                {showInfo && <RichTextInfo {...infoProps} />}

                <RichTextArea
                    ref={ref}
                    state={state}
                    getHtml={getHtml}
                    dispatch={dispatch}
                    editor={editor}
                    placeholder={placeholder}
                    mentionPrefix={mentionPrefix}
                    readOnly={readOnly}
                    mentions={mentions}
                    initialValue={deserializeHtml || undefined}
                    containerClassName={containerClassName}
                    editorClassName={editorClassName}
                    height={height}
                    withoutDefaultHeight={withoutDefaultHeight}
                />
            </div>
            <InputErrorMessage {...{ error, warning }} />
        </div>
    );
};
