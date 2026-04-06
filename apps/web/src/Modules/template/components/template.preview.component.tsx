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

/** Resolves `text` for a URL button from a sent template payload (Cloud API shape). */
const getUrlButtonParameterText = (payload: any, buttonIndex: number) => {
    const components = payload?.template?.components ?? payload?.components;
    if (!Array.isArray(components)) return undefined;
    const comp = components.find(
        (c: any) =>
            c?.type === 'button' &&
            String(c?.sub_type ?? '').toLowerCase() === 'url' &&
            String(c?.index) === String(buttonIndex)
    );
    const param = comp?.parameters?.find((p: any) => p?.type === 'text');
    return param?.text;
};

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
    payload,
}: {
    state: TemplateState;
    className?: string;
    showTime?: boolean;
    payload?: any;
}) => {
    const body = getValue(state?.components, 'BODY');
    const header = getValue(state?.components, 'HEADER');
    const footer = getValue(state?.components, 'FOOTER');
    const { buttons } = getValue(state?.components, 'BUTTONS') || {};

    const { format, text = '', example } = header || {};
    const { header_media_detail } = state || {};
    const { dynamic_media } = header_media_detail || {};

    const url =
        state.header_media_detail?.document_url ||
        dynamic_media?.url ||
        example?.header_handle?.[0];

    const renderTitle = useMemo(() => {
        if (format === 'IMAGE') {
            return (
                <div className='h-[150px] w-full border'>
                    <img alt='image' src={url} className='w-full h-full' />
                </div>
            );
        }
        if (format === 'DOCUMENT') {
            return (
                <div className='overflow-hidden w-full border'>
                    <RenderPdfDocument url={url} className='w-full h-full' />
                </div>
            );
        }
        if (format === 'VIDEO') {
            const parameters = payload?.template?.components?.find(
                (_component) => _component?.type === 'header'
            )?.parameters;

            const videoUrl = parameters?.find?.(
                (_parameter) => _parameter?.type === 'video'
            )?.video?.link;

            return (
                <div className='overflow-hidden w-full max-h-60 border aspect-video'>
                    <video
                        src={url || videoUrl}
                        className='object-cover w-full h-full'
                        controls
                    />
                </div>
            );
        }
        if (format === 'TEXT') {
            return replaceVariablesInString(text, {});
        }

        return <></>;
    }, [format, url, payload?.template?.components, text]);

    const renderButton = (button: any, buttonIndex: number) => {
        const { type, text, example } = button;

        if (type === 'QUICK_REPLY') {
            return (
                <div className='flex gap-2 justify-center items-center w-full text-xs text-center text-info'>
                    <Reply size={14} /> {text}
                </div>
            );
        }
        if (type === 'URL') {
            const rawUrl = button.url;
            const isDynamic = /\{\{1\}\}\s*$/i.test(rawUrl ?? '');
            const sample = Array.isArray(button.example)
                ? button.example[0]
                : undefined;
            const fromPayload = getUrlButtonParameterText(payload, buttonIndex);
            const trimmedPayload =
                fromPayload != null ? String(fromPayload).trim() : '';

            let previewUrl: string | undefined;
            if (trimmedPayload) {
                if (isDynamic) {
                    previewUrl = /^https?:\/\//i.test(trimmedPayload)
                        ? trimmedPayload
                        : String(rawUrl ?? '').replace(
                              /\{\{1\}\}/i,
                              trimmedPayload
                          );
                } else {
                    previewUrl = trimmedPayload;
                }
            } else if (isDynamic && sample) {
                previewUrl = String(rawUrl ?? '').replace(/\{\{1\}\}/i, sample);
            } else {
                previewUrl = rawUrl;
            }

            return (
                <div className='flex flex-col gap-0.5 justify-center items-center w-full text-xs text-center text-info'>
                    <div className='flex gap-2 justify-center items-center'>
                        <Link size={14} /> {text}
                    </div>
                    {previewUrl ? (
                        <span
                            className='max-w-full text-[10px] font-normal truncate text-neutral-500'
                            title={previewUrl}
                        >
                            {previewUrl}
                        </span>
                    ) : null}
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
                {buttons?.map((_button, buttonIndex) => {
                    return renderButton(_button, buttonIndex);
                })}
            </div>
        </div>
    );
};
