import { useState } from 'react';

import { getVariableParamsFromString } from '@finnoto/core';
import { ReactQuillComposite } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

const SetTemplateBodyContent = () => {
    const { dispatch, state } = useTemplate();

    const bodyComponent = state?.components?.find(
        (_com) => _com?.type === 'BODY'
    );

    const { text, example } = bodyComponent;

    const [body, setBody] = useState<string>();

    // Memoize the setContent function
    const setContent = (html: string) => {
        const value = convertHtmlToWhatsappFormat(html);
        const variables = getVariableParamsFromString(value);

        const params = variables?.map((_variable) => {
            const findExistingExample = example?.body_text_named_params?.find(
                (_param) => _param?.param_name === _variable
            );
            return {
                param_name: _variable,
                example: findExistingExample?.example || undefined,
            };
        });

        dispatch({
            type: 'UPDATE_BODY',
            payload: {
                text: value,
                example: {
                    body_text_named_params: params,
                },
            },
        });
    };

    return (
        <ReactQuillComposite
            className='mt-3'
            label='Body'
            value={body ? body : convertWhatsappFormatToHtml(text)}
            onChange={(value, delta, source, editor) => {
                setBody(value);
                setContent(value);
            }}
            placeholder='Enter text in English (US)'
        />
    );
};

export default SetTemplateBodyContent;

function convertHtmlToWhatsappFormat(html: string): string {
    if (!html) return '';

    // Replace <p> with newline, but only if not at the start
    let text = html.replace(/<p[^>]*>/gi, '\n');

    // Replace </p> with newline
    text = text.replace(/<\/p>/gi, '');

    // Replace <strong> and <b> with *text*
    text = text.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '*$2*');

    // Replace <em> and <i> with _text_
    text = text.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '_$2_');

    // Replace <del> and <s> with ~text~
    text = text.replace(/<(del|s)[^>]*>(.*?)<\/(del|s)>/gi, '~$2~');

    // Remove any remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Normalize all CRLF to LF
    text = text.replace(/\r\n/g, '\n');

    // Trim leading/trailing whitespace and newlines
    text = text.trim();

    return text;
}

export function convertWhatsappFormatToHtml(text: string): string {
    if (!text) return '';

    text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    text = text.replace(/~(.*?)~/g, '<del>$1</del>');
    text = text.replace(/\n/g, '<br/>');

    return text;
}
