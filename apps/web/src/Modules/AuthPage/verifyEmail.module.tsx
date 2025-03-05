'use client';

import Image from 'next/image';

import {
    authenticateBusiness,
    Authentication,
    FetchData,
    GetOpenPropertyValue,
    LOGIN_ROUTE,
    Navigation,
    useFetchParams,
    useVerifyEmail,
} from '@finnoto/core';
import { AuthUser } from '@finnoto/core/src/Models/User/auth.user';
import {
    Button,
    cn,
    CountdownTimer,
    CountDownTimerProgress,
    Icon,
    OTPInput,
    Toast,
    Typography,
} from '@finnoto/design-system';

import { EmailSentImage } from '@Constants/imageMapping';
import { openOnboarding } from '@Utils/functions.utils';

import LoginPageFrame, {
    AuthenticationUIWrapper,
} from './Components/loginPageFrame.component';

import { VerifyEmailSvgIcon } from 'assets';

const VerifyEmail = () => {
    const { user } = useFetchParams();

    // if (!isRouteReady) return null;

    // if (completeSignup) {
    //     return '';
    // }

    return (
        <LoginPageFrame>
            {/* {isVerified && email && <EmailVerified />} */}
            {/* {!token && !isVerified && <ResendVerifyEmail />} */}
            <VerifyEmailToken />
        </LoginPageFrame>
    );
};

const ResendVerifyEmail = () => {
    const {
        email,
        countdownDone,
        countDownTime,
        otp,
        setOtp,
        handleOtp,
        setCountDownTime,
        onCountdownComplete,
        handleResendEmail,
    } = useVerifyEmail();

    return (
        <AuthenticationUIWrapper
            title='Verify Your Email'
            subTitle={
                <>
                    Please check your inbox and enter the 6-digit code below to
                    verify your email.
                    <br />
                    Email:{' '}
                    <Typography
                        variant='span'
                        className='text-center'
                        weight='bold'
                    >
                        {email}
                    </Typography>
                </>
            }
        >
            <div className='flex-1 gap-6 col-flex'>
                <div className='centralize'>
                    <OTPInput
                        length={6}
                        autoFocus
                        isNumberInput
                        inputClassName='otpInput !w-12'
                        className='gap-3 row-flex'
                        onEnterKeyPress={() => handleOtp(+otp)}
                        onChangeOTP={(e) => setOtp(e)}
                    />
                </div>
                <div className='flex gap-1 justify-center items-center text-sm'>
                    <Typography variant='span' color='text-tertiary'>
                        Didn’t get an OTP?{' '}
                    </Typography>
                    <Typography
                        variant='span'
                        className={cn('text-base-tertiary', {
                            'cursor-pointer text-info': countdownDone,
                        })}
                        onClick={() => {
                            if (!countdownDone) {
                                Toast.error({
                                    description: 'Wait For timer to complete!!',
                                });
                                return;
                            }
                            handleResendEmail();
                        }}
                    >
                        Resend
                    </Typography>{' '}
                    <span className='flex gap-2 items-center text-base-primary'>
                        {!countdownDone ? (
                            <>
                                in
                                <CountDownTimerProgress
                                    countDownTime={countDownTime}
                                />
                                <div>
                                    00:{' '}
                                    <CountdownTimer
                                        countTime={(time: any) =>
                                            setCountDownTime((time / 60) * 100)
                                        }
                                        duration={60}
                                        callback={onCountdownComplete}
                                    />
                                </div>
                            </>
                        ) : null}
                    </span>
                </div>

                <div className='w-full h-full centralize'>
                    <Image
                        src={EmailSentImage()}
                        height={400}
                        width={400}
                        alt='Email Verified'
                    />
                </div>

                <div className='grid grid-cols-2 gap-4 mt-auto'>
                    <Button
                        className='h-11 normal-case'
                        appearance='primary'
                        outline
                        block
                        onClick={() => Navigation.back()}
                    >
                        Back
                    </Button>
                    <Button
                        className='h-11 normal-case'
                        appearance='primary'
                        block
                        onClick={() => handleOtp(+otp)}
                    >
                        Verify &rarr;
                    </Button>
                </div>
            </div>
        </AuthenticationUIWrapper>
    );
};

// const EmailVerified = () => {
//     const { email } = useFetchParams();
//     const [showCountDown, setShowCountDown] = useState(true);
//     const [countDownTime, setCountDownTime] = useState(0);

//     const handleOnBoarding = () => {
//         Authentication.loginCheck(false, true).then(async (data) => {
//             if (!data || !data?.id)
//                 return Navigation.navigate({ url: LOGIN_ROUTE });

