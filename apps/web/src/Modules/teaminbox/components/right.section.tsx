import { addHours } from 'date-fns';
import { Contact, MessageCircle, User } from 'lucide-react';

import { IsEmptyArray, IsEmptyObject, useQueryClient } from '@finnoto/core';
import {
    Avatar,
    Button,
    FormatDisplayDateStyled,
    IconButton,
    Loading,
} from '@finnoto/design-system';

import { addAssignee } from '../add.assignee.form.util';
import { useTeamInbox } from '../context/teaminbox.context.main';
import InboxBotMode from './inbox.bot.mode';

import { EyeSvgIcon } from 'assets';

const InfoCard = ({
    icon,
    title,
    children,
    className = '',
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
}) => (
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

export const RightSection = () => {
    const { currentInboxDetail: data, isLoading } = useTeamInbox();
    const query = useQueryClient();

    if (IsEmptyObject(data)) return <></>;

    return (
        <div className='flex overflow-y-auto flex-col col-span-1 gap-4 p-4 h-full rounded border bg-polaris-bg-surface'>
            {isLoading ? (
                <div className='flex justify-center items-center h-full'>
                    <Loading color='primary' size='xl' />
                </div>
            ) : (
                <>
                    {/* Header with Avatar and Contact Info */}
                    <div className='flex gap-6 items-center p-6 bg-white rounded-xl border shadow-lg transition-all dark:bg-base-200'>
                        {/* Avatar Section */}
                        <div className='flex-shrink-0'>
                            <Avatar
                                color='primary'
                                size='lg'
                                shape='circle'
                                alt={data.contact?.display_name}
                            />
                        </div>
                        {/* Main Info Section */}
                        <div className='flex flex-col flex-1 gap-2'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-2xl font-bold text-base-content'>
                                    {data.contact?.display_name || 'No Name'}
                                </span>
                                {data.contact?.company && (
                                    <span className='text-sm font-medium text-base-secondary'>
                                        {data.contact?.company}
                                    </span>
                                )}
                            </div>
                            <div className='flex flex-wrap gap-4 mt-2'>
                                {data.contact?.phone && (
                                    <div className='flex gap-2 items-center px-3 py-1 rounded-lg shadow-sm bg-polaris-bg-surface'>
                                        <span className='text-base material-icons text-primary'>
                                            phone
                                        </span>
                                        <span className='text-sm text-base-content'>
                                            {data.contact?.phone}
                                        </span>
                                    </div>
                                )}
                                {data.contact?.email && (
                                    <div className='flex gap-2 items-center px-3 py-1 rounded-lg shadow-sm bg-polaris-bg-surface'>
                                        <span className='text-base material-icons text-primary'>
                                            email
                                        </span>
                                        <span className='text-sm text-base-content'>
                                            {data.contact?.email}
                                        </span>
                                    </div>
                                )}
                                {data.contact?.address && (
                                    <div className='flex gap-2 items-center px-3 py-1 rounded-lg shadow-sm bg-polaris-bg-surface'>
                                        <span className='text-base material-icons text-primary'>
                                            location_on
                                        </span>
                                        <span className='text-sm text-base-content'>
                                            {data.contact?.address}
                                        </span>
                                    </div>
                                )}
                                {data.contact?.created_at && (
                                    <div className='flex gap-2 items-start px-3 py-1 rounded-lg shadow-sm bg-polaris-bg-surface'>
                                        <span className='text-base material-icons text-primary'>
                                            calendar_today
                                        </span>
                                        <span className='text-sm text-base-content'>
                                            {FormatDisplayDateStyled({
                                                value: data?.contact
                                                    ?.created_at,
                                            })}
                                        </span>
                                    </div>
                                )}
                                {data.contact?.dialing_code &&
                                    data.contact?.mobile && (
                                        <div className='flex gap-2 items-center px-3 py-1 rounded-lg shadow-sm bg-polaris-bg-surface'>
                                            <span className='text-base material-icons text-primary'>
                                                smartphone
                                            </span>
                                            <span className='text-sm text-base-content'>
                                                (+{data.contact?.dialing_code}){' '}
                                                {data.contact?.mobile}
                                            </span>
                                        </div>
                                    )}
                                {data.contact?.name && (
                                    <div className='flex gap-2 items-center px-3 py-1 rounded-lg shadow-sm bg-polaris-bg-surface'>
                                        <span className='text-base material-icons text-primary'>
                                            person
                                        </span>
                                        <span className='text-sm text-base-content'>
                                            {data.contact?.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Cards in Grid */}
                    <div className='grid grid-cols-3 gap-4'>
                        {/* Assignee Info Card */}
                        <InfoCard
                            icon={<User size={18} />}
                            title='Assignee Info'
                        >
                            {data?.assignee?.id ? (
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-center'>
                                        <span className='font-medium'>
                                            {data?.assignee?.user?.name}
                                        </span>
                                        <IconButton
                                            icon={EyeSvgIcon}
                                            size='xs'
                                            name='Change Assignee'
                                            outline
                                            onClick={() =>
                                                addAssignee(
                                                    data?.id,
                                                    data,
                                                    () => {
                                                        query.invalidateQueries(
                                                            {
                                                                queryKey: [
                                                                    'team_inbox_detail',
                                                                    data.id,
                                                                ],
                                                            }
                                                        );
                                                    }
                                                )
                                            }
                                        />
                                    </div>
                                    <span className='text-sm text-base-secondary'>
                                        {data?.assignee?.user?.email}
                                    </span>
                                </div>
                            ) : (
                                <Button
                                    size='xs'
                                    outline
                                    onClick={() =>
                                        addAssignee(data?.id, data, () => {
                                            query.invalidateQueries({
                                                queryKey: [
                                                    'team_inbox_detail',
                                                    data.id,
                                                ],
                                            });
                                        })
                                    }
                                >
                                    Add Assignee
                                </Button>
                            )}
                        </InfoCard>

                        {/* Bot Mode Info Card */}
                        <InfoCard
                            icon={<span className='text-lg i-robot' />}
                            title='Bot Mode'
                        >
                            <InboxBotMode />
                        </InfoCard>

                        {/* Chat Info Card */}
                        <InfoCard
                            icon={<MessageCircle size={18} />}
                            title='Chat Info'
                        >
                            <div className='flex flex-col gap-2'>
                                {data?.expired_at ? (
                                    <div>
                                        <label className='text-xs text-gray-500'>
                                            Chat Expired At
                                        </label>
                                        <div className='font-medium'>
                                            {FormatDisplayDateStyled({
                                                value: data?.expired_at as any,
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className='text-xs text-gray-500'>
                                            Chat Expires At
                                        </label>
                                        <div className='font-medium'>
                                            {FormatDisplayDateStyled({
                                                value: addHours(
                                                    new Date(
                                                        data?.last_activity_at
                                                    ),
                                                    23
                                                ) as any,
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </InfoCard>
                    </div>
                    {!IsEmptyArray(data?.contact?.custom_attributes) && (
                        <InfoCard
                            icon={<Contact size={18} />}
                            title='Contact Attributes'
                            className='max-h-[300px] overflow-y-auto'
                        >
                            <div className='flex flex-col gap-2'>
                                {data?.contact?.custom_attributes?.map(
                                    (val) => (
                                        <div
                                            className='flex flex-col gap-0.5'
                                            key={val?.key}
                                        >
                                            <label className='text-xs text-gray-500'>
                                                {val?.key}
                                            </label>
                                            <div className='font-medium'>
                                                {val?.value}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </InfoCard>
                    )}
                </>
            )}
        </div>
    );
};
