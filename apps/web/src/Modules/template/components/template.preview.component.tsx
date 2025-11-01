import {
    ArrowBigLeft,
    CameraIcon,
    CheckCircle,
    Copy,
    FileIcon,
    InfoIcon,
    Link,
    Mic,
    PhoneCallIcon,
    Reply,
} from 'lucide-react';
import { useMemo } from 'react';

import {
    newReplaceVariablesInString,
    replaceVariablesInString,
} from '@finnoto/core';
import { cn } from '@finnoto/design-system';
import { RenderPdfDocument } from '@finnoto/design-system/src/Components/Data-display/ResourceViewer/Components/pdfViewer.component';

import { convertWhatsappFormatToHtml } from '../../teaminbox/components/render.inner.text.component';
import { useTemplate } from '../template.context';
import { TemplateState } from '../types/template.category.types';

const getValue = (components, type) =>
    components?.find((_com) => _com?.type === type);

const TemplatePreviewComponentContainer = () => {
    const { state } = useTemplate();
    return <TemplatePreviewer state={state} />;
};

export default TemplatePreviewComponentContainer;

export const TemplatePreviewer = ({ state }: { state: any }) => {
    return (
        <div className='h-full centralize'>
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
                            This business uses a secure service from Meta to
                            manage this chat. Tap to learn more
                        </span>
                    </div>
                    <TemplateMessagePreview state={state} />
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
        </div>
    );
};

export const TemplateMessagePreview = ({
    state,
    className,
    showTime = true,
}: {
    state: TemplateState;
    className?: string;
    showTime?: boolean;
}) => {
    const body = getValue(state?.components, 'BODY');
    const header = getValue(state?.components, 'HEADER');
    const footer = getValue(state?.components, 'FOOTER');
    const { buttons } = getValue(state?.components, 'BUTTONS') || {};

    const { format, text = '', example } = header || {};
    const { header_media_detail } = state || {};

    const renderTitle = useMemo(() => {
        if (format === 'IMAGE') {
            return (
                <div className='h-[150px] w-full border'>
                    <img
                        alt='image'
                        src={
                            header_media_detail?.document_url ||
                            example?.header_handle?.[0]
                        }
                        className='w-full h-full'
                    />
                </div>
            );
        }
        if (format === 'DOCUMENT') {
            return (
                <div className='overflow-hidden w-full border'>
                    <RenderPdfDocument
                        url={header_media_detail?.document_url}
                        className='w-full h-full'
                    />
                </div>
            );
        }
        if (format === 'VIDEO') {
            return (
                <div className='overflow-hidden w-full max-h-60 border'>
                    <video
                        src={header_media_detail?.document_url}
                        className='object-contain w-full h-full'
                        controls
                    />
                </div>
            );
        }
        if (format === 'TEXT') {
            return replaceVariablesInString(text, {});
        }

        return <></>;
    }, [
        example?.header_handle,
        format,
        header_media_detail?.document_url,
        text,
    ]);

    const renderButton = (button: any) => {
        const { type, text, example } = button;

        if (type === 'QUICK_REPLY') {
            return (
                <div className='flex gap-2 justify-center items-center w-full text-xs text-center text-info'>
                    <Reply size={14} /> {text}
                </div>
            );
        }
        if (type === 'URL') {
            return (
                <div className='flex gap-2 justify-center items-center w-full text-xs text-center text-info'>
                    <Link size={14} /> {text}
                </div>
            );
        }
        if (type === 'PHONE_NUMBER') {
            return (
                <div className='flex gap-2 justify-center items-center w-full text-xs text-center text-info'>
                    <PhoneCallIcon size={14} /> {text}
                </div>
            );
        }
        if (type === 'COPY_CODE') {
            return (
                <div className='flex gap-2 justify-center items-center w-full text-xs text-center text-info'>
                    <Copy size={14} /> Copy Code
                </div>
            );
        }
        if (type === 'otp') {
            return (
                <div className='flex gap-2 justify-center items-center w-full text-xs text-center text-info'>
                    <Copy size={14} /> Copy Code
                </div>
            );
        }

        return <></>;
    };

    return (
        <div
            className={cn(
                'bg-white rounded-md px-3 py-2 shadow-md  w-[90%] self-end flex flex-col gap-1 text-black',
                className
            )}
        >
            <div className='flex flex-col gap-2'>
                <h3 className='font-bold'>{renderTitle}</h3>
                {state?.category === 'AUTHENTICATION' ? (
                    <span className='text-xs text-primary-950'>
                        <b>******</b> is your verification code.{' '}
                        {body?.add_security_recommendation &&
                            ' For your security, do not share this code.'}
                    </span>
                ) : (
                    <span
                        className='text-xs text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: newReplaceVariablesInString(
                                convertWhatsappFormatToHtml(body?.text),
                                body?.example?.body_text_named_params
                            ),
                        }}
                    ></span>
                )}
            </div>
            <div className='flex items-end text-muted-foreground'>
                <span className='flex-1 text-xs text-base-secondary'>
                    {footer?.text}
                    {footer?.code_expiration_minutes &&
                        `Expires in ${footer?.code_expiration_minutes}  minutes.`}
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
                {buttons?.map((_button) => {
                    return renderButton(_button);
                })}
            </div>
        </div>
    );
};
