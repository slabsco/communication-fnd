import { addHours } from 'date-fns';
import { Contact, MessageCircle, User } from 'lucide-react';
import { ReactNode, useCallback, useEffect } from 'react';
import { useEffectOnce } from 'react-use';

import {
    FetchData,
    FormatDisplayDate,
    IsEmptyArray,
    IsEmptyObject,
} from '@finnoto/core';
import { TeamInboxController } from '@finnoto/core/src/backend/communication/controller/team.inbox.controller';
import {
    Avatar,
    Button,
    FormatDisplayDateStyled,
    IconButton,
    Loading,
} from '@finnoto/design-system';

import { addAssignee } from '../add.assignee.form.util';
import {
    RefetchTeamInboxDetail,
    useTeamInbox,
} from '../context/teaminbox.context.main';
import { RefetchTeamInboxListing } from '../hooks/useTeamInboxMessageListing.hook';
import { DisplayTeamInboxStatus } from './chat.message.detail.component';
import InboxBotMode from './inbox.bot.mode';

import { EyeSvgIcon } from 'assets';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ContactField {
    key: string;
    icon: string;
    value?: string;
    condition?: (data: any) => boolean;
    formatter?: (data: any) => string | ReactNode;
    getValue?: (data: any) => any;
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
}

interface DisplayMode {
    compress: boolean;
    iconSize: number;
    cardComponent: React.ComponentType<InfoCardProps>;
    containerClass: string;
    gridClass: string;
}
// ============================================================================
// BASE COMPONENTS
// ============================================================================

const InfoCard = ({ icon, title, children, className = '' }: InfoCardProps) => (
    <div
        className={`flex flex-col gap-2 p-2 bg-white rounded-lg border shadow-sm dark:bg-base-200 ${className}`}
    >
        <div className='flex gap-2 items-center mb-2'>
            <span className='text-primary'>{icon}</span>
            <span className='text-base font-semibold'>{title}</span>
        </div>
        <div>{children}</div>
    </div>
);

const InfoCardCompress = ({
    icon,
    title,
    children,
    className = '',
}: InfoCardProps) => (
    <div
        className={`flex flex-col flex-wrap gap-1 items-start px-2 py-1 text-xs bg-white rounded border shadow-sm sm:flex-row sm:gap-2 sm:items-center dark:bg-base-200 ${className}`}
    >
        <span className='flex-shrink-0 text-primary'>{icon}</span>
        <span className='flex-shrink-0 font-semibold'>{title}:</span>
        <div className='w-full truncate sm:flex-1'>{children}</div>
    </div>
);

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const CONTACT_FIELDS: ContactField[] = [
    {
        key: 'phone',
        icon: 'phone',
        getValue: (data) =>
            `${data?.contact?.dialing_code}${data.contact?.mobile}`,
    },
    {
        key: 'created_at',
        icon: 'calendar_today',
        getValue: (data) => FormatDisplayDate(data.contact?.created_at),
    },
];

