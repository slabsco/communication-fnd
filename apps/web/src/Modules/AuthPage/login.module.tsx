import Joi from 'joi';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    formatJoiErrorMessages,
    FormBuilderFormSchema,
    getJoiValidationOptions,
    IsEmptyObject,
    IsFunction,
    IsValidString,
    Navigation,
    SIGNUP_ROUTE,
    useFetchParams,
    useLogin,
    useOtpLogin,
    useUserLoggedInHandler,
} from '@finnoto/core';
import {
    Button,
    CountdownTimer,
    FormBuilder,
    Icon,
    InputField,
    OTPInput,
    PageLoader,
} from '@finnoto/design-system';

import GoogleLoginButton from './Components/googleLoginButton.component';
import LoginPageFrame, {
    AuthenticationUIFooter,
    AuthenticationUIWrapper,
} from './Components/loginPageFrame.component';

import { ArcEmailSvgIcon, EditSvgIcon } from 'assets';

const LoginModule = () => {
    useUserLoggedInHandler();

    const { no_business } = useFetchParams();
    const { loading, token } = useLogin();

    if (no_business) {
        return '';
    }

    if (loading) {
        return <PageLoader className='bg-[var(--dashboard-bg-color)]' />;
    }

    return (
        <LoginPageFrame className='min-w-[470px]'>
            <LoginScreen />
            {/* {!token && <LoginScreen />} */}
            {/* {!!token && <TwoFALogin />} */}
        </LoginPageFrame>
    );
};

const LoginScreen = () => {
    const { mobile, email, referrer } = useFetchParams();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const username = mobile || email || '';

    const resetLogin = () => {
        setIsEdit(true);
        Navigation.search({}, { reset: true });
    };

    const isShowEmail = useMemo(() => {
        if (isEdit) return true;
        if (!mobile && !email) return true;
    }, [email, isEdit, mobile]);

    return (
        <AuthenticationUIWrapper
            title='Dart Inbox'
            subTitle='Enter your credentials to access your account'
            containerClassName='gap-4'
        >
            <div className='flex-1 col-flex'>
                {isShowEmail && (
                    <LoginMainSection
                        data={username}
                        onMobile={(data: any) => {
                            Navigation.search(
                                { mobile: data.mobile, referrer },
                                { reset: true }
                            );
                            setIsEdit(false);
                        }}
                        onEmail={(data: any) => {
                            Navigation.search(
                                { email: data.username, referrer },
                                { reset: true }
                            );
                            setIsEdit(false);
                        }}
                    />
                )}
                {!!mobile && !isEdit && (
                    <OtpLoginSection mobile={mobile} resetLogin={resetLogin} />
                )}
                {!!email && !isEdit && (
                    <EmailLoginSection email={email} resetLogin={resetLogin} />
                )}
            </div>
            {/* <SocialLoginSection /> */}
            <AuthenticationUIFooter
                link={'Sign Up'}
                text="Don't  have an Account?"
                route={SIGNUP_ROUTE}
            />
        </AuthenticationUIWrapper>
    );
};

