import { InputField, SelectBox } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

const SetTemplateMedia = () => {
    const { dispatch, state } = useTemplate();
    const { format, text } = state.components.header;

    console.log({ state });

    return (
        <div className='flex gap-3 items-center mt-6'>
            <SelectBox
                width={200}
                value={format}
                label='Media sample'
                onChange={(_option) => {
                    dispatch({
                        type: 'UPDATE_HEADER_FORMAT',
                        payload: _option?.value,
                    });
                }}
                options={[
                    { label: 'None', value: undefined },
                    { label: 'Text', value: 'TEXT' },
                    { label: 'Image', value: 'IMAGE' },
                    { label: 'Video', value: 'VIDEO' },
                    { label: 'Document', value: 'DOCUMENT' },
                    { label: 'Location', value: 'LOCATION' },
                ]}
            />

            {format === 'TEXT' && (
                <InputField
                    className='w-full'
                    label='Header'
                    value={text}
                    placeholder={
                        'Add a sort line of text to the header of your message in English'
                    }
                />
            )}
        </div>
    );
};

export default SetTemplateMedia;