const DISPLAY_MODES: Record<'normal' | 'compress', DisplayMode> = {
    normal: {
        compress: false,
        iconSize: 18,
        cardComponent: InfoCard,
        containerClass:
            'flex overflow-y-auto flex-col col-span-1 gap-4 p-4 h-full rounded border bg-polaris-bg-surface',
        gridClass: 'grid grid-cols-3 gap-4',
    },
    compress: {
        compress: true,
        iconSize: 14,
        cardComponent: InfoCardCompress,
        containerClass:
            'flex overflow-y-auto flex-col gap-2 p-2 h-full text-xs rounded border bg-polaris-bg-surface w-full',
        gridClass: 'flex flex-col gap-1',
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getContactFields = (data: any): ContactField[] => {
    return CONTACT_FIELDS.map((field) => ({
        ...field,
        value: field.getValue(data),
    })).filter((field) => {
        if (field.condition) {
            return field.condition(data);
        }
        return field.value;
    });
};

const getExpirationDate = (data: any) => {
    if (data?.expired_at) {
        return {
            label: 'Chat Expired At',
            value: FormatDisplayDateStyled({ value: data.expired_at as any }),
        };
    }
    return {
        label: 'Chat Expires At',
        value: FormatDisplayDateStyled({
            value: addHours(
                new Date(data?.last_activity_at || data?.created_at),
                24
            ) as any,
        }),
    };
};

const handleAddAssignee = (data: any) => {
    return () => addAssignee(data?.id, data, RefetchTeamInboxDetail);
};

// ============================================================================
// FIELD COMPONENTS
// ============================================================================

const ContactFieldItem = ({
    field,
    compress = false,
}: {
    field: ContactField;
    compress?: boolean;
}) => {
    const iconSize = compress ? 'text-xs' : 'text-base';
    const containerClass = compress
        ? 'flex items-center gap-1 px-2 py-0.5 rounded bg-polaris-bg-surface'
        : 'flex gap-2 items-center px-3 py-1 rounded-lg shadow-sm bg-polaris-bg-surface';
    const textClass = compress ? 'truncate' : 'text-sm text-base-content';

    const displayValue: any = field.formatter
        ? field.formatter(field)
        : field.value;

    return (
        <div className={containerClass}>
            <span className={`${iconSize} material-icons text-primary`}>
                {field.icon}
            </span>
            <span className={textClass}>{displayValue}</span>
        </div>
    );
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const AssigneeSection = ({
    data,
    compress = false,
}: {
    data: any;
    compress?: boolean;
}) => {
    const mode = DISPLAY_MODES[compress ? 'compress' : 'normal'];
    const CardComponent = mode.cardComponent;
    const title = compress ? 'Assignee' : 'Assignee Info';
    const buttonText = compress ? 'Add' : 'Add Assignee';

    return (
        <CardComponent icon={<User size={mode.iconSize} />} title={title}>
            {data?.assignee?.id ? (
                <div
                    className={`flex ${
                        compress ? 'gap-1 items-center' : 'flex-col gap-1'
                    }`}
                >
                    <div
                        className={`flex ${
                            compress
                                ? 'gap-1 items-center'
                                : 'gap-2 items-center'
                        }`}
                    >
                        <span className={compress ? 'truncate' : 'font-medium'}>
                            {data?.assignee?.user?.name}
                        </span>
                        <IconButton
                            icon={EyeSvgIcon}
                            iconSize={14}
                            size='xs'
                            name='Change Assignee'
                            outline
                            onClick={handleAddAssignee(data)}
                        />
                    </div>
                    {!compress && (
                        <span className='text-sm text-base-secondary'>
                            {data?.assignee?.user?.email}
                        </span>
                    )}
                </div>
            ) : (
                <Button size='xs' outline onClick={handleAddAssignee(data)}>
                    {buttonText}
                </Button>
            )}
        </CardComponent>
    );
};

const BotSection = ({
    data,
    compress = false,
}: {
    data: any;
    compress?: boolean;
}) => {
    const mode = DISPLAY_MODES[compress ? 'compress' : 'normal'];
    const CardComponent = mode.cardComponent;
    const title = compress ? 'Bot' : 'Bot Mode';
    const iconClass = compress ? 'text-base' : 'text-lg';

    return (
        <CardComponent
            icon={<span className={`${iconClass} i-robot`} />}
            title={title}
        >
            <InboxBotMode />
        </CardComponent>
    );
};

const ChatInfoSection = ({
    data,
    compress = false,
}: {
    data: any;
    compress?: boolean;
}) => {
    const mode = DISPLAY_MODES[compress ? 'compress' : 'normal'];
    const CardComponent = mode.cardComponent;
    const title = compress ? 'Expires At' : 'Chat Info';
    const expiration = getExpirationDate(data);

    return (
        <CardComponent
            icon={<MessageCircle size={mode.iconSize} />}
            title={title}
        >
            {compress ? (
                <span>{expiration.value}</span>
            ) : (
                <div className='flex flex-col gap-2'>
                    <div>
                        <label className='text-xs text-gray-500'>
                            {expiration.label}
                        </label>
                        <div className='font-medium'>{expiration.value}</div>
                    </div>
                </div>
            )}
        </CardComponent>
    );
};
const ChatIdentifierSection = ({
    data,
    compress = false,
}: {
    data: any;
    compress?: boolean;
}) => {
    const mode = DISPLAY_MODES[compress ? 'compress' : 'normal'];
    const CardComponent = mode.cardComponent;

    const identifier = data?.contact?.identifier;
    if (!identifier) return <></>;

    return (
        <CardComponent
            icon={<MessageCircle size={mode.iconSize} />}
            title={'Identifier'}
        >
            {compress ? (
                <span>{identifier}</span>
            ) : (
                <div className='flex flex-col gap-2'>
                    <div>
                        <label className='text-xs text-gray-500'>
                            {'Identifier'}
                        </label>
                        <div className='font-medium'>{identifier}</div>
                    </div>
                </div>
            )}
        </CardComponent>
    );
};

const CustomAttributesSection = ({
    data,
    compress = false,
}: {
    data: any;
    compress?: boolean;
}) => {
    if (IsEmptyArray(data?.contact?.custom_attributes)) return null;

    const mode = DISPLAY_MODES[compress ? 'compress' : 'normal'];
    const CardComponent = mode.cardComponent;
    const containerClass = compress
        ? 'flex flex-col gap-1 max-h-[120px] overflow-y-auto'
        : 'max-h-[300px] overflow-y-auto';

    if (compress) {
        return (
            <div className={containerClass}>
                {data?.contact?.custom_attributes?.map((val: any) => (
                    <CardComponent
                        key={val?.key}
                        icon={<Contact size={mode.iconSize} />}
                        title={val?.key}
                    >
                        <span className='truncate'>{val?.value}</span>
                    </CardComponent>
                ))}
            </div>
        );
    }

    return (
        <CardComponent
            icon={<Contact size={mode.iconSize} />}
            title='Contact Attributes'
            className={containerClass}
        >
            <div className='flex flex-col gap-2'>
                {data?.contact?.custom_attributes?.map((val: any) => (
                    <div className='flex flex-col gap-0.5' key={val?.key}>
                        <label className='text-xs text-gray-500'>
                            {val?.key}
                        </label>
                        <div className='font-medium'>{val?.value}</div>
                    </div>
                ))}
            </div>
        </CardComponent>
    );
};

// ============================================================================
// CONTACT HEADER COMPONENTS
// ============================================================================

const ContactInfo = ({
    data,
    compress = false,
}: {
    data: any;
    compress?: boolean;
}) => {
    const displayName = data.contact?.display_name || 'No Name';
    const company = data.contact?.company;

    if (compress) {
        return (
            <div className='flex flex-col flex-1 min-w-0'>
                <span className='font-bold truncate'>{displayName}</span>
                {company && (
                    <span className='text-[10px] text-base-secondary truncate'>
                        {company}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className='flex flex-col flex-1 gap-2'>
            <div className='flex flex-col gap-1'>
                <span className='text-2xl font-bold text-base-content'>
                    {displayName}
                </span>
                {company && (
                    <span className='text-sm font-medium text-base-secondary'>
                        {company}
                    </span>
                )}
            </div>
            <div className='flex flex-wrap gap-4 mt-2'>
                {getContactFields(data).map((field, index) => (
                    <ContactFieldItem key={index} field={field} />
                ))}
            </div>
        </div>
    );
};

const ContactHeader = ({
    data,
    compress = false,
}: {
    data: any;
    compress?: boolean;
}) => {
    const avatarSize = compress ? 'sm' : 'lg';
    const containerClass = compress
        ? 'flex gap-2 items-center p-2 bg-white rounded border  dark:bg-base-200'
        : 'flex gap-6 items-center p-6 bg-white rounded-xl border  transition-all dark:bg-base-200';

    return (
        <div className={containerClass}>
            <div className='flex-shrink-0'>
                <Avatar
                    color='primary'
                    size={avatarSize}
                    shape='circle'
                    alt={data.contact?.display_name}
                />
            </div>
            <ContactInfo data={data} compress={compress} />
            <DisplayTeamInboxStatus currentInboxDetail={data} />
        </div>
    );
};

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const LoadingSpinner = ({ compress = false }: { compress?: boolean }) => (
    <div className='flex justify-center items-center h-full'>
        <Loading color='primary' size={compress ? 'md' : 'xl'} />
    </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RightSection = ({
    compress = false,
}: { compress?: boolean } = {}) => {
    const { currentInboxDetail: data, isLoading } = useTeamInbox();
    const mode = DISPLAY_MODES[compress ? 'compress' : 'normal'];

    const setMessageRead = useCallback(async () => {
        const { success } = await FetchData({
            className: TeamInboxController,
            method: 'markAsRead',
            methodParams: data?.id,
        });
        if (success) RefetchTeamInboxListing();
    }, [data?.id]);

    useEffect(() => {
        const unread = data?.attributes?.unread_count;
        if (unread) setMessageRead();
    }, [data, setMessageRead]);

    useEffectOnce(() => {
        RefetchTeamInboxDetail();
    });

    if (IsEmptyObject(data)) return <></>;

    return (
        <div className={mode.containerClass}>
            {isLoading ? (
                <LoadingSpinner compress={compress} />
            ) : (
                <>
                    <ContactHeader data={data} compress={compress} />

                    {compress && (
                        <div className='flex flex-wrap gap-1'>
                            {getContactFields(data).map((field, index) => (
                                <ContactFieldItem
                                    key={index}
                                    field={field}
                                    compress={true}
                                />
                            ))}
                        </div>
                    )}

                    <div className={mode.gridClass}>
                        <AssigneeSection data={data} compress={compress} />
                        <BotSection data={data} compress={compress} />
                        <ChatInfoSection data={data} compress={compress} />
                        <ChatIdentifierSection
                            data={data}
                            compress={compress}
                        />
                    </div>

                    <CustomAttributesSection data={data} compress={compress} />
                </>
            )}
        </div>
    );
};
