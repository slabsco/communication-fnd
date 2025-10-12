// Quill and ReactQuill should be installed in the project
import dynamic from 'next/dynamic';
import React from 'react';

import 'react-quill/dist/quill.snow.css';

import { ReactQuillProps } from 'react-quill';

import { cn } from '../../../Utils/common.ui.utils';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type ReactQuillCompositeProps = {
    value: string;
    onChange: ReactQuillProps['onChange'];
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
    error?: string;
    [key: string]: any;
};

const defaultModules = {
    toolbar: [
        // [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        // [{ list: 'ordered' }, { list: 'bullet' }],
        // ['code-block'],
        // ['link'],
        // [{ color: [] }, { background: [] }],
        // [{ align: [] }],
        // ['clean'],
    ],
};

const defaultFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
    'color',
    'background',
    'align',
];

export const ReactQuillComposite: React.FC<ReactQuillCompositeProps> = ({
    value,
    onChange,
    placeholder,
    readOnly = false,
    className,
    style,
    label,
    error,
    ...props
}) => {
    return (
        <div
            className={cn(className, 'overflow-hidden h-[300px] col-flex')}
            style={style}
        >
            {label && (
                <label
                    style={{
                        fontWeight: 500,
                        marginBottom: 4,
                        display: 'block',
                    }}
                >
                    {label}
                </label>
            )}

            <ReactQuill
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                modules={defaultModules}
                formats={defaultFormats}
                className='overflow-hidden flex-1 h-full col-flex'
            />
            {error && (
                <div style={{ color: 'red', marginTop: 4, fontSize: 12 }}>
                    {error}
                </div>
            )}
        </div>
    );
};
