import { RichTextEditor } from '@finnoto/design-system';

const SetTemplateBodyContent = () => {
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
                // html={}
                getHtml={(html) => {}}
                enablePreview={false}
            />
        </div>
    );
};

export default SetTemplateBodyContent;
