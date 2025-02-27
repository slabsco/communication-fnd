'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
    groupBusiness,
    IsEmptyArray,
    LOGIN_ROUTE,
    ObjectDto,
    VENDOR_REGISTER_ROUTE,
} from '@finnoto/core';
import { Icon, Modal, PageLoader } from '@finnoto/design-system';

import {
    ArrowRightSvgIcon,
    OnBoardingImgSvg,
    OnBoardingSolidImgSvg,
} from 'assets';

const BusinessSelector = ({
    businesses,
    callback,
}: {
    businesses: ObjectDto[];
    callback: (_: any, func: () => void) => void;
}) => {
    return (
        <div className='p-6 gap-4 col-flex w-[544px] max-h-[70vh] modal-bg dark:bg-base-200'>
            <div className='flex justify-center items-center w-full'>
                <div className='flex items-center justify-center h-36 w-36 rounded-full bg-[#4CC3C733] '>
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
                        Select Organization
                    </p>
                    <p className='text-sm font-medium text-base-secondary'>
                        Please select the organization you would like to connect
                        with
                    </p>
                </div>
            </div>
            <div className='overflow-y-auto px-2 py-4 h-full hide-scrollbar-business'>
                <RenderBusinessSelector {...{ businesses, callback }} />
            </div>
            <div className='flex justify-between px-2'>
                <Link
                    href={LOGIN_ROUTE}
                    className='text-sm text-info link-hover'
                    onClick={() => {
                        Modal.close();
                    }}
                >
                    Login with different user
                </Link>
            </div>
        </div>
    );
};

export const RenderBusinessSelector = ({
    businesses,
    callback,
}: {
    businesses: ObjectDto[];
    callback: (_: any, func: () => void) => void;
}) => {
    // const [activeBusiness, setActiveBusiness] = useState();
    const [loading, setLoading] = useState<boolean>(false);

    const groupedBusinesses: any[] = useMemo(() => {
        return groupBusiness(businesses);
    }, [businesses]);

    return (
        <>
            {loading ? (
                <PageLoader className='h-60' screenHeight={false} />
            ) : null}
            {!loading && !IsEmptyArray(groupedBusinesses) ? (
                <div className='gap-3 col-flex'>
                    {groupedBusinesses.map((business, index) => (
                        <div
                            key={business.id}
                            id={'org-' + (index + 1)}
                            className='gap-3 justify-between items-center px-4 py-3 rounded border transition-all cursor-pointer select-none border-base-300 group bg-base-100 row-flex hover:border-accent'
                            onClick={() => {
                                // setActiveBusiness(business?.id);
                                callback(business, () => setLoading(false));
                                setLoading(true);
                            }}
                        >
                            <div className='gap-3 items-center row-flex'>
                                <div className='overflow-hidden w-8 h-8 rounded centralize bg-accent/20 text-accent'>
                                    <Icon
                                        source={OnBoardingSolidImgSvg}
                                        isSvg
                                        size={22}
                                    />
                                </div>
                                <div className='col-flex'>
                                    <span className='text-base font-medium text-base-primary group-hover:text-accent'>
                                        {business.business_name ||
                                            business?.business?.name}
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-center ml-auto'>
                                <Icon
                                    source={ArrowRightSvgIcon}
                                    isSvg
                                    size={20}
                                    iconColor='text-transparent'
                                    iconClass='group-hover:text-accent'
                                />
                            </div>
                            {/* <Icon
                                    source={
                                        activeBusiness === business?.id
                                            ? VerifiedTickSvgIcon
                                            : UnVerifiedTickSvgIcon
                                    }
                                    size={24}
                                    iconColor={
                                        activeBusiness === business?.id
                                            ? 'text-primary'
                                            : 'text-base-tertiary/20'
                                    }
                                    isSvg
                                /> */}
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    );
};

export default BusinessSelector;
