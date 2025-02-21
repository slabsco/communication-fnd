import { useMemo, useState } from 'react';

import {
    FormBuilderFormSchema,
    LOGIN_ROUTE,
    OTP_LENGTH,
    useSignup,
    useUserLoggedInHandler,
} from '@finnoto/core';
import { Button, FormBuilder, Icon } from '@finnoto/design-system';

import GoogleLoginButton from './Components/googleLoginButton.component';
import LoginPageFrame, {
    AuthenticationUIFooter,
    AuthenticationUIWrapper,
} from './Components/loginPageFrame.component';

import { InputEmailIcon, UserSvgIcon } from 'assets';

const SignupModule = () => {
    useUserLoggedInHandler();

    const { username, seed, isTotp, handleSignup, handleTotp } = useSignup();

    return (
        <LoginPageFrame>
            {isTotp ? (
                <TwoFASetup {...{ username, seed }} onTotp={handleTotp} />
            ) : (
                <SignupScreen {...{ handleSignup }} />
            )}
        </LoginPageFrame>
    );
};

const SignupScreen = ({ handleSignup }: any) => {
    const [agreeTerms, setAgreeTerms] = useState(true);
    const schema: FormBuilderFormSchema = {
        name: {
            type: 'text',
            label: 'Name',
            placeholder: 'Enter your name',
            autoFocus: true,
            required: true,
            addonEnd: <Icon source={UserSvgIcon} isSvg />,
            // size: width > 1600 ? 'lg' : 'md',
        },
        email: {
            type: 'email',
            label: 'Email',
            placeholder: 'Email',
            required: true,
            addonEnd: <Icon source={InputEmailIcon} isSvg />,
            // size: width > 1600 ? 'lg' : 'md',
        },
        mobile: {
            type: 'text',
            placeholder: 'Enter Mobile',
            label: 'Mobile',
            prefix: <div>+91</div>,
            required: true,
            maxLength: 10,
        },
        password: {
            type: 'password',
            label: 'Password',
            placeholder: 'Password',
            minLength: 6,
            required: true,
            // size: width > 1600 ? 'lg' : 'md',
        },
        // confirmPassword: {
        //     type: 'password',
        //     label: 'Confirm Password',
        //     placeholder: 'Confirm Password',
        //     refKey: 'password',
        //     required: true,
        //     hidePasswordToggle: true,
        //     // size: width > 1600 ? 'lg' : 'md',
        // },
    };
    return (
        <AuthenticationUIWrapper
            title='Sign Up'
            subTitle='Enter your credentials and start your journey with us !'
        >
            <FormBuilder
                className='flex-1 gap-8 justify-between h-full'
                formSchema={schema}
                onSubmit={handleSignup}
            >
                {({ isSubmitting, handleSubmit, disableSubmit }) => (
                    <>
                        <div className='pt-4 border-t-2 bg-base-100 border-base-300'>
                            {/* <CheckBox
                                checked={agreeTerms}
                                onChange={(data) => setAgreeTerms(data)}
                                rightLabel={
                                    <div>
                                        I have read and agreed to the{' '}
                                        <Link
                                            href='https://finnoto.com/terms-and-condition'
                                            target='_blank'
                                            className='link link-hover'
                                        >
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href='https://finnoto.com/privacy-policy'
                                            target='_blank'
                                            className='link link-hover'
                                        >
                                            Privacy Policy
                                        </Link>
                                        .
                                    </div>
                                }
                            /> */}
                            <div className='gap-4 justify-end mt-4 h-full col-flex'>
                                <Button
                                    className='normal-case'
                                    size='lg'
                                    loading={isSubmitting}
                                    disabled={disableSubmit || !agreeTerms}
                                    block
                                    appearance='primary'
                                    onClick={handleSubmit}
                                >
                                    Next &rarr;
                                </Button>
                                {/* <SocialLoginSection /> */}
                                <AuthenticationUIFooter
                                    link={'Sign In'}
                                    text='Already having an account?'
                                    route={LOGIN_ROUTE}
                                />
                            </div>
                        </div>
                    </>
                )}
            </FormBuilder>
        </AuthenticationUIWrapper>
    );
};

const TwoFASetup = ({
    username,
    seed,
    onTotp,
}: {
    username: string;
    seed: string;
    onTotp?: (next: VoidFunction, totp?: string) => void;
}) => {
    const skipOtp = (nextSkip: VoidFunction) => {
        if (onTotp) onTotp(nextSkip);
    };

    skipOtp(() => {});

    const [loading, setLoading] = useState(false);
    const [totp, setTotp] = useState('');

    const disableOtpBtn = useMemo(() => {
        return !(totp.length == OTP_LENGTH);
    }, [totp]);

    const handleOtp = () => {
        if (disableOtpBtn) return;

        setLoading(true);
        if (onTotp) onTotp(next, totp);
    };

    // This step is no longer need so, it is skipped for now

    const next = () => {
        setLoading(false);
    };

    return <></>;
    // return (
    //     <div className='flex-1 gap-6 col-flex'>
    //         <div className='text-3xl lg:text-[42px] font-semibold text-base-primary leading-tight'>
    //             Register 2FA
    //         </div>

    //         <div className='text-base font-normal text-base-secondary'>
    //             To set up two-factor authentication, scan this QR code
    //         </div>
    //         <div className='lg:justify-center row-flex'>
    //             <Image
    //                 src={`https://www.google.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth://totp/Finnoto:${username}?secret=${seed}&issuer=Finnoto`}
    //                 height={200}
    //                 width={200}
    //                 alt='otp qr code'
    //             />
    //         </div>
    //         <div className='text-base font-normal text-base-secondary'>
    //             If your app doesn’t recognize the QR code, enter the following
    //             key manually :{' '}
    //             <span className='font-semibold text-base-primary'> {seed}</span>
    //         </div>
    //         <div className='gap-6 col-flex'>
    //             <span className='font-semibold'>
    //                 To confirm the secret, enter the 6-digits code from the app
    //             </span>
    //             <OTPInput
    //                 length={OTP_LENGTH}
    //                 autoFocus
    //                 isNumberInput
    //                 inputClassName='otpInput !w-12'
    //                 className='gap-3 row-flex'
    //                 onEnterKeyPress={handleOtp}
    //                 onChangeOTP={setTotp}
    //                 disabled={loading}
    //             />
    //             <a
    //                 onClick={() => {
    //                     Navigation.navigate({ url: LOGIN_ROUTE });
    //                 }}
    //             >
    //                 <span className='text-sm font-medium link link-hover'>
    //                     Login With different User
    //                 </span>{' '}
    //             </a>
    //         </div>
    //         <div className='gap-4 mt-auto row-flex'>
    //             <Button
    //                 className='w-48 normal-case rounded-lg'
    //                 disabled={loading}
    //                 outline
    //                 // progress // TODO: implement this
    //                 appearance='primary'
    //                 onClick={skipOtp}
    //             >
    //                 Skip
    //             </Button>
    //             <Button
    //                 className='w-48 normal-case rounded-lg'
    //                 appearance='primary'
    //                 loading={loading}
    //                 disabled={disableOtpBtn}
    //                 onClick={handleOtp}
    //             >
    //                 Next &rarr;
    //             </Button>
    //         </div>
    //     </div>
    // );
};

const SocialLoginSection = () => {
    return (
        <div className='gap-6 col-flex'>
            <div className='my-0 divider text-base-secondary'>or</div>
            <div className='grid grid-col-1'>
                {/* <GoogleLoginButton context={'signup'} oneTap /> */}
                <GoogleLoginButton context={'signup'} />
            </div>
        </div>
    );
};

export default SignupModule;
