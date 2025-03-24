import Link from 'next/link';

import {
    BUSINESS_PROFILE_ROUTE,
    useLandingPage,
    useOnBoardBusinessWithMeta,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import { Button, Container, Icon, PageLoader } from '@finnoto/design-system';

import { ArcWarningSvgIcon } from 'assets';

const LandingModule = () => {
    const { user, isBusinessInfoLoading } = useLandingPage();
    if (isBusinessInfoLoading) return <PageLoader />;

    return (
        <Container className='overflow-hidden gap-3 py-6 col-flex'>
            <h3 className='text-2xl font-semibold'>Welcome, {user.name} </h3>
        </Container>
    );
};

export default LandingModule;

const RenderFlowError = ({
    user,
    businessInfo,
}: {
    user: any;
    businessInfo: any;
}) => {
    const { launchWhatsAppSignup } = useOnBoardBusinessWithMeta();

    if (!user?.business?.internal_access_token) {
        return (
            <div className='gap-2 p-4 rounded shadow col-flex bg-warning/10'>
                <p className='flex gap-2 items-center'>
                    <Icon
                        iconColor='text-warning'
                        source={ArcWarningSvgIcon}
                        size={40}
                        isSvg
                    />
                    Please, onboard with the meta to create and use the whatsapp
                    feature
                </p>
                <Button onClick={launchWhatsAppSignup} appearance='info'>
                    Login With Facebook
                </Button>
            </div>
        );
    }

    if (!businessInfo?.verified_at) {
        return (
            <div className='gap-2 p-4 rounded shadow col-flex bg-warning/10'>
                <p className='flex gap-2 items-center'>
                    <Icon
                        iconColor='text-warning'
                        source={ArcWarningSvgIcon}
                        size={40}
                        isSvg
                    />
                    Your business is not verified. Please verify your business
                    to access all features.
                </p>
                <Link target='_blank' href={'https://business.facebook.com/'}>
                    <Button appearance='success' size='xs'>
                        Lets Verify
                    </Button>
                </Link>
            </div>
        );
    }

    if (!businessInfo?.phone_registered_at) {
        return (
            <div className='gap-2 p-4 rounded shadow col-flex bg-warning/10'>
                <p className='flex gap-2 items-center'>
                    <Icon
                        iconColor='text-warning'
                        source={ArcWarningSvgIcon}
                        size={40}
                        isSvg
                    />
                    Your Number is not registered. Please register your number
                    to access all features.
                </p>
                <Link href={BUSINESS_PROFILE_ROUTE}>
                    <Button appearance='info' size='xs'>
                        Go to Profile
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className='gap-2 p-4 rounded shadow col-flex bg-polaris-bg-surface'>
            <p className='flex gap-2 items-center'>
                WhatsApp templates are the way you can send marketing utility
                and authentication templates to users for any purpose of your
                business. Excited? Click on the button below to navigate to the
                template page.
            </p>
            <Link className='w-full' href={WHATSAPP_TEMPLATE_LIST_ROUTE}>
                <Button appearance='polaris-info' size='md' wide>
                    Lets Create the Template
                </Button>
            </Link>
        </div>
    );
};
