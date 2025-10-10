import Image from 'next/image';
import { useRouter } from 'next/router';

import { useFetchParams } from '@finnoto/core';
import {
    Button,
    Card,
    CardBody,
    Icon,
    Typography,
} from '@finnoto/design-system';

import { usePublicConnectClient } from './usePublicConnectClient.hook';

import { IntegrationWhatsappSvgIcon } from 'assets';

const ConnectClientModule = () => {
    const { launchWhatsAppSignup, sentAccessToken, sentWaBaId } =
        usePublicConnectClient();

    const router = useRouter();

    const { business_name } = useFetchParams();
    if (sentAccessToken && sentWaBaId) {
        return (
            <div className='h-screen bg-gradient-to-br from-blue-50 to-indigo-100 centralize bg-base-200 dark:from-gray-900 dark:to-gray-800'>
                <div className='mx-4 w-full max-w-md'>
                    <Card className='border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80'>
                        <CardBody className='p-8'>
                            {/* Header Section */}
                            <div className='mb-8 text-center'>
                                <div className='mb-6 centralize'>
                                    <div className='w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg centralize'>
                                        <Icon
                                            source={IntegrationWhatsappSvgIcon}
                                            isSvg
                                            size={40}
                                            iconColor='text-white'
                                        />
                                    </div>
                                </div>
                                <Typography
                                    variant='h1'
                                    size='2xl'
                                    weight='bold'
                                    className='mb-2'
                                >
                                    You’re connected!
                                </Typography>
                                <Typography
                                    size='large'
                                    className='text-base-secondary'
                                >
                                    Your WhatsApp Business is now linked to{' '}
                                    {business_name}. You can start managing
                                    conversations.
                                </Typography>
                            </div>

                            {/* Primary Action */}
                            <Button
                                onClick={() => router.push('/')}
                                appearance='primary'
                                size='lg'
                                block
                                className='h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-xl'
                                buttonIcon={IntegrationWhatsappSvgIcon}
                                buttonIconAlign='left'
                            >
                                Go to Home
                            </Button>

                            {/* Trust Indicators */}
                            <div className='pt-6 mt-8 border-t border-base-300'>
                                <div className='flex gap-6 justify-center items-center text-xs text-base-tertiary'>
                                    <div className='flex gap-1 items-center'>
                                        <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                                        <span>Secure</span>
                                    </div>
                                    <div className='flex gap-1 items-center'>
                                        <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                        <span>Verified</span>
                                    </div>
                                    <div className='flex gap-1 items-center'>
                                        <div className='w-4 h-4 bg-purple-500 rounded-full'></div>
                                        <span>Trusted</span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Background decoration */}
                    <div className='absolute top-10 left-10 w-32 h-32 rounded-full blur-xl bg-green-200/20'></div>
                    <div className='absolute right-10 bottom-10 w-40 h-40 rounded-full blur-xl bg-blue-200/20'></div>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen bg-gradient-to-br from-blue-50 to-indigo-100 centralize bg-base-200 dark:from-gray-900 dark:to-gray-800'>
            <div className='mx-4 w-full max-w-md'>
                <Card className='border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80'>
                    <CardBody className='p-8'>
                        {/* Header Section */}
                        <div className='mb-8 text-center'>
                            <div className='mb-6 centralize'>
                                <Image
                                    src={'/logo.png'}
                                    alt='Brand Logo'
                                    height={150}
                                    width={150}
                                    style={{
                                        objectFit: 'contain',
                                        objectPosition: 'left',
                                    }}
                                    unoptimized
                                    priority
                                />
                            </div>
                            <Typography
                                variant='h1'
                                size='2xl'
                                weight='bold'
                                className='mb-2'
                            >
                                Connect Your Business with {business_name}
                            </Typography>
                            <Typography
                                size='large'
                                className='text-base-secondary'
                            >
                                Link your WhatsApp Business account to start
                                managing conversations
                            </Typography>
                        </div>

                        {/* Benefits Section */}
                        <div className='mb-8'>
                            <Typography
                                variant='h3'
                                className='mb-4 text-center'
                            >
                                What {"you'll"} get:
                            </Typography>
                            <div className='space-y-3'>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                    <Typography className='text-sm text-base-secondary'>
                                        Manage all WhatsApp conversations in one
                                        place
                                    </Typography>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                    <Typography className='text-sm text-base-secondary'>
                                        Automated responses and quick replies
                                    </Typography>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                    <Typography className='text-sm text-base-secondary'>
                                        Team collaboration and assignment
                                    </Typography>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                    <Typography className='text-sm text-base-secondary'>
                                        Analytics and insights
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* Connect Button */}
                        <Button
                            onClick={launchWhatsAppSignup}
                            appearance='primary'
                            size='lg'
                            block
                            className='h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-xl'
                            buttonIcon={IntegrationWhatsappSvgIcon}
                            buttonIconAlign='left'
                        >
                            Connect with Facebook
                        </Button>

                        {/* Footer */}
                        <div className='mt-6 text-center'>
                            <p className='text-base-tertiary'>
                                By connecting, you agree to our{' '}
                                <a
                                    href='/privacy-policy'
                                    className='link link-hover text-primary'
                                >
                                    Privacy Policy
                                </a>{' '}
                                and{' '}
                                <a
                                    href='/terms'
                                    className='link link-hover text-primary'
                                >
                                    Terms of Service
                                </a>
                            </p>
                        </div>

                        {/* Trust Indicators */}
                        <div className='pt-6 mt-8 border-t border-base-300'>
                            <div className='flex gap-6 justify-center items-center text-xs text-base-tertiary'>
                                <div className='flex gap-1 items-center'>
                                    <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                                    <span>Secure</span>
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                    <span>Verified</span>
                                </div>
                                <div className='flex gap-1 items-center'>
                                    <div className='w-4 h-4 bg-purple-500 rounded-full'></div>
                                    <span>Trusted</span>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Background decoration */}
                <div className='absolute top-10 left-10 w-32 h-32 rounded-full blur-xl bg-green-200/20'></div>
                <div className='absolute right-10 bottom-10 w-40 h-40 rounded-full blur-xl bg-blue-200/20'></div>
            </div>
        </div>
    );
};

export default ConnectClientModule;
