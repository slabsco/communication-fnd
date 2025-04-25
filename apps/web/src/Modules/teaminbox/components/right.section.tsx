import { addHours } from 'date-fns';
import { Contact, MessageCircle, User } from 'lucide-react';

import { IsEmptyArray, IsEmptyObject, useQueryClient } from '@finnoto/core';
import {
    Avatar,
    Badge,
    Button,
    FormatDisplayDateStyled,
    Loading,
} from '@finnoto/design-system';

import { addAssignee } from '../add.assignee.form.util';
import { useTeamInbox } from '../context/teaminbox.context.main';

export const RightSection = ({
    data = {},
    isLoading,
}: {
    data: any;
    isLoading?: boolean;
}) => {
    const query = useQueryClient();
    if (IsEmptyObject(data)) return <></>;
    return (
        <div className='col-span-1 h-full rounded border bg-polaris-bg-surface'>
            {isLoading && (
                <div className='flex justify-center items-center h-full'>
                    <Loading color='primary' size='xl' />
                </div>
            )}
            {!isLoading && (
                <div className='p-4 space-y-4'>
                    {/* Header with Avatar */}
                    <div className='flex gap-3 items-center'>
                        <Avatar
                            color='primary'
                            size='sm'
                            shape='circle'
                            alt={data.contact?.display_name}
                        />
                        <span className='font-medium'>
                            {data.contact?.display_name}
                        </span>
                    </div>

                    {/* assignee  */}
                    <div>
                        <div className='flex justify-between items-center p-1 text-base-content bg-base-300'>
                            <h3 className='flex gap-2 items-center font-medium'>
                                <User size={18} />
                                Assignee info
                            </h3>
                        </div>
                        <div className='mt-2'>
                            {data?.assignee?.id ? (
                                <div className='col-flex'>
                                    <p className='flex gap-2 items-center'>
                                        {data?.assignee?.user?.name}{' '}
                                        <Button
                                            size='xs'
                                            outline
                                            onClick={() =>
                                                addAssignee(
                                                    data?.id,
                                                    data,
                                                    () => {
                                                        query.invalidateQueries(
                                                            [
                                                                'team_inbox_detail',
                                                                data.id,
                                                            ]
                                                        );
                                                    }
                                                )
                                            }
                                        >
                                            Change Assignee
                                        </Button>
                                    </p>
                                    <p className='text-sm text-base-secondary'>
                                        {data?.assignee?.user?.email}
                                    </p>
                                </div>
                            ) : (
                                <Button
                                    size='xs'
                                    outline
                                    onClick={() =>
                                        addAssignee(data?.id, data, () => {
                                            query.invalidateQueries([
                                                'team_inbox_detail',
                                                data.id,
                                            ]);
                                        })
                                    }
                                >
                                    Add Assignee
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center p-1 text-base-content bg-base-300'>
                            <h3 className='flex gap-2 items-center font-medium'>
                                <MessageCircle size={18} />
                                Chat info
                            </h3>
                        </div>
                        {/* Contact Details */}
                        <div className='space-y-4'>
                            {data?.expired_at ? (
                                <div>
                                    <label className='text-sm text-gray-500'>
                                        Chat Expired At
                                    </label>
                                    <div>
                                        {FormatDisplayDateStyled({
                                            value: data?.expired_at as any,
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className='text-sm text-gray-500'>
                                        Chat Expires at
                                    </label>
                                    <div>
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
                    </div>
                    {/* Contact Section */}
                    <div className='space-y-2'>
                        <div className='flex justify-between items-center p-1 text-base-content bg-base-300'>
                            <h3 className='flex gap-2 items-center font-medium'>
                                <Contact size={18} />
                                Contact info
                            </h3>
                        </div>
                        {/* Contact Details */}
                        <div className='space-y-4'>
                            <div>
                                <label className='text-sm text-gray-500'>
                                    Phone Number
                                </label>
                                <div className='flex gap-2 items-center'>
                                    <span className='i-flag-india' />
                                    <span>
                                        (+{data?.contact?.dialing_code}){' '}
                                        {data?.contact?.mobile}
                                    </span>
                                    {/* <button className='text-gray-400'>
                                        <span className='i-copy' />
                                    </button> */}
                                </div>
                            </div>
                            <div>
                                <label className='text-sm text-gray-500'>
                                    User Name
                                </label>
                                <div>{data?.contact?.name}</div>
                            </div>
                        </div>
                    </div>

                    {!IsEmptyArray(data?.contact?.custom_attributes) && (
                        <div className='space-y-4'>
                            <div className='flex justify-between items-center p-1 text-base-content bg-base-300'>
                                <h3 className='flex gap-2 items-center font-medium'>
                                    <Contact size={18} />
                                    Contact Attributes
                                </h3>
                            </div>

                            {/* Attributes List */}
                            <div className='space-y-2 p-2 max-h-[300px] overflow-y-auto border rounded'>
                                {data?.contact?.custom_attributes?.map(
                                    (val) => {
                                        return (
                                            <div
                                                className='gap-0 col-flex'
                                                key={val?.key}
                                            >
                                                <label className='text-sm text-gray-500'>
                                                    {val?.key}
                                                </label>
                                                <div>{val?.value}</div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