const LoginMainSection = ({ data, onMobile, onEmail }: any) => {
    const [error, setError] = useState<any>({});
    const [username, setUsername] = useState<string>(data || '');
    const [loading, setLoading] = useState(false);

    const { handleSendMobileOtp } = useOtpLogin();

    useEffect(() => {
        setError({});
    }, [username]);

    const schema = Joi.object({
        username: Joi.alternatives().conditional(Joi.ref('$is_mobile'), {
            is: true,
            then: Joi.number()
                .empty('')
                .max(9999999999)
                .required()
                .label('Mobile Number')
                .custom((value, helpers) => {
                    if (!/^[6789]\d{9}$/.test(value + '')) {
                        return helpers.error('any.unknown');
                    }
                    return value;
                }),
            otherwise: Joi.string()
                .empty('')
                .required()
                .email({ tlds: { allow: false } })
                .label('Email Address'),
        }),
    });

    const isMobile = useMemo(() => {
        if (!IsValidString(username + '')) return false;
        const isMobile = Joi.number().validate(username + '');
        return !isMobile.error;
    }, [username]);

    const validate = () => {
        const { error: err } = schema.validate(
            { username },
            {
                ...getJoiValidationOptions(),
                context: {
                    is_mobile: isMobile,
                },
            }
        );
        const newError = formatJoiErrorMessages(err);

        setError(newError);

        if (!IsEmptyObject(newError)) return false;
        return true;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (validate()) {
            if (isMobile) {
                if (IsFunction(onMobile)) {
                    handleSendMobileOtp(
                        { mobile: username },
                        () => setLoading(false),
                        (user: any) => onMobile(user)
                    );
                    return;
                }
            } else {
                if (IsFunction(onMobile)) {
                    onEmail({ username });
                }
            }
        }
        setLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className='flex-1 gap-6 justify-between col-flex'
        >
            <InputField
                label='Email'
                required
                name='username'
                placeholder='john@example.com'
                value={username}
                maxLength={isMobile ? 10 : undefined}
                error={error.username}
                addonEnd={<Icon source={ArcEmailSvgIcon} isSvg />}
                onChange={setUsername}
                autoComplete
            />
            <div className='gap-2 items-center col-flex'>
                <Button
                    className='h-11 normal-case'
                    loading={loading}
                    block
                    appearance='primary'
                    size='lg'
                >
                    Next &rarr;
                </Button>
            </div>
        </form>
    );
};

