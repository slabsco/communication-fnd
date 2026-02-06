import { Info, Reply } from 'lucide-react';
import { useMemo } from 'react';

import { cn, FormatDisplayDateStyled, Tooltip } from '@finnoto/design-system';

import { MessageSectionPreview } from '../../broadcast/your-templates/components/YourTemplatesPriview.component';
import { TemplateMessagePreview } from '../../template/components/template.preview.component';
import { initializeVariablesInState } from '../../template/constants/template.format';
import { DYNAMIC_MEDIA_URL_VARIABLE_NAME } from '../../template/types/template.category.types';
import { RenderInnerTextMessage } from './render.inner.text.component';
import { RenderUserMessageBubble } from './render.user.message.bubble';
import {
    MessageBubbleTimePopper,
    RenderSeenUnseen,
} from './seen.unseen.component';

const getData = (components: any[], type: string) => {
    if (!components?.length) return [];
    return components?.find((val) => val?.type === type)?.parameters || [];
};

const getDynamicDocument = (components: any[]) => {
    if (!components?.length) return [];

    const getLink = (type: string) => {
        const variable = components?.find((val) => val?.type === type)?.[type];
        return variable?.link;
    };

    return getLink('document') || getLink('video') || getLink('image');
};

export const MessageItem = ({ message }: { message: any }) => {
    const component = message?.payload?.template?.components;

    const header = getData(component, 'header');
    const footer = getData(component, 'footer');
    const body = getData(component, 'body');

    const dynamicDocument = getDynamicDocument(header);

    const sampleContent = useMemo(() => {
        const content = {};

        const allData = [...header, ...footer, ...body];

        allData?.forEach((element) => {
            content[element?.parameter_name || 'code'] = element?.text;
        });

        if (dynamicDocument) {
            content[DYNAMIC_MEDIA_URL_VARIABLE_NAME] = dynamicDocument;
        }

        return content;
    }, [body, dynamicDocument, footer, header]);

    const isSentBySystem =
        message?.attributes?.sent_by ||
        message?.attributes?.is_bot ||
        message?.from_external_source;

    if (message.is_log) {
        return (
            <div className='flex gap-1 justify-center items-center text-center'>
                <div className='text-[10px] centralize text-base-secondary'>
                    {message?.payload?.message},
                </div>
                {FormatDisplayDateStyled({
                    value: message?.created_at,
                    size: 'xs',
                    className: 'text-base-secondary text-[10px]',
                    containerClass: 'text-[10px]',
                })}
            </div>
        );
    }

    return (
        <div
            className={cn('w-full col-flex gap-2', {
                'mr-auto ': message.is_replied,
                'ml-auto ': isSentBySystem,
            })}
        >
            {component ? (
                <div className='flex flex-row-reverse gap-2 items-end'>
                    <RenderSeenUnseen message={message} />
                    {message?.template_config ? (
                        <TemplateMessagePreview
                            state={initializeVariablesInState(
                                {
                                    ...message?.template_config,
                                    header_media_detail:
                                        message?.template_attributes
                                            ?.header_media_detail,
                                },
                                sampleContent
                            )}
                            payload={message?.payload}
                            className='max-w-[40%] bg-green-200'
                            showTime={false}
                        />
                    ) : (
                        <MessageSectionPreview
                            sampleContent={sampleContent}
                            configuration={
                                message?.template_button_configurations
                            }
                            title={message?.template_title}
                            footer={message?.template_footer}
                            body={message?.template_body}
                            className='max-w-[50%] bg-green-200'
                            showTime={false}
                        />
                    )}

                    <MessageBubbleTimePopper message={message} />
                </div>
            ) : isSentBySystem ? (
                <>
                    {message?.payload?.interactive ? (
                        <RenderInteractiveMessage message={message} />
                    ) : (
                        <div className='flex flex-row-reverse gap-1 items-end'>
                            {message?.is_error && (
                                <Tooltip
                                    message={JSON.stringify(
                                        message.attributes?.errors?.[0]
                                            ?.error_data?.details ||
                                            message.response
                                    )}
                                >
                                    <Info size={14} color='red' />
                                </Tooltip>
                            )}

                            <RenderSeenUnseen message={message} />
                            <RenderInnerTextMessage message={message} />
                            <MessageBubbleTimePopper message={message} />
                        </div>
                    )}{' '}
                </>
            ) : (
                <></>
            )}

            {message?.is_replied && (
                <RenderUserMessageBubble message={message} />
            )}
        </div>
    );
};

const RenderInteractiveMessage = ({ message }: { message: any }) => {
    const interactive = message?.payload?.interactive;
    if (!interactive) return;

    return (
        <div className='flex flex-row-reverse gap-2 items-end'>
            <RenderSeenUnseen message={message} />
            <div
                className={cn(
                    'rounded-md px-1 py-1 shadow-md  w-[90%] self-end flex flex-col gap-1 text-black max-w-[50%] bg-green-200'
                )}
            >
                <div className='flex flex-col gap-2'>
                    <h3 className='font-bold'>{interactive?.header?.text}</h3>
                    <span className='text-sm text-primary-950'>
                        {interactive?.body?.text}
                    </span>
                </div>
                <div className='flex items-end text-muted-foreground'>
                    <span className='flex-1 text-xs text-base-secondary'>
                        {interactive?.footer?.text}
                    </span>
                </div>
                <div className='flex flex-col gap-2 mt-2 w-full'>
                    {interactive?.action?.buttons?.map((btn) => {
                        return (
                            <div
                                key={btn.reply.id}
                                className='flex gap-2 justify-center items-center w-full text-xs text-center text-info'
                            >
                                <Reply size={14} />
                                {btn.reply.title}
                            </div>
                        );
                    })}
                </div>
            </div>
            <MessageBubbleTimePopper message={message} />
        </div>
    );
};
