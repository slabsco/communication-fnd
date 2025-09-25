import { AlertCircle, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import AnimateHeight from 'react-animate-height';

import {
    BUSINESS_PROFILE_ROUTE,
    getBusinessErrors,
    Navigation,
    useLandingPage,
    useOnBoardBusinessWithMeta,
    USER_PROFILE_ROUTE,
} from '@finnoto/core';
import { Icon, Tooltip } from '@finnoto/design-system';

import { WarningToastIcon } from 'assets';

const LandingModule = () => {
    const { user, businessInfo } = useLandingPage();

    const errors = getBusinessErrors(businessInfo);
    const { launchWhatsAppSignup } = useOnBoardBusinessWithMeta();
    return (
        <>
            <h3 className='text-2xl font-semibold'>Welcome, {user.name} </h3>
            {errors.map((item, index) => (
                <BusinessErrorCard
                    key={index}
                    entityType={item.entity_type}
                    errors={item.errors}
                />
            ))}
            <WarningAccordion
                columns={[
                    {
                        description: `Your business is not verified. Please verify your business to access all features.`,
                        onClick: launchWhatsAppSignup,
                        visible: !user?.business?.internal_access_token,
                    },
                    {
                        description: `Please, onboard with the meta to create and use the whatsapp feature`,
                        onClick: () => {
                            Navigation.navigate({
                                url: BUSINESS_PROFILE_ROUTE,
                            });
                        },
                        visible: !businessInfo?.verified_at,
                    },
                    {
                        description: `Your Number is not registered. Please register your number to access all features.`,
                        onClick: () => {
                            Navigation.navigate({
                                url: BUSINESS_PROFILE_ROUTE,
                            });
                        },
                        visible: !businessInfo?.phone_registered_at,
                    },
                    {
                        description: `Your phone number is not currently configured in your
                        account. Please update your mobile number to ensure
                        proper account verification and access to all features.`,
                        onClick: () => {
                            Navigation.navigate({
                                url: USER_PROFILE_ROUTE,
                                queryParam: {
                                    open_mobile: true,
                                },
                            });
                        },
                        visible: !user?.mobile,
                    },
                ]}
            />
        </>
    );
};

export default LandingModule;

interface ErrorColumns {
    description: string;
    visible: boolean;
    onClick: () => void;
}

const WarningAccordion = ({ columns }: { columns: ErrorColumns[] }) => {
    const [open, setOpen] = useState(true);

    const hasVisible = columns?.find((_col) => _col?.visible);
    if (!hasVisible) return;

    return (
        <div className='overflow-hidden rounded transition-all col-flex'>
            <div
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
                className='flex justify-between items-center px-3 py-2 w-full font-medium rounded cursor-pointer bg-warning/30 text-warning'
            >
                <div className='flex gap-3 items-center'>
                    <Icon source={WarningToastIcon} isSvg />
                    Warnings
                </div>
                <ArrowDown
                    className={`transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </div>
            <AnimateHeight height={open ? '100%' : 0}>
                <div className='px-6 py-2 bg-base-100'>
                    <ol className='list-disc'>
                        {columns?.map((val) => {
                            if (!val?.visible) return <></>;
                            return (
                                <li
                                    onClick={val?.onClick}
                                    className='underline cursor-pointer'
                                    key={val?.description}
                                >
                                    {val?.description}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </AnimateHeight>
        </div>
    );
};

const BusinessErrorCard = ({ entityType, errors }) => {
    if (entityType?.toLowerCase() === 'business') return <></>;
    return (
        <div className='p-4 w-full max-w-lg bg-white rounded-lg shadow-sm'>
            <h2 className='mb-2 text-lg font-semibold'>
                Error Entity Type: {entityType}
            </h2>

            {errors.map((error, index) => (
                <div key={index} className='space-y-3'>
                    <div className='flex gap-2 items-center'>
                        <Tooltip message={error.possible_solution}>
                            <AlertCircle className='mt-1 w-5 h-5 text-red-500 shrink-0' />
                        </Tooltip>
                        <div className='flex gap-2 items-start'>
                            <p className='text-red-500'>
                                {error.error_description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