const OtpLoginSection = ({
    dialing_code,
    mobile,
    resetLogin = () => {},
}: any) => {
    const {
        loading,
        otp,
        resendbtn,
        setOtp,
        verifyOtp,
        resendOtp,
        setResendbtn,
    } = useOtpLogin();

    const enableOrDisableOtpBtn = useMemo(() => {
        return !(otp.length == 4);
    }, [otp.length]);

    const enterKeyPress = useCallback(() => {
        if (!enableOrDisableOtpBtn) {
            verifyOtp({ mobile });
        }
    }, [enableOrDisableOtpBtn, mobile, verifyOtp]);

    return (
        <div className='flex-1 gap-6 justify-between col-flex'>
            <div className='gap-6 col-flex'>
                <InputField
                    label='Mobile Number'
                    name='Mobile Number'
                    value={mobile}
                    addonEnd={
                        <button
                            className='link'
                            type='reset'
                            onClick={resetLogin}
                        >
                            <Icon
                                source={EditSvgIcon}
                                isSvg
                                iconColor='text-current'
                            />
                        </button>
                    }
                    disabled
                />
                <div className='gap-2 col-flex'>
                    <label className='label-text text-[13px] font-medium'>
                        OTP
                    </label>
                    <OTPInput
                        autoFocus
                        isNumberInput
                        length={4}
                        onEnterKeyPress={enterKeyPress}
                        inputClassName='otpInput !w-16'
                        className='justify-between row-flex'
                        onChangeOTP={setOtp}
                    />
                    <div className='justify-between row-flex'>
                        <div>
                            {resendbtn && (
                                <div
                                    onClick={() =>
                                        resendbtn
                                            ? resendOtp({
                                                  dialing_code,
                                                  mobile,
                                              })
                                            : null
                                    }
                                    className={'text-sm link link-hover'}
                                >
                                    Resend OTP
                                </div>
                            )}
                        </div>
                        {!resendbtn ? (
                            <span className='flex gap-1 items-center font-normal text-base-primary'>
                                <CountdownTimer
                                    duration={10}
                                    callback={() => setResendbtn(true)}
                                />
                                Seconds
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
            <div className='pt-6 border-t-2'>
                <Button
                    type='submit'
                    loading={loading}
                    disabled={enableOrDisableOtpBtn}
                    block
                    onClick={() => verifyOtp({ mobile })}
                >
                    Verify &amp; Proceed
                </Button>
            </div>
        </div>
    );
};

const EmailLoginSection = ({ email, resetLogin = () => {} }: any) => {
    const { handleLogin } = useLogin();

    const schema: FormBuilderFormSchema = {
        username: {
            type: 'email',
            name: 'username',
            label: 'Email Address',
            placeholder: 'Enter your email address',
            required: true,
            addonEnd: (
                <button className='link' type='reset' onClick={resetLogin}>
                    <Icon source={EditSvgIcon} isSvg iconColor='text-current' />
                </button>
            ),
            autoComplete: true,
            disabled: true,
        },
        password: {
            type: 'password',
            name: 'password',
            label: 'Password',
            placeholder: 'Password',
            minLength: 6,
            required: true,
            autoFocus: true,
            // messageComponent: () => (
            //     <div className='mt-2 mb-1'>
            //         <Link
            //             href={`${FORGOT_PASSWORD_ROUTE}?email=${email}`}
            //             className='text-sm link link-hover'
            //         >
            //             Forgot Password?
            //         </Link>
            //     </div>
            // ),
        },
    };

    return (
        <FormBuilder
            className='flex-1 justify-between h-full'
            formSchema={schema}
            onSubmit={handleLogin}
            initValues={{ username: email }}
        >
            {({ isSubmitting, disableSubmit, handleSubmit }) => (
                <div className='pt-6 bg-base-100 border-base-300'>
                    <Button
                        className='h-11 normal-case'
                        loading={isSubmitting}
                        disabled={disableSubmit}
                        block
                        appearance='primary'
                        onClick={handleSubmit}
                        size='lg'
                    >
                        Submit
                    </Button>
                </div>
            )}
        </FormBuilder>
    );
};

// const TwoFALogin = () => {
//     const { handleResetOtp, handleLogin2FA } = useLogin();

//     const [loading, setLoading] = useState(false);
//     const [totp, setTotp] = useState('');

//     const disableOtpBtn = useMemo(() => {
//         return !(totp.length == OTP_LENGTH);
//     }, [totp]);

//     const handleOtp = () => {
//         if (disableOtpBtn) return;

//         setLoading(true);
//         handleLogin2FA(next, totp);
//     };

//     const next = () => {
//         setLoading(false);
//     };

//     return (
//         <AuthenticationUIWrapper
//             title='2FA Confirmation'
//             subTitle='Enter the code from your application, In order to continue the login process'
//         >
//             <div className='flex-1 gap-6 col-flex'>
//                 <div className='gap-4 col-flex'>
//                     <span className='font-semibold'>
//                         To confirm the secret, enter the 6-digit code from the
//                         app
//                     </span>
//                     <div className='centralize'>
//                         <OTPInput
//                             length={OTP_LENGTH}
//                             autoFocus
//                             isNumberInput
//                             inputClassName='otpInput !w-12'
//                             className='gap-3 row-flex'
//                             onEnterKeyPress={handleOtp}
//                             onChangeOTP={setTotp}
//                             disabled={loading}
//                         />
//                     </div>

//                     <div className='flex gap-1 justify-center'>
//                         <Typography
//                             onClick={handleResetOtp as any}
//                             className='cursor-pointer text-info'
//                         >
//                             Reset
//                         </Typography>
//                         <Typography>Two-Factor Authentication</Typography>
//                     </div>
//                 </div>
//                 <div className='gap-6 mt-auto col-flex'>
//                     <div className='border'></div>
//                     <div className='grid grid-cols-2 gap-6 items-center'>
//                         <Button
//                             size='lg'
//                             appearance='primary'
//                             onClick={() => {
//                                 Navigation.back();
//                             }}
//                             outline
//                         >
//                             Back
//                         </Button>
//                         <Button
//                             size='lg'
//                             appearance='primary'
//                             block
//                             loading={loading}
//                             disabled={disableOtpBtn}
//                             onClick={handleOtp}
//                         >
//                             Next &rarr;
//                         </Button>
//                     </div>
//                     <div>
//                         <AuthenticationUIFooter
//                             link='Sign In'
//                             route={LOGIN_ROUTE}
//                             text='Already Have an Account?'
//                         />
//                     </div>
//                 </div>
//             </div>
//         </AuthenticationUIWrapper>
//     );
// };

const SocialLoginSection = () => {
    return (
        <div className='gap-6 col-flex'>
            <div className='my-0 divider text-base-secondary'>or</div>
            <div className='grid grid-col-1'>
                {/* <GoogleLoginButton oneTap /> */}
                <GoogleLoginButton />
            </div>
        </div>
    );
};

export default LoginModule;
