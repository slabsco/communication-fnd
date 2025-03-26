import { RichTextEditor } from '@finnoto/design-system';

import { FlowBuilderQuestionModalHeader } from './flowbuilder.answer.options.component';

const FlowBuilderMessageComponent = ({
    getHtml,
    html,
}: {
    html: string;
    getHtml: (html: string) => void;
}) => {
    return (
        <div className='gap-2 col-flex'>
            <FlowBuilderQuestionModalHeader name={'Question text'} />
            <RichTextEditor
                features={['bold', 'italic', 'underline']}
                labelProps={{}}
                html={html}
                getHtml={getHtml}
                enablePreview={false}
                height={200}
            />
        </div>
    );
};

export default FlowBuilderMessageComponent;
