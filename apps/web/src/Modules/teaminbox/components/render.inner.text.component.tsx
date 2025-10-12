import Image from 'next/image';
import Link from 'next/link';

import { Ellipsis, IsEmptyObject } from '@finnoto/core';
import { cn, Icon, IconButton } from '@finnoto/design-system';

import { DocumentSvgIcon, FileDownloadSvgIcon } from 'assets';

export const RenderInnerTextMessage = ({ message }: any) => {
    const payload = message?.payload;

    const renderComponent = () => {
        if (!IsEmptyObject(payload?.image)) {
            return (
                <div className='flex flex-col gap-2'>
                    <Image
                        height={300}
                        width={300}
                        alt='image'
                        src={payload?.image.link}
                    />

                    <span
                        className='text-sm text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: convertWhatsappFormatToHtml(
                                payload?.image?.caption
                            ),
                        }}
                    ></span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.document)) {
            const isNotPdf = !(payload?.document?.link as string).endsWith(
                '.pdf'
            );
            return (
                <div className='flex flex-col gap-2'>
                    {isNotPdf ? (
                        <div className='flex gap-2 items-center px-3 py-1 rounded bg-base-200'>
                            <Icon source={DocumentSvgIcon} isSvg />
                            <span className='text-sm'>
                                {Ellipsis({ text: payload?.document?.link })}
                            </span>
                            <Link
                                href={payload?.document?.link}
                                target='_blank'
                            >
                                <IconButton
                                    icon={FileDownloadSvgIcon}
                                    size='xs'
                                    appearance='base'
                                />
                            </Link>
                        </div>
                    ) : (
                        <iframe
                            src={payload?.document?.link}
                            width='100%'
                            height='100%'
                        />
                    )}

                    <span
                        className='text-sm text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: convertWhatsappFormatToHtml(
                                payload?.document?.caption
                            ),
                        }}
                    ></span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.video)) {
            return (
                <div className='flex flex-col gap-2'>
                    <video
                        src={payload?.video?.link}
                        width='100%'
                        height='100%'
                        controls
                    />

                    <span
                        className='text-sm text-primary-950'
                        dangerouslySetInnerHTML={{
                            __html: convertWhatsappFormatToHtml(
                                payload?.video?.caption
                            ),
                        }}
                    ></span>
                </div>
            );
        }
        if (!IsEmptyObject(payload?.audio)) {
            return (
                <div className='gap-1 col-flex'>
                    <div className='flex flex-col gap-2'>
                        <div className='h-[40px] w-[300px] flex items-center justify-center overflow-hidden'>
                            <audio
                                controls
                                src={payload?.audio?.link}
                                className='w-full'
                            />
                        </div>

                        <span
                            className='text-sm text-primary-950'
                            dangerouslySetInnerHTML={{
                                __html: convertWhatsappFormatToHtml(
                                    payload?.audio?.caption
                                ),
                            }}
                        ></span>
                    </div>
                </div>
            );
        }

        return (
            <div className='flex flex-col gap-2'>
                <span
                    className='text-sm whitespace-pre-line break-words text-primary-950'
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                    dangerouslySetInnerHTML={{
                        __html: convertWhatsappFormatToHtml(
                            payload?.text?.body
                        ),
                    }}
                ></span>
            </div>
        );
    };

    return (
        <div
            className={cn(
                'rounded-md px-2 py-1 shadow-md  self-end flex flex-col gap-1 text-black max-w-[50%] bg-green-200'
            )}
        >
            {renderComponent()}
        </div>
    );
};

export function convertWhatsappFormatToHtml(text: string): string {
    if (!text) return '';

    text = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    text = text.replace(/~(.*?)~/g, '<del>$1</del>');
    text = text.replace(/\n/g, '<br/>');

    return text;
}
