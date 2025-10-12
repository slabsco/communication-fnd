import { useMemo } from 'react';

import {
    getVariableParamsFromString,
    IsEmptyArray,
    ObjectDto,
} from '@finnoto/core';
import { InputField } from '@finnoto/design-system';

const YourTemplateEditorDisplaySampleContent = ({
    title,
    body,
    onBodyChange,
    defaultVal,
}: {
    title: any;
    body: any;
    onBodyChange?: any;
    defaultVal?: ObjectDto;
}) => {
    const variables = useMemo(() => {
        const titleVar = getVariableParamsFromString(title?.value);
        const bodyVar = getVariableParamsFromString(body);

        return Array.from(new Set([...titleVar, ...bodyVar]));
    }, [title, body]);

    if (IsEmptyArray(variables)) return <></>;

    return (
        <div className='flex flex-col'>
            <hr className='my-4 border-t border-gray-300' />
            <h3 className='font-semibold'>Sample Content</h3>
            <p className='text-xs'>
                Just enter sample content here (it doesn’t need to be exact!)
            </p>
            <div className='flex flex-col gap-2 my-4'>
                {variables.map((variable, index) => {
                    const data = defaultVal?.[variable];
                    return (
                        <InputField
                            defaultValue={data}
                            key={variable}
                            placeholder={`Enter the sample value for ${variable}`}
                            onChange={(e) => {
                                onBodyChange?.(variable, e);
                            }}
                        />
                    );
                })}
            </div>
            <p className='text-xs'>
                Make sure not to include any actual user or customer
                information, and provide only sample content in your examples.
                Learn more
            </p>
        </div>
    );
};

export default YourTemplateEditorDisplaySampleContent;
