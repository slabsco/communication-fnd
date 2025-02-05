import {
    ArrowBigLeft,
    CameraIcon,
    CheckCircle,
    FileIcon,
    InfoIcon,
    Mic,
} from 'lucide-react';
import { useMemo } from 'react';

import {
    IsArray,
    isLetterVariable,
    replaceVariablesInString,
} from '@finnoto/core';
import { cn } from '@finnoto/design-system';
import { PdfViewer } from '@finnoto/design-system/src/Components/Data-display/ResourceViewer/Components/pdfViewer.component';

import { YOUR_TEMPLATE_SUPPORTED_CONFIG } from './YourTemplateEditor.button.component';

export const YourTemplatesPreview = ({
    body = '',
    title = '',
    footer = '',
    sampleContent,
    configuration = {},
}: {
    body: string;
    title?: any;
    footer?: string;
    sampleContent: any;
    configuration: any;
}) => {
    return (
        <div className='w-[350px] h-[612px] max-h-[700px]  bg-green-400 rounded-lg shadow-md flex flex-col'>
            <header className='w-full h-[44px] bg-primary-900 flex items-center px-4 justify-between'>
                <div className='flex gap-2 items-center'>
                    <i className='material-symbols-outlined text-primary-50'>
                        <ArrowBigLeft color='white' />
                    </i>
                    <div className='w-[28px] h-[28px] bg-white rounded-full overflow-hidden'>
                        <img
                            src='https://tools-api.webcrumbs.org/image-placeholder/28/28/avatars/1'
                            alt='avatar'
                            className='object-contain w-full h-full'
                        />
                    </div>
                    <span className='text-sm text-primary-50 font-title'>
                        Whatsapp
                    </span>
                    <span className='text-sm text-white material-symbols-outlined'>
                        <CheckCircle />
                    </span>
                </div>
            </header>

            <section className='flex overflow-y-auto flex-col flex-1 gap-4 justify-start items-center p-4 bg-neutral-300'>
                <div className='w-[90%] bg-primary text-white p-2 flex rounded-md text-primary-950 text-xs'>
                    <i className='mr-1 text-base align-middle material-symbols-outlined text-primary-500'>
                        <InfoIcon />
                    </i>
                    <span>
                        This business uses a secure service from Meta to manage
                        this chat. Tap to learn more
                    </span>
                </div>

                <MessageSectionPreview
                    {...{ body, title, footer, sampleContent, configuration }}
                />
            </section>

            <footer className='w-full h-[60px] bg-neutral-50 flex items-center gap-3 px-4'>
                <i className='material-symbols-outlined text-primary-500'>
                    <FileIcon />
                </i>
                <div className='flex-1 px-4 py-2 bg-white rounded-full border border-neutral-300'>
                    <input
                        type='text'
                        placeholder='Type a message'
                        className='w-full text-sm bg-transparent outline-none text-primary-950'
                    />
                </div>
                <i className='material-symbols-outlined text-primary-500'>
                    <Mic />
                </i>
                <i className='material-symbols-outlined text-primary-500'>
                    <CameraIcon />
                </i>
            </footer>
        </div>
    );
};

export const MessageSectionPreview = ({
    body = '',
    title = '',
    footer = '',
    sampleContent,
    configuration = {},
    className,
    showTime = true,
}: {
    body: string;
    title?: any;
    footer?: string;
    sampleContent: any;
    configuration: any;
    className?: string;
    showTime?: boolean;
}) => {
    const renderTitle = useMemo(() => {
        const { type, value } = title;
        if (type === 'image') {
            const isVariable = isLetterVariable(value);
            return (
                <div className='h-[150px] w-full border'>
                    {isVariable ? (
                        value
                    ) : (
                        <img
                            alt='image'
                            src={value}
                            className='w-full h-full'
                        />
                    )}
                </div>
            );
        }
        if (type === 'document') {
            return (
                <div className='overflow-hidden w-60 h-60 border'>
                    <PdfViewer url={value} />
                </div>
            );
        }
        if (type === 'text') {
            return replaceVariablesInString(value, sampleContent);
        }

        return value;
    }, [title, sampleContent]);

    const renderButton = useMemo(() => {
        return Object.entries(configuration).map(([key, val]: any) => {
            const getValues = YOUR_TEMPLATE_SUPPORTED_CONFIG.find(
                (val) => val?.type === key
            );

            if (IsArray(val)) {
                return val?.map((data: any, index) => {
                    return (
                        <div
                            key={index}
                            className='flex gap-2 justify-center items-center w-full text-xs font-medium text-center text-info'
                        >
                            {getValues?.icon} {data}
                        </div>
                    );
                });
            }

            return (
                <div
                    key={key}
                    className='flex gap-2 justify-center items-center w-full text-xs font-medium text-center text-info'
                >
                    {getValues?.icon} {val?.name}
                </div>
            );
        });
    }, [configuration]);

    return (
        <div
            className={cn(
                'bg-white rounded-md p-3 shadow-md  w-[90%] self-end flex flex-col gap-1 text-black',
                className
            )}
        >
            <div className='flex flex-col gap-2'>
                <h3 className='font-bold'>{renderTitle}</h3>
                <span
                    className='text-sm text-primary-950'
                    dangerouslySetInnerHTML={{
                        __html: replaceVariablesInString(body, sampleContent),
                    }}
                ></span>
            </div>
            <div className='flex items-end text-muted-foreground'>
                <span className='flex-1 text-xs text-base-secondary'>
                    {footer}
                </span>
                {showTime && (
                    <span className='text-xs text-right text-neutral-500'>
                        {`${new Date().getHours()}:${String(
                            new Date().getMinutes()
                        ).padStart(2, '0')}`}
                    </span>
                )}
            </div>
            <div className='flex flex-col gap-2 mt-2 w-full'>
                {renderButton}
            </div>
        </div>
    );
};
