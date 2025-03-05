import { useLogin } from '@finnoto/core';
import { Button, Icon } from '@finnoto/design-system';

import API_CONSTANTS from '@Constants/api.constants';
import {
    googleLogout,
    GoogleOAuthProvider,
    useGoogleLogin,
} from '@react-oauth/google';
import { loadDynamicPage } from '@Utils/functions.utils';

import { GoogleSvgIcon } from 'assets';

const GoogleOneTapLogin = loadDynamicPage(
    () => import('react-google-one-tap-login')
);

const GoogleLoginButton = ({
    oneTap,
    context = 'Sign in',
}: {
    oneTap?: boolean;
    context?: 'Sign in' | 'signup';
}) => {
    const { processGoogleLogin } = useLogin();

    if (oneTap) {
        return (
            <div className='hidden'>
                <GoogleOneTapLogin
                    googleAccountConfigs={{
                        client_id: API_CONSTANTS.GOOGLE_API,
                        auto_select: false,
                        cancel_on_tap_outside: false,
                        context,
                        itp_support: true,
                        callback: ({ credential }: any) => {
                            if (!credential) return;
                            processGoogleLogin(credential, {}, true);
                        },
                    }}
                />
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={API_CONSTANTS.GOOGLE_API}>
            <GoogleCustomButton {...{ processGoogleLogin, context }} />
        </GoogleOAuthProvider>
    );
};

const GoogleCustomButton = ({ processGoogleLogin, context }: any) => {
    const login = useGoogleLogin({
        onSuccess: async (response: any) => {
            const req = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo?access_token=' +
                    response?.access_token
            );
            const res = await req.json();

            googleLogout();
            processGoogleLogin(response?.access_token, res);
        },
        ux_mode: 'popup',
    });
    return (
        <Button
            onClick={login}
            appearance='primary'
            outline
            className='gap-2 h-11 font-normal capitalize row-flex dark:text-base-content'
            size='lg'
        >
            <span>{context} with Google</span>
            <Icon source={GoogleSvgIcon} isSvg size={24} />
        </Button>
    );
};

export default GoogleLoginButton;
