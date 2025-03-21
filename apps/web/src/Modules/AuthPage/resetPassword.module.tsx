import Image from 'next/image';
import Link from 'next/link';

import {
    LOGIN_ROUTE,
    Navigation,
    useResetPassword,
    useUserLoggedInHandler,
} from '@finnoto/core';
import { Button, InputField } from '@finnoto/design-system';
import { InputPassword } from '@finnoto/design-system/src/Components/Inputs/InputField/input.password.component';

import { PasswordChangedImage } from '@Constants/imageMapping';

import LoginPageFrame, {
    AuthenticationUIWrapper,
} from './Components/loginPageFrame.component';

const ResetPasswordPage = () => {
    useUserLoggedInHandler();

    const {
        loading,
        success,
        msg,
        email,
        password,
        reEnterPassword,
        error,
        setPassword,
        setReEnterPassword,
        handleSubmit,
    } = useResetPassword();

    return (
        <LoginPageFrame className='max-w-[514px]'>
            <AuthenticationUIWrapper
                title={success ? 'Password Changed' : 'Reset Password'}
                subTitle={
                    !success
                        ? `Enter the email address associated with your account
                            and we’ll send you a link to reset your password`
                        : 'Your password is successfully changed, you can click the button bellow to navigate to login page'
                }
            >
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className='flex-1 col-flex'
                >
                    {success && (
                        <div className='w-full h-full centralize'>
                            <Image
                                src={PasswordChangedImage()}
                                height={400}
                                width={400}
                                alt='Password changed'
                            />
                        </div>
                    )}
                    {!success ? (
                        <div className='flex-1 col-flex'>
                            <div className='flex-1 gap-2 col-flex'>
                                <InputField
                                    label='Email Address'
                                    name='email'
                                    value={email}
                                    disabled
                                    readOnly
                                />
                                <InputPassword
                                    label='Password'
                                    name='password'
                                    value={password}
                                    onChange={setPassword}
                                    autoFocus
                                    error={error.password}
                                    disabled={loading}
                                    placeholder={'Enter new password'}
                                    required
                                />
                                <InputPassword
                                    label='Confirm Password'
                                    name='confirm-password'
                                    value={reEnterPassword}
                                    onChange={setReEnterPassword}
                                    error={error.reEnterPassword}
                                    disabled={loading}
                                    placeholder={'Re-enter new password'}
                                    trimSpecialChar={false}
                                    required
                                />
                                <div className='text-sm'>
                                    Already have an account?{' '}
                                    <Link
                                        href={LOGIN_ROUTE}
                                        className='link link-hover'
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                            <div className='gap-2 items-center mt-2 col-flex'>
                                <Button
                                    loading={loading}
                                    className='normal-case'
                                    block
                                    appearance='primary'
                                >
                                    Confirm &rarr;
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className='gap-4 mt-auto w-full'>
                            <Button
                                className='h-11 normal-case'
                                appearance='primary'
                                block
                                onClick={() =>
                                    Navigation.navigate({
                                        url: LOGIN_ROUTE,
                                    })
                                }
                            >
                                Go to Login
                            </Button>
                        </div>
                    )}
                </form>
            </AuthenticationUIWrapper>
        </LoginPageFrame>
    );
};

export default ResetPasswordPage;