//             const referrer = GetSessionItem(REFERRER_STORE);

//             if (referrer?.url === VENDOR_REGISTER_ROUTE) {
//                 Navigation.navigate({
//                     url: referrer.url,
//                     queryParam: referrer.params,
//                 });
//                 return;
//             }
//             setShowCountDown(false);

//             const isOnboardingEnabled = await GetOpenPropertyValue(
//                 'self-business-onboarding',
//                 { convertBoolean: true }
//             );

//             if (isOnboardingEnabled)
//                 return openOnboarding(authenticateBusiness);

//             Navigation.search({ completeSignup: true }, { reset: true });
//         });
//     };

//     return (
//         <AuthenticationUIWrapper
//             title='Email Verified'
//             subTitle={
//                 <div className='text-base font-normal text-base-secondary'>
//                     Your email address{' '}
//                     <span className='font-semibold text-base-primary'>
//                         {email}
//                     </span>{' '}
//                     <br />
//                     has been successfully verified. Press continue to start your
//                     journey with us!
//                 </div>
//             }
//         >
//             <div className='flex-1 gap-4 col-flex'>
//                 <div className='flex justify-center items-center my-auto'>
//                     <Icon
//                         iconClass='flex items-center justify-center text-base-100'
//                         source={VerifyEmailSvgIcon}
//                         isSvg
//                         size={400}
//                     />
//                 </div>

//                 <div className='text-center'>
//                     {showCountDown && (
//                         <p className='gap-2 justify-center items-center font-normaltext-center text-base-primary row-flex'>
//                             <span>
//                                 <CountDownTimerProgress
//                                     countDownTime={countDownTime}
//                                 />
//                             </span>
//                             <span>
//                                 <CountdownTimer
//                                     duration={10}
//                                     callback={handleOnBoarding}
//                                     countTime={(time: any) =>
//                                         setCountDownTime((prev) => prev - 10)
//                                     }
//                                 />{' '}
//                                 Seconds
//                             </span>
//                         </p>
//                     )}
//                 </div>

//                 <div className='gap-4 mt-auto row-flex'>
//                     <Button
//                         className='h-11 normal-case'
//                         appearance='primary'
//                         block
//                         onClick={handleOnBoarding}
//                     >
//                         Continue &rarr;
//                     </Button>
//                 </div>
//             </div>
//         </AuthenticationUIWrapper>
//     );
// };

const VerifyEmailToken = () => {
    const { email, token } = useFetchParams();

    const handleVerifyEmail = async () => {
        const { success } = await FetchData({
            className: AuthUser,
            method: 'verifyEmail',
            classParams: { email, token },
        });

        if (success) {
            Toast.success({ description: 'Email successfully verified!' });

            Authentication.loginCheck(false, true).then(async (data) => {
                if (!data || !data?.id)
                    return Navigation.navigate({ url: LOGIN_ROUTE });

                const isOnboardingEnabled = await GetOpenPropertyValue(
                    'self-business-onboarding',
                    { convertBoolean: true }
                );

                if (isOnboardingEnabled) {
                    return openOnboarding(authenticateBusiness);
                }

                Navigation.search({ completeSignup: true });
            });
            return;
        }

        Toast.error({ description: 'Email verification failed!' });
    };

    return (
        <AuthenticationUIWrapper
            title='Email Verified'
            headerClassName='max-w-full'
        >
            <div className='flex-1 gap-4 col-flex'>
                <div className='text-base font-thin text-center text-color-tertiary'>
                    Your email address{' '}
                    <span className='font-semibold underline text-color-primary'>
                        {email} verified.
                    </span>{' '}
                    <br />
                    Press login button or redirect login page in 5 second.
                </div>
                <div className='flex justify-center items-center'>
                    <Icon
                        iconClass='flex items-center justify-center'
                        source={VerifyEmailSvgIcon}
                        isSvg
                        size={300}
                    />
                </div>

                <div className='text-center'>
                    <p className='font-thin text-center text-color-primary'>
                        <CountdownTimer
                            duration={5}
                            callback={handleVerifyEmail}
                        />{' '}
                        Second
                    </p>
                    <span className='text-base font-thin text-color-tertiary'>
                        Press continue button or redirect automatically in 5
                        second.
                    </span>
                </div>

                <div className='gap-4 mt-auto row-flex'>
                    <Button
                        className='normal-case'
                        appearance='primary'
                        block
                        onClick={handleVerifyEmail}
                    >
                        Continue &rarr;
                    </Button>
                </div>
            </div>
        </AuthenticationUIWrapper>
    );
};

export default VerifyEmail;
