import {
    FormatDisplayDate,
    HOME_ROUTE,
    useBusinessPreference,
} from '@finnoto/core';
import {
    AnimatedTabs,
    ArcBreadcrumbs,
    Avatar,
    Badge,
    Container,
    PageLoader,
} from '@finnoto/design-system';

import BusinessProfileWhatsappInfoTab from './business.profile.whatsapp.info.tab';

import { MessageSvgIcon } from 'assets';

const BusinessProfileDetailModule = () => {
    const { businessInfo, isBusinessInfoLoading, whatsappProfileInfo } =
        useBusinessPreference();
    if (isBusinessInfoLoading) return <PageLoader />;

    return (
        <Container className='overflow-hidden gap-3 py-5 col-flex h-content-screen'>
            <ArcBreadcrumbs
                mainClassName='rounded py-4 rounded-none pb-2'
                title={'Configure Client'}
                route={[
                    { name: 'Home', link: HOME_ROUTE },
                    { name: 'Business preference' },
                ]}
            />

            <div className='grid overflow-hidden flex-1 grid-cols-6 gap-4'>
                <div className='flex-1 col-span-2 gap-6 items-center p-2 rounded shadow bg-base-100 col-flex'>
                    <div className='gap-3 justify-center items-center col-flex'>
                        <Avatar
                            imageWrapperClassName='p-2 border !flex items-center justify-center cursor-pointer'
                            alt={businessInfo?.name}
                            shape='rounded'
                            size='lg'
                            source={businessInfo?.image}
                            unOptimizeImage={true}
                        />
                        <div className='flex gap-2 items-center'>
                            <Badge
                                appearance='polaris-success'
                                label={'Active'}
                                size='sm'
                            />
                            <Badge
                                appearance={
                                    businessInfo?.verified_at
                                        ? 'success'
                                        : 'polaris-error'
                                }
                                label={
                                    businessInfo?.verified_at
                                        ? 'Business Verified'
                                        : 'Business Unverified'
                                }
                                size='sm'
                            />
                        </div>
                    </div>

                    <div className='items-start w-full col-flex'>
                        <DisplayInfoCard
                            label='Name'
                            value={businessInfo?.name}
                        />

                        <DisplayInfoCard
                            label='Owner Name'
                            value={businessInfo?.owner.name}
                        />
                        <DisplayInfoCard
                            label='Creation Date'
                            value={FormatDisplayDate(
                                businessInfo?.created_at,
                                true
                            )}
                        />
                        {/* <DisplayInfoCard label='Business Address' value={'-'} />
                        <DisplayInfoCard label='Business Email' value={'-'} />
                        <DisplayInfoCard label='Business Mobile' value={'-'} /> */}
                    </div>
                </div>

                <AnimatedTabs
                    containerClassName='flex-1 col-span-4 rounded gap-4 bg-transparent overflow-hidden'
                    contentContainerClass='flex-1 overflow-hidden p-0'
                    appreance='primary'
                    active='whatsapp_info'
                    tabs={[
                        {
                            key: 'whatsapp_info',
                            icon: MessageSvgIcon,
                            title: 'Whatsapp Info',
                            component: <BusinessProfileWhatsappInfoTab />,
                        },
                    ]}
                />
            </div>
        </Container>
    );
};

export default BusinessProfileDetailModule;

const DisplayInfoCard = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => {
    return (
        <div className='items-start p-2 w-full leading-10 rounded-lg border-b col-flex'>
            <p className='text-base font-semibold'>{label}</p>
            <span className='text-xs text-base-secondary'>{value}</span>
        </div>
    );
};
