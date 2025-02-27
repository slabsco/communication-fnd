'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useList } from 'react-use';

import {
    FetchData,
    groupBusiness,
    IsEmptyArray,
    LOGIN_ROUTE,
    ObjectDto,
} from '@finnoto/core';
import { InvitedUserController } from '@finnoto/core/src/backend/common/controllers/invited.user.controller';
import { MetaBusinessController } from '@finnoto/core/src/backend/meta/controllers/meta.business.controller';
import { Button, Icon, Modal, Toast } from '@finnoto/design-system';

import { openBusinessSelector, openOnboarding } from '@Utils/functions.utils';

import {
    CrossSvgIcon,
    OnBoardingImgSvg,
    OnBoardingSolidImgSvg,
    RejectSvgIcon,
    TickMarkSvgIcon,
} from 'assets';

const BusinessInvitation = ({
    callback,
    ...props
}: {
    invitations: ObjectDto[];
    callback: (business: ObjectDto) => Promise<void>;
}) => {
    const [invitations, { updateAt }] = useList(props.invitations);
    const [loading, setLoading] = useState<'accept' | 'reject'>();
    const [expanded, setExpanded] = useState(0);

    const pendingInvitations = useMemo(() => {
        return invitations.filter(
            (invitation) => !invitation.accepted && !invitation.rejected
        );
    }, [invitations]);

    const handleAccept = async (id: number, index: number) => {
        setLoading('accept');
        const { success, response } = await FetchData({
            className: InvitedUserController,
            method: 'accept',
            methodParams: id,
        });

        if (success) {
            updateAt(index, { ...invitations[index], accepted: true });
            Toast.success({
                description: 'Business successfully accepted!',
            });
            if (invitations.length === 1) {
                handleDone();
            }
        } else {
            Toast.error({
                description: response.message || 'Something went wrong!',
            });
        }
        setLoading(undefined);
    };

    const handleReject = async (id: number, index: number) => {
        setLoading('reject');
        const { success, response } = await FetchData({
            className: InvitedUserController,
            method: 'reject',
            methodParams: id,
        });

        if (success) {
            updateAt(index, { ...invitations[index], rejected: true });
            Toast.success({
                description: 'Business successfully rejected!',
            });
            if (invitations.length === 1) {
                handleDone();
            }
        } else {
            Toast.error({
                description: response.message || 'Something went wrong!',
            });
        }
        setLoading(undefined);
    };

    const handleDone = async (next = () => {}) => {
        const { success, response } = await FetchData({
            className: MetaBusinessController,
            method: 'list',
        });

        Modal.close();
        if (success) {
            if (IsEmptyArray(response)) {
                openOnboarding(callback);
                next();
                return;
            }
            const groupedBusiness = groupBusiness(response || []);
            if (groupedBusiness.length === 1)
                return callback(groupedBusiness[0] as any);

            openBusinessSelector(response, callback);
        }
        next();
    };

    return (
        <div className=' px-8 py-6 gap-4 col-flex max-h-[70vh] modal-bg'>
            <div className='flex justify-center items-center w-full'>
                <div className='flex items-center  justify-center h-36 w-36 rounded-full bg-[#4CC3C733] '>
                    <Icon
                        iconClass='flex items-center justify-center'
                        source={OnBoardingImgSvg}
                        isSvg
                        size={88}
                    />
                </div>
            </div>
            <div className='gap-8 col-flex'>
                <div className='gap-2 text-center col-flex'>
                    <p className='text-xl font-medium text-base-primary'>
                        Invitations
                    </p>
                    <p className='text-sm font-medium text-base-secondary'>
                        Please select the organisation you wish to connect with
                        by accepting the invitation listed below.
                    </p>
                </div>
            </div>
            <div className='overflow-y-auto h-full hide-scrollbar-business'>
                {!IsEmptyArray(invitations) ? (
                    <div className='gap-3 col-flex'>
                        {invitations.map((business, index) => (
                            <div
                                key={business.id}
                                className='rounded-lg border-2 border-transparent shadow-sm transition-all cursor-pointer select-none col-flex hover:border-accent'
                            >
                                <div
                                    className='gap-3 items-center px-4 py-3 row-flex'
                                    onClick={() => setExpanded(index)}
                                >
                                    <div className='overflow-hidden w-8 h-8 rounded centralize bg-accent/20 text-accent'>
                                        <Icon
                                            source={OnBoardingSolidImgSvg}
                                            isSvg
                                            size={22}
                                        />
                                    </div>
                                    <div className='col-flex'>
                                        <span className='text-base font-medium text-base-primary'>
                                            {business.business?.name}
                                        </span>
                                    </div>
                                </div>
                                {!business.accepted && !business.rejected ? (
                                    <AnimateHeight
                                        height={expanded === index ? 'auto' : 0}
                                    >
                                        <div className='gap-4 justify-end items-center px-4 pb-3 row-flex'>
                                            <Button
                                                appearance='error'
                                                size='sm'
                                                outline
                                                disabled={loading === 'accept'}
                                                loading={loading === 'reject'}
                                                onClick={() =>
                                                    handleReject(
                                                        business.id,
                                                        index
                                                    )
                                                }
                                            >
                                                <div className='flex gap-1 justify-center items-center'>
                                                    <Icon
                                                        source={RejectSvgIcon}
                                                        isSvg
                                                        size={24}
                                                    />
                                                    Reject
                                                </div>
                                            </Button>
                                            <Button
                                                appearance='success'
                                                size='sm'
                                                disabled={loading === 'reject'}
                                                loading={loading === 'accept'}
                                                onClick={() =>
                                                    handleAccept(
                                                        business.id,
                                                        index
                                                    )
                                                }
                                            >
                                                <div className='flex gap-2 justify-center items-center'>
                                                    <Icon
                                                        source={
                                                            'check_circle_outline'
                                                        }
                                                        size={14}
                                                    />
                                                    Accept
                                                </div>
                                            </Button>
                                        </div>
                                    </AnimateHeight>
                                ) : (
                                    <div className='items-center px-4 pb-3 row-flex'>
                                        {business.accepted ? (
                                            <span className='h-6 w-6  bg-[#28D139] rounded-full flex justify-center items-center pt-1'>
                                                <Icon
                                                    source={TickMarkSvgIcon}
                                                    isSvg
                                                    size={14}
                                                    className='mb-1 text-white'
                                                />
                                            </span>
                                        ) : (
                                            <span className='h-6 w-6  bg-[#FF4242] rounded-full flex justify-center items-center '>
                                                <Icon
                                                    source={CrossSvgIcon}
                                                    iconClass='text-white'
                                                    isSvg
                                                    size={14}
                                                />
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className='flex justify-between items-center mt-4'>
                <Link
                    href={LOGIN_ROUTE}
                    className='text-sm cursor-pointer text-info link-hover'
                    onClick={() => {
                        Modal.close();
                    }}
                >
                    Login with different user
                </Link>
                {IsEmptyArray(pendingInvitations) ? (
                    <Button
                        appearance='primary'
                        size='sm'
                        // progress
                        onClick={handleDone}
                    >
                        Done
                    </Button>
                ) : (
                    <p
                        onClick={() => handleDone()}
                        className='text-sm cursor-pointer text-info link-hover'
                    >
                        skip
                    </p>
                )}
            </div>
        </div>
    );
};

export default BusinessInvitation;
