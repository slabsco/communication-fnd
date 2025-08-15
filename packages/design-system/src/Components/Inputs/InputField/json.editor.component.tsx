import AceEditor, { ICommand } from 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';

import { useCallback, useMemo, useRef } from 'react';

export const JsonEditorComponent = ({ onChange, value }: any) => {
    const editor = useRef<any>();

    // Always display as string, but send as object
    const stringValue =
        typeof value === 'string'
            ? value
            : JSON.stringify(value ?? {}, null, 2);

    const handleChange = useCallback(
        (val: string) => {
            try {
                const parsed = JSON.parse(val);
                onChange(parsed); // send as object
            } catch (e) {
                // Optionally, you could show a toast or error
                onChange(val); // fallback: send as string if invalid
            }
        },
        [onChange]
    );

    const beautifyText = useCallback(
        (val) => {
            try {
                const parsed = typeof val === 'string' ? JSON.parse(val) : val;
                const formatted = JSON.stringify(parsed, null, 2);
                // After beautify, send as object
                onChange(parsed);
            } catch (e) {
                // Optionally, you could show a toast or error
            }
        },
        [onChange]
    );

    const commands = useMemo(() => {
        return [
            {
                bindKey: { mac: 'command-b', win: 'ctrl-b' },
                name: 'beautify',
                exec: () => {
                    beautifyText(editor?.current?.props?.value);
                },
            },
        ] as ICommand[];
    }, [beautifyText]);

    return (
        <AceEditor
            ref={editor}
            placeholder='Add JSON Here'
            mode='json'
            theme='monokai'
            name='JSON Editor'
            onChange={handleChange}
            fontSize={14}
            lineHeight={19}
            scrollMargin={[10, 10]}
            showPrintMargin={true}
            showGutter={true}
            value={stringValue}
            commands={commands}
            style={{ width: '100%' }}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: false,
            }}
        />
    );
};
