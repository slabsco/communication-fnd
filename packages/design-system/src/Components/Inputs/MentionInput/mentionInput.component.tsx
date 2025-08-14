import {
    forwardRef,
    KeyboardEvent,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    BaseEditor,
    BaseText,
    createEditor,
    Descendant,
    Editor,
    Range,
    Transforms,
} from 'slate';
import { withHistory } from 'slate-history';
import {
    Editable,
    ReactEditor,
    Slate,
    useFocused,
    useSelected,
    withReact,
} from 'slate-react';

import {
    IsEmptyArray,
    IsUndefinedOrNull,
    ObjectDto,
    PRODUCT_IDENTIFIER,
    useApp,
} from '@finnoto/core';

import { Portal } from '@radix-ui/react-portal';

import { cn } from '../../../Utils/common.ui.utils';
import { Avatar } from '../../Data-display/Avatar/avatar.component';
import { slateWordRange } from './mention.utils';
import { MentionInputProps } from './mentionInput.types';
import { useMentionUsersApp } from './useMentionUser.hook';

export type MentionElement = {
    type: 'mention';
    character: string;
    children: BaseText[];
};

export const MentionInput = forwardRef(
    (
        {
            className,
            onChange,
            onKeyDown: propsOnKeyDown,
            onFocus,
            onBlur,
            disabled,
            filterKey,
            filterValue,
            subLabelKey = 'email',
            placeholder = 'Type @ to mention and notify someone',
            autoFocus = false,
            customMentions = [],
        }: MentionInputProps,
        forwardedRef
    ) => {
        const ref = useRef<HTMLDivElement | null>();

        const { mentionUserContext: mentions } = useMentionUsersApp();

        const sanitizedMentions: ObjectDto[] = useMemo(() => {
            const sanitizedCustomMentions = customMentions.map((mention) => {
                return {
                    active: true,
                    id: mention.sourceId,
                    display: mention.display,
                    email: mention.email,
                    source_type: mention.sourceType,
                    identifier: mention.identifier,
                };
            });

            return [...mentions, ...sanitizedCustomMentions];
        }, [customMentions, mentions]);

        const { product_id } = useApp();

        const isVendorPortal = product_id === PRODUCT_IDENTIFIER.VENDOR;

        const filterUsers = useMemo(() => {
            if (filterKey) {
                return (
                    sanitizedMentions?.filter(
                        (u) => u[filterKey] === filterValue
                    ) || []
                );
            }

            return sanitizedMentions || [];
        }, [filterKey, filterValue, sanitizedMentions]);

        const [target, setTarget] = useState<Range | undefined>();
        const [index, setIndex] = useState(0);

        const [search, setSearch] = useState('');
        const renderElement = useCallback(
            (props) => <Element {...props} />,
            []
        );
        const editor = useMemo(
            () => withMentions(withReact(withHistory(createEditor()))),
            []
        );

        const chars = filterUsers.filter((c) =>
            c.display?.toLowerCase().startsWith(search.toLowerCase())
        );

        const onKeyDown = useCallback(
            (event: KeyboardEvent<HTMLDivElement>) => {
                if (target && chars.length > 0) {
                    switch (event.key) {
                        case 'ArrowDown':
                            event.preventDefault();
                            const prevIndex =
                                index >= chars.length - 1 ? 0 : index + 1;
                            setIndex(prevIndex);
                            ref.current
                                ?.querySelector(`[tabindex="${prevIndex}"]`)
                                ?.scrollIntoView({ block: 'nearest' });
                            break;
                        case 'ArrowUp':
                            event.preventDefault();
                            const nextIndex =
                                index <= 0 ? chars.length - 1 : index - 1;
                            setIndex(nextIndex);
                            ref.current
                                ?.querySelector(`[tabindex="${nextIndex}"]`)
                                ?.scrollIntoView({ block: 'nearest' });
                            break;
                        case 'Tab':
                        case 'Enter':
                            event.preventDefault();
                            Transforms.select(editor, target);

                            insertMention(editor, chars[index].display);
                            setTarget(null);
                            break;
                        case 'Escape':
                            event.preventDefault();
                            setTarget(null);
                            break;
                    }
                    return;
                }
                propsOnKeyDown?.(event);
            },
            [chars, editor, index, propsOnKeyDown, target]
        );

        const handleOnChange = (value: Descendant[]) => {
            let text = '';
            const context = [];

            const getOption = (character: string) => {
                return filterUsers.find((c) => c.display === character);
            };

            value.forEach((node: any, index, arr) => {
                if (index > 0 && index < arr.length) text += '\n';
                node.children?.forEach((child, idx) => {
                    if (child.type === 'mention') {
                        const option = getOption(child.character);

                        text += `@${child.character} `;
                        context.push({
                            ...option,
                            display: `@${child.character}`,
                        });
                        return;
                    }

                    if (idx > 0) text += ' ';
                    text += child.text;
                });
            });

            onChange?.({ text, context });
        };

        const clear = useCallback(() => {
            Transforms.delete(editor, {
                at: {
                    anchor: Editor.start(editor, []),
                    focus: Editor.end(editor, []),
                },
            });
        }, [editor]);

        useEffect(() => {
            if (!IsEmptyArray(editor.children) && target && chars.length > 0) {
                const el = ref.current;
                if (!el) return;

                try {
                    const domRange = ReactEditor.toDOMRange(editor, target);
                    const rect = domRange.getBoundingClientRect();

                    if (IsUndefinedOrNull(el?.style)) return;

                    el.style.top = `${rect.top + window.pageYOffset + 24}px`;
                    el.style.left = `${rect.left + window.pageXOffset}px`;
                } catch (e) {
                    console.error(e);
                }
            }
        }, [chars.length, editor, index, search, target]);

        useImperativeHandle(
            forwardedRef,
            () => ({
                editor,
                clear,
            }),
            [clear, editor]
        );

        return (
            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={(value) => {
                    const { selection } = editor;
                    handleOnChange(value);

                    if (selection && Range.isCollapsed(selection)) {
                        const [start] = Range.edges(selection);
                        const wordBefore = Editor.before(editor, start, {
                            unit: 'word',
                            voids: true,
                        });

                        const range =
                            wordBefore &&
                            slateWordRange(
                                editor,
                                Editor.range(editor, wordBefore, start),
                                {
                                    terminator: [' ', '@'],
                                    directions: 'left',
                                    include: true,
                                }
                            );

                        const text = range && Editor.string(editor, range);
                        const match = text && text.match(/@(\w+)?$/);

                        if (match) {
                            range.anchor.offset = !match[1]
                                ? Math.min(
                                      range.anchor.offset + match.index,
                                      range.focus.offset
                                  )
                                : range.anchor.offset;

                            range.anchor.path = !match[1]
                                ? range.focus.path
                                : range.anchor.path;
                            setTarget(range);
                            setSearch(match[1] || '');
                            setIndex(0);
                            return;
                        }
                    }

                    setTarget(null);
                }}
            >
                <Editable
                    rows={2}
                    renderElement={renderElement}
                    onKeyDown={onKeyDown}
                    className={cn(
                        'textarea pt-0.5 !min-h-0 border-0 bg-transparent rounded-t-lg',
                        className
                    )}
                    placeholder={
                        isVendorPortal ? 'Type your message' : placeholder
                    }
                    renderPlaceholder={({ attributes, children }) => (
                        <div {...attributes} className='h-full leading-8'>
                            {children}
                        </div>
                    )}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    readOnly={disabled}
                    disabled={disabled}
                    autoFocus={autoFocus}
                />

                {target && chars.length > 0 && (
                    <Portal>
                        <div
                            ref={ref}
                            data-cy='mentions-portal'
                            style={{
                                top: '-9999px',
                                left: '-9999px',
                                zIndex: 100,
                                position: 'absolute',
                                pointerEvents: 'auto',
                            }}
                            className='scrollbar-xs text-sm border max-h-[300px] overflow-y-auto  overflow-hidden rounded-lg shadow-sm bg-polaris-bg-surface border-polaris-border '
                        >
                            {chars.map((char, i) => (
                                <div
                                    key={char.id}
                                    tabIndex={i}
                                    onClick={() => {
                                        Transforms.select(editor, target);
                                        insertMention(editor, char.display);

                                        setTarget(null);
                                    }}
                                    className={cn(
                                        'px-2 py-3 cursor-pointer flex gap-4 items-center relative min-w-[300px] border-l-2 border-transparent focus:bg-polaris-bg-surface-secondary-hover focus:border-primary outline-none',
                                        {
                                            'bg-polaris-bg-surface-secondary-hover':
                                                i === index,
                                        }
                                    )}
                                >
                                    <Avatar
                                        alt={char.display}
                                        size='xs'
                                        shape='circle'
                                    />
                                    <div className='flex flex-col gap-1'>
                                        {char.display}
                                        {subLabelKey && (
                                            <div className='text-xs text-base-500'>
                                                {char[subLabelKey]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Portal>
                )}
            </Slate>
        );
    }
);

const Element = (props) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case 'mention':
            return <Mention {...props} />;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

const Mention = ({ attributes, children, element }) => {
    const selected = useSelected();
    const focused = useFocused();
    const style: React.CSSProperties = {
        padding: '2px 8px',
        margin: '0 2px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        fontSize: '12px',
        lineHeight: '16px',
        borderRadius: '100px',
        backgroundColor: 'var(--p-color-bg-surface-info)',
        color: 'var(--p-color-text-info)',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
        fontWeight: '600',
    };

    return (
        <span
            {...attributes}
            contentEditable={false}
            data-cy={`mention-${element.character.replace(' ', '-')}`}
            style={style}
        >
            @{element.character}
            {children}
        </span>
    );
};

const insertMention = (editor, character) => {
    const mention: MentionElement = {
        type: 'mention',
        character,
        children: [{ text: '' }],
    };

    Transforms.insertNodes(editor, mention);

    Transforms.move(editor);
};

const withMentions = (editor: any): BaseEditor & ReactEditor => {
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

const initialValue: Descendant[] = [
    {
        children: [
            {
                text: '',
            },
        ],
    },
];
