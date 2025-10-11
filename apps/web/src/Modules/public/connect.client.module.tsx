import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useFetchParams, useQuery } from '@finnoto/core';
import {
    Button,
    Card,
    CardBody,
    Icon,
    PageLoader,
    Typography,
} from '@finnoto/design-system';

import { usePublicConnectClient } from './usePublicConnectClient.hook';

import { IntegrationWhatsappSvgIcon } from 'assets';

const ConnectClientModule = () => {
    const { backend_url, token, business_name } = useFetchParams();

    const { launchWhatsAppSignup, sentAccessToken, sentWaBaId } =
        usePublicConnectClient();

    const { data, isLoading } = useQuery({
        queryKey: [token, 'validate-public-token'],
        queryFn: async () => {
            const response = await fetch(
                `${backend_url}auth/validate-public-token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                }
            );

            return response.json();
        },
    });

    if (isLoading) return <PageLoader />;

    // Already connected - show completion status
    if (data?.internal_access_token) {
        return <AlreadyConnectedComponent business_name={business_name} />;
    }

    // Invalid token
    if (data?.message) {
        return <InvalidTokenComponent message={data.message} />;
    }

    // Successfully connected
    if (sentAccessToken && sentWaBaId) {
        return <ConnectionSuccessComponent business_name={business_name} />;
    }

    return (
        <InitialConnectionComponent
            business_name={business_name}
            launchWhatsAppSignup={launchWhatsAppSignup}
        />
    );
};

export default ConnectClientModule;
// Component for when connection is already completed
const AlreadyConnectedComponent = ({
    business_name,
}: {
    business_name: string;
}) => {
    const router = useRouter();

    return (
        <div className='h-screen bg-gradient-to-br from-blue-50 to-indigo-100 centralize bg-base-200 dark:from-gray-900 dark:to-gray-800'>
            <div className='mx-4 w-full max-w-md'>
                <Card className='border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80'>
                    <CardBody className='p-8'>
                        {/* Header Section */}
                        <div className='mb-8 text-center'>
                            <div className='mb-6 centralize'>
                                <div className='w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg centralize'>
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
                                Already Connected!
                            </Typography>
                            <Typography
                                size='large'
                                className='text-base-secondary'
                            >
                                Your WhatsApp Business is already linked to{' '}
                                {business_name}. You can start managing
                                conversations.
                            </Typography>
                        </div>

                        {/* Status Section */}
                        <div className='p-4 mb-8 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800'>
                            <div className='flex gap-3 justify-center items-center'>
                                <div className='w-4 h-4 bg-green-500 rounded-full'></div>
                                <Typography
                                    variant='h3'
                                    weight='medium'
                                    className='text-green-800 dark:text-green-200'
                                >
                                    Connection Active
                                </Typography>
                            </div>
                            <Typography className='mt-2 text-sm text-center text-green-700 dark:text-green-300'>
                                Your WhatsApp Business account is successfully
                                connected and ready to use.
                            </Typography>
                        </div>

                        {/* Return to Website Button */}
                        <Button
                            onClick={() => router.push('https://dartinbox.com')}
                            appearance='primary'
                            size='lg'
                            block
                            className='h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl'
                        >
                            Return to Website
                        </Button>

                        {/* Quick Actions */}
                        <div className='mt-6 space-y-3'>
                            <Button
                                onClick={() =>
                                    router.push(
                                        'https://business.facebook.com/latest/settings/security_center'
                                    )
                                }
                                appearance='secondary'
                                size='md'
                                block
                                className='h-12 font-medium text-blue-700 bg-white border border-blue-200 hover:bg-blue-50'
                                buttonIcon={IntegrationWhatsappSvgIcon}
                                buttonIconAlign='left'
                            >
                                Manage Facebook Business
                            </Button>
                        </div>

                        {/* Footer */}
                        <div className='mt-6 text-center'>
                            <p className='text-base-tertiary'>
                                Need help? Contact our{' '}
                                <a
                                    href='https://dartinbox.com/support'
                                    className='link link-hover text-primary'
                                    target='_blank'
                                >
                                    Support Team
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
                <div className='absolute top-10 left-10 w-32 h-32 rounded-full blur-xl bg-blue-200/20'></div>
                <div className='absolute right-10 bottom-10 w-40 h-40 rounded-full blur-xl bg-green-200/20'></div>
            </div>
        </div>
    );
};

// Component for invalid token
const InvalidTokenComponent = ({ message }: { message: string }) => {
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
                                className='mb-2 text-red-600'
                            >
                                Invalid Token
                            </Typography>
                            <Typography
                                size='large'
                                className='text-base-secondary'
                            >
                                {message ||
                                    'The provided token is invalid or has expired. Please contact support for assistance.'}
                            </Typography>
                        </div>

                        {/* Error Details Section */}
                        <div className='mb-8'>
                            <Typography
                                variant='h3'
                                className='mb-4 text-center'
                            >
                                What you can do:
                            </Typography>
                            <div className='space-y-3'>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                                    <Typography className='text-sm text-base-secondary'>
                                        Check if the token URL is correct
                                    </Typography>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                                    <Typography className='text-sm text-base-secondary'>
                                        Contact your administrator for a new
                                        token
                                    </Typography>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                                    <Typography className='text-sm text-base-secondary'>
                                        Ensure the token {"hasn't"} expired
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* Try Again Button */}
                        <Link
                            href='https://dartinbox.com'
                            className='flex justify-center items-center px-8 h-14 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-md border-0 shadow-lg transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-xl'
                            target='_self'
                            rel='noopener noreferrer'
                        >
                            Go to Website
                        </Link>

                        {/* Footer */}
                        <div className='mt-6 text-center'>
                            <p className='text-base-tertiary'>
                                Need help? Contact our{' '}
                                <a
                                    href='https://dartinbox.com/support'
                                    className='link link-hover text-primary'
                                    target='_blank'
                                >
                                    Support Team
                                </a>
                            </p>
                        </div>
                    </CardBody>
                </Card>

                {/* Background decoration */}
                <div className='absolute top-10 left-10 w-32 h-32 rounded-full blur-xl bg-red-200/20'></div>
                <div className='absolute right-10 bottom-10 w-40 h-40 rounded-full blur-xl bg-red-200/20'></div>
            </div>
        </div>
    );
};

// Component for successful connection
const ConnectionSuccessComponent = ({
    business_name,
}: {
    business_name: string;
}) => {
    const router = useRouter();

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
                                {"You're"} connected!
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
                            onClick={() =>
                                router.push(
                                    'https://business.facebook.com/latest/settings/security_center'
                                )
                            }
                            appearance='primary'
                            size='lg'
                            block
                            className='h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-xl'
                            buttonIcon={IntegrationWhatsappSvgIcon}
                            buttonIconAlign='left'
                        >
                            Verify With Facebook
                        </Button>

                        {/* Next Steps Section */}
                        <div className='p-4 mt-6 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'>
                            <Typography
                                variant='h3'
                                weight='medium'
                                className='mb-3 text-blue-800 dark:text-blue-200'
                            >
                                Next Steps Required:
                            </Typography>
                            <div className='space-y-3'>
                                <div className='flex gap-3 items-start'>
                                    <div className='flex-shrink-0 mt-2 w-2 h-2 bg-blue-500 rounded-full'></div>
                                    <div>
                                        <Typography className='mb-1 text-sm text-blue-700 dark:text-blue-300'>
                                            Verify your business
                                        </Typography>
                                        <a
                                            href='https://business.facebook.com/latest/settings/security_center'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
                                        >
                                            Complete Business Verification →
                                        </a>
                                    </div>
                                </div>
                                <div className='flex gap-3 items-start'>
                                    <div className='flex-shrink-0 mt-2 w-2 h-2 bg-green-500 rounded-full'></div>
                                    <div>
                                        <Typography className='mb-1 text-sm text-blue-700 dark:text-blue-300'>
                                            Add payment method
                                        </Typography>
                                        <a
                                            href='https://business.facebook.com/billing_hub/accounts/details'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
                                        >
                                            Set up Payment Method →
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <Typography className='mt-3 text-xs italic text-blue-600 dark:text-blue-400'>
                                These steps are required to run your WhatsApp
                                Business smoothly
                            </Typography>
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

// Component for initial connection
const InitialConnectionComponent = ({
    business_name,
    launchWhatsAppSignup,
}: {
    business_name: string;
    launchWhatsAppSignup: () => void;
}) => {
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
                                    href='https://dartinbox.com/privacy-policy.html'
                                    className='link link-hover text-primary'
                                    target='_blank'
                                >
                                    Privacy Policy
                                </a>{' '}
                                and{' '}
                                <a
                                    href='https://dartinbox.com/terms.html'
                                    className='link link-hover text-primary'
                                    target='_blank'
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
