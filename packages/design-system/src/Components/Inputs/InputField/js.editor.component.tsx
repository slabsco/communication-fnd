import AceEditor, { ICommand } from 'react-ace';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

import { useCallback, useMemo, useRef } from 'react';

import { formatJsCode } from '../../../Utils/sql.editor.utils';

export const JsEditorComponent = ({ onChange, value }: any) => {
    const editor = useRef<any>();

    const beautifyText = useCallback(
        (value) => {
            const formatted = formatJsCode(value);
            onChange(formatted);
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
            placeholder='Add Code Here'
            mode='javascript'
            theme='monokai'
            name='JS Editor'
            onChange={onChange}
            fontSize={14}
            lineHeight={19}
            scrollMargin={[10, 10]}
            showPrintMargin={true}
            showGutter={true}
            value={value}
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
