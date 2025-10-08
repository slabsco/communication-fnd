import { getVariableParamsFromString } from '@finnoto/core';
import { RichTextEditor } from '@finnoto/design-system';

import { convertWhatsappFormatToHtml } from '../../teaminbox/components/render.inner.text.component';
import { useTemplate } from '../template.context';

const SetTemplateBodyContent = () => {
    const { dispatch, state } = useTemplate();

    const { text, example } = state?.components?.find(
        (_com) => _com?.type === 'BODY'
    );

    const setContent = (html: string) => {
        const value = convertBodyToWhatsappFormat(html);
        const variables = getVariableParamsFromString(value);

        const params = variables?.map((_variable) => {
            const findExistingExample = example?.body_text_named_params.find(
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
                ...(variables?.length
                    ? {
                          example: {
                              body_text_named_params: params,
                          },
                      }
                    : {}),
            },
        });
    };

    return (
        <div>
            <RichTextEditor
                features={['bold', 'italic', 'underline']}
                labelProps={{
                    label: 'Body',
                    required: true,
                    className: 'text-lg',
                }}
                // error={}
                html={convertWhatsappFormatToHtml(text)}
                getHtml={setContent}
                enablePreview={false}
            />
        </div>
    );
};

export default SetTemplateBodyContent;

const convertBodyToWhatsappFormat = (html: string) => {
    html = html.replace(/<strong>(.*?)<\/strong>/g, '*$1*');
    html = html.replace(/<em>(.*?)<\/em>/g, '_$1_');
    html = html.replace(/<del>(.*?)<\/del>/g, ' ~$1~');
    html = html.replace(/<p[^>]*>(?!<br\s*\/?>)(.*?)<\/p>/g, '$1\n');
    html = html.replace(/<br\s*\/?>/g, '\n');
    html = html.replace(/<[^>]*>/g, '');
    return html;
};
