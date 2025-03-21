import Image from 'next/image';
import Link from 'next/link';

import {
    LOGIN_ROUTE,
    Navigation,
    SIGNUP_ROUTE,
    useForgotPassword,
    useUserLoggedInHandler,
} from '@finnoto/core';
import {
    Button,
    CountdownTimer,
    Icon,
    InputField,
    Typography,
} from '@finnoto/design-system';

import { EmailSentImage } from '@Constants/imageMapping';

import LoginPageFrame, {
    AuthenticationUIFooter,
    AuthenticationUIWrapper,
} from './Components/loginPageFrame.component';

import { OutlineEmailSvgIcon } from 'assets';

export const LOGIN_LOADING_EVENT = 'login_page_loading';

const ForgotPasswordPage = () => {
    useUserLoggedInHandler();

    const {
        success,
        error,
        loading,
        email,
        msg,
        showCountDown,
        reSendOtp,
        setShowCountDown,
        setEmail,
        handleSubmit,
    } = useForgotPassword();

    const handleBack = () => {
        Navigation.back();
    };

    return (
        <LoginPageFrame className='w-[470px]'>
            <AuthenticationUIWrapper
                title={success ? 'Check Your Email !!' : 'Forgot Password'}
                subTitle={
                    success ? (
                        <div>
                            <Typography variant='span'>
                                Please check your email
                            </Typography>
                            <Typography variant='span' weight='bold'>
                                {' '}
                                {email}{' '}
                            </Typography>
                            <Typography variant='span'>
                                for password recovery instructions
                            </Typography>
                        </div>
                    ) : (
                        'Enter the email address associated with your account and we’ll send you a link to reset your password.'
                    )
                }
            >
                {success ? (
                    <EmailSent
                        {...{
                            email,
                            showCountDown,
                            setShowCountDown,
                            reSendOtp,
                        }}
                    />
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className='flex-1 col-flex'
                    >
                        {success && (
                            <div className='text-base font-normal text-base-secondary'>
                                {msg}{' '}
                                <Link href={LOGIN_ROUTE}>Go to Sign in</Link>
                            </div>
                        )}
                        {!success && (
                            <div className='flex-1 gap-2 h-full col-flex'>
                                <div className='flex-1'>
                                    <InputField
                                        type='email'
                                        label='Email Address'
                                        name='email'
                                        placeholder={'Enter Email Address'}
                                        // size={width > 1600 ? 'lg' : 'md'}
                                        value={email}
                                        onChange={setEmail}
                                        autoFocus
                                        error={
                                            error ? 'Invalid Email Address' : ''
                                        }
                                        disabled={loading}
                                        trimSpecialChar={false}
                                        addonEnd={
                                            <Icon
                                                source={OutlineEmailSvgIcon}
                                                isSvg
                                            />
                                        }
                                    />
                                </div>

                                <div className='gap-6 col-flex'>
                                    <div className='border'></div>
                                    <div className='grid grid-cols-2 gap-6 items-center'>
                                        <Button
                                            type='button'
                                            appearance='primary'
                                            // size={width > 1600 ? 'lg' : 'md'}
                                            onClick={handleBack}
                                            outline
                                            className='dark:text-base-content'
                                            size='lg'
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type='submit'
                                            appearance='primary'
                                            // size={width > 1600 ? 'lg' : 'md'}
                                            size='lg'
                                            block
                                        >
                                            Next &rarr;
                                        </Button>
                                    </div>
                                    <div>
                                        <AuthenticationUIFooter
                                            link='Sign up'
                                            route={SIGNUP_ROUTE}
                                            text="Don't have an Account?"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </AuthenticationUIWrapper>
        </LoginPageFrame>
    );
};

const EmailSent = ({
    email,
    showCountDown,
    setShowCountDown,
    reSendOtp,
}: {
    email: string;
    showCountDown: boolean;
    setShowCountDown: (state: boolean) => void;
    reSendOtp: () => void;
}) => {
    return (
        <div className='flex-1 gap-4 h-full col-flex'>
            <div className='w-full h-full centralize'>
                <Image
                    src={EmailSentImage()}
                    height={400}
                    width={400}
                    alt='Email Verified'
                />
            </div>
            <div className='grid grid-cols-2'>
                <span
                    onClick={() => {
                        if (!showCountDown) {
                            reSendOtp();
                        }
                    }}
                    className={`${
                        showCountDown
                            ? 'opacity-25 cursor-not-allowed'
                            : 'cursor-pointer text-info'
                    }`}
                >
                    Resend
                </span>
                {showCountDown && (
                    <p className='font-normal text-end text-base-primary'>
                        <CountdownTimer
                            duration={60}
                            callback={() => setShowCountDown(false)}
                        />{' '}
                        Seconds
                    </p>
                )}
            </div>
            <div className='mt-auto'>
                <Button
                    className='h-11 normal-case dark:text-base-content'
                    appearance='primary'
                    outline
                    block
                    onClick={() => Navigation.back()}
                >
                    Back
                </Button>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
