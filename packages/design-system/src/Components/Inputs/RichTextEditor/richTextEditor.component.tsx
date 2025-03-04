import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createEditor, Editor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';

import { IsEmptyArray, IsUndefinedOrNull, useQuery } from '@finnoto/core';

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
        const dom = new DOMParser().parseFromString(html, 'text/html').body;

        const value = deserializeRichText(dom, {}, mentions);

        if (IsUndefinedOrNull(value?.[0]?.type)) return undefined;
        return value;
    }, [html, mentions]);

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
