import { useMemo } from 'react';

import {
    GetFileDetails,
    HTML_REGEX,
    IsEmptyArray,
    IsFunction,
    ObjectDto,
    PlatformTypeEnum,
    useApp,
} from '@finnoto/core';

import {
    Avatar,
    DropdownMenu,
    Ellipsis,
    Icon,
    IconButton,
    openFullViewImage,
    Tooltip,
    Typography,
} from '../../Components';
import { formatChatDate } from '../../Components/Data-display/Chat/chat.bubble.component';
import { cn } from '../../Utils/common.ui.utils';

import {
    ArcMoreVerticalSvgIcon,
    DocumentFileSidebarSvgIcon,
    ImageRoundedSvgIcon,
    IntegrationSlackSvgIcon,
    RobotSvgIcon,
} from 'assets';

export interface MessageProps {
    message: string;
    date: string;
    image_url: string;
    user_name: string;
    type: 'sent' | 'received';
    appearance?: string;
    attachments?: ObjectDto[];
    background?: 'white' | 'secondary';
    fullWidth?: boolean;
    platform_id?: number;
    isPwa?: boolean;
    isSystemGenerated?: boolean;
}

export const Message = (props: MessageProps) => {
    const isHtml = useMemo(
        () => HTML_REGEX.test(props?.message),
        [props?.message]
    );

    const { isArc } = useApp();

    const commonClassName = cn(
        'relative rounded-lg bg-polaris-bg text-polaris-text px-3 py-2 text-polaris-size-325 leading-5 h-fit max-w-[67%] flex gap-2 justify-between',
        {
            'bg-polaris-bg-surface':
                props.background === 'white' ||
                (props?.type === 'received' && props.isPwa),
            'max-w-full flex-1': props.fullWidth,
            'bg-base-200': !isArc,
            'bg-neutral text-polaris-inverse':
                props?.type === 'sent' && props.isPwa,
        }
    );

    if (props.isSystemGenerated)
        return <SystemGeneratedMessage message={props.message} />;

    return (
        <div
            className={cn('flex w-full gap-2', {
                'justify-start flex-row-reverse': props.type === 'sent',
            })}
        >
            <Tooltip
                message={
                    <span className='gap-1 col-flex text-polaris-text'>
                        {props.user_name}
                        <span>{props.date}</span>
                    </span>
                }
            >
                <div className='w-8 h-8 rounded-full cursor-pointer centralize'>
                    <Avatar
                        {...{
                            source: props.image_url,
                            size: '32',
                            shape: 'circle',
                            alt: props.user_name,
                            randomBg: false,
                            imageWrapperClassName: cn(
                                props.appearance,
                                'border border-polaris-border-magic'
                            ),
                            className: '!text-xs',
                        }}
                    />
                </div>
            </Tooltip>

            {!isHtml ? (
                <div className={commonClassName}>
                    {props?.platform_id === PlatformTypeEnum.SLACK && (
                        <div
                            className={cn('absolute', {
                                'left-1': props.type === 'sent',
                                'right-2': props.type === 'received',
                            })}
                        >
                            <Tooltip message='Slack Message' asChild>
                                <div className='cursor-pointer'>
                                    <Icon
                                        source={IntegrationSlackSvgIcon}
                                        isSvg
                                        size={14}
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    )}
                    <div
                        className={cn(
                            'absolute w-4 h-[18px] rounded-sm bg-polaris-bg top-0',
                            {
                                'bg-base-200': !isArc,
                                'bg-base-100': props.background === 'white',
                            },
                            {
                                '-right-1 -skew-x-[33deg]':
                                    props.type === 'sent',
                                '-left-1 skew-x-[33deg] rounded-br-full':
                                    props.type === 'received',
                            },
                            {
                                hidden: props.isPwa,
                            }
                        )}
                    ></div>
                    <div className='flex-1 pb-5 col-flex'>
                        {!IsEmptyArray(props.attachments) && (
                            <div className='gap-1 flex flex-wrap mb-2.5'>
                                {props.attachments?.map((file, index) => (
                                    <ChatFileItem
                                        key={index}
                                        file={file}
                                        className={cn(
                                            'rounded border border-base-300'
                                        )}
                                        onClick={() =>
                                            openFullViewImage(
                                                props.attachments as any,
                                                index
                                            )
                                        }
                                        actionViewType='click'
                                        iconClassName={cn({
                                            'text-primary': props.isPwa,
                                        })}
                                    />
                                ))}
                            </div>
                        )}
                        <span
                            className={cn('whitespace-pre-wrap', {
                                'text-polaris-text-inverse':
                                    props.isPwa && props.type === 'sent',
                            })}
                        >
                            {props.message}
                        </span>
                    </div>
                    <span
                        className={cn(
                            'text-right min-w-[50px] self-end mt-6 text-[12px]',
                            {
                                'text-base-secondary': !isArc,
                                'text-polaris-text-secondary': isArc,
                                'text-polaris-text-inverse-secondary':
                                    props.isPwa && props.type === 'sent',
                            }
                        )}
                    >
                        {formatChatDate(props?.date)}
                    </span>
                </div>
            ) : (
                <div className={commonClassName}>
                    <div
                        dangerouslySetInnerHTML={{ __html: props.message }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export const NotesMessage = ({
    date,
    message,
    files,
    user,
}: {
    message: string;
    date: string;
    user: string;
    files: any[];
}) => {
    return (
        <div className='flex relative px-3 py-2 leading-5 rounded-lg bg-polaris-bg text-polaris-text text-polaris-size-325 h-fit notes-container'>
            <div className='flex-1 gap-2 pb-5 col-flex notes-comment'>
                <Typography>{message} </Typography>
                <div className='flex flex-wrap gap-3'>
                    {files?.map((file, index) => (
                        <ChatFileItem
                            key={index}
                            file={file}
                            className=''
                            onClick={() =>
                                openFullViewImage(files as any, index)
                            }
                            actionViewType='click'
                        />
                    ))}
                </div>
            </div>
            <div className='flex gap-2 self-end'>
                <Typography size='small' className='notes-author'>
                    {user}
                </Typography>
                {user && date && <div className='w-0.5 bg-base-300'></div>}
                <Typography size='small' className='notes-date'>
                    {date}
                </Typography>
            </div>
        </div>
    );
};

export const ChatFileItem = ({
    file,
    onRemove,
    className,
    onClick,
    actionViewType,
    iconClassName,
    nameWidth = 110,
}: {
    file: any;
    onRemove?: (index: number) => void;
    className?: string;
    onClick?: (e) => void;
    actionViewType: 'action' | 'click';
    iconClassName?: string;
    nameWidth?: number;
}) => {
    const extension = GetFileDetails(file?.document_url).extension;
    const icon = ['png', 'jpg', 'jpeg'].includes(extension)
        ? ImageRoundedSvgIcon
        : DocumentFileSidebarSvgIcon;

    return (
        <div
            className={cn(
                'p-1.5 rounded bg-polaris-bg border hover:bg-polaris-bg-fill-tertiary transition-all border-base-300 flex gap-2 items-center w-[180px]',
                {
                    'cursor-pointer': !!onClick && actionViewType === 'click',
                },
                className
            )}
            onClick={actionViewType === 'click' ? onClick : () => {}}
        >
            <Icon source={icon} isSvg size={20} iconColor={cn(iconClassName)} />
            <Ellipsis width={nameWidth} className='text-sm'>
                <span>{file?.attributes?.name ?? file?.name}</span>
            </Ellipsis>
            {IsFunction(onRemove) && (
                <DropdownMenu
                    actions={[
                        {
                            name: 'View',
                            action: onClick,
                            visible: actionViewType === 'action',
                        },
                        {
                            name: 'Remove',
                            action: () => onRemove(file.index),
                            isCancel: true,
                        },
                    ]}
                    align='end'
                    hideOnNoAction={true}
                >
                    <IconButton
                        icon={ArcMoreVerticalSvgIcon}
                        appearance='polaris-transparent'
                        size='xs'
                        iconSize={16}
                        iconClass='text-polaris-icon-secondary'
                        className='h-5 min-h-[20px]'
                    />
                </DropdownMenu>
            )}
        </div>
    );
};

const SystemGeneratedMessage = ({ message }) => {
    return (
        <div className='flex gap-2 items-center px-2 py-1 mx-auto rounded-full bg-error/10 w-fit'>
            <Avatar
                color='polaris-error'
                size='polaris-xs'
                icon={RobotSvgIcon}
                shape='circle'
                iconSize={10}
            />
            <Typography size='small'>{message}</Typography>
        </div>
    );
};
