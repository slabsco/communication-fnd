import { useEffect, useState } from 'react';

import { MetaUserController } from '../../backend/meta/controllers/meta.user.controller';
import { LOGIN_ROUTE, RESET_2FA_SYNC_ROUTE } from '../../Constants';
import { StoreUserToken } from '../../Models';
import { AuthUser } from '../../Models/User/auth.user';
import { FormBuilderSubmitType } from '../../Types/formBuilder.types';
import { Authentication } from '../../Utils/authentication';
import { handleLoginNextScreen } from '../../Utils/login.utils';
import { Navigation } from '../../Utils/navigation.utils';
import {
    SubscribeToEvent,
    UnsubscribeEvent,
} from '../../Utils/stateManager.utils';
import { Toast } from '../../Utils/toast.utils';
import { Functions } from '../../Utils/ui.utils';
import { FetchData } from '../useFetchData.hook';
import { useFetchParams } from '../useFetchParams.hook';

export const useLogin = () => {
    const { token, email, referrer } = useFetchParams();
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin: FormBuilderSubmitType = async (values, { setError }) => {
        const { success, response } = await FetchData({
            className: AuthUser,
            method: 'login',
            classParams: values,
        });

        if (!success) {
            if (response.columns) {
                setError(response.columns);
            } else {
                Toast.error({
                    description: response.message || 'Unable to log you in!',
                });
            }
            return;
        }

        const { two_factor_required, credential } = response;

        if (two_factor_required) {
            Navigation.navigate({
                url: LOGIN_ROUTE,
                queryParam: {
                    token: credential,
                    email: values?.username,
                    referrer,
                },
            });
            return;
        }

        await handleLoginNextScreen(response);
        // setLoading(true);
    };

    const handleLogin2FA = async (next = () => {}, totp: string) => {
        const { success, response } = await FetchData({
            className: AuthUser,
            method: 'login2fa',
            classParams: { credential: token, code: totp },
        });

        if (success) {
            await handleLoginNextScreen(response);
        } else {
            Toast.error({
                description: response.message || 'Something went Wrong',
            });
        }
        next();
    };

    const handleResetOtp = async () => {
        StoreUserToken({ access_token: token }, true);
        const { success, response } = await FetchData({
            className: MetaUserController,
            method: 'getResetTotpSeed',
        });

        if (success) {
            Navigation.navigate({
                url: RESET_2FA_SYNC_ROUTE,
                queryParam: {
                    totp_seed: response.totp_seed,
                    email: email,
                },
            });
        }
    };

    const processGoogleLogin = async (
        token: string,
        data?: any,
        is_one_tap?: boolean
    ) => {
        const { hide: hideLoading = () => {} } = Functions.toastLoading({
            description: 'Please wait. Processing Google Login...',
        });

        const loginFn = Authentication.googleLogin;

        const response = await loginFn({
            access_token: token,
        });

        if (!response) return hideLoading();

        handleLoginNextScreen(response);
        hideLoading();
    };

    const toggleLoading = (data = true) => setLoading(data);

    useEffect(() => {
        SubscribeToEvent({
            eventName: 'login_loading',
            callback: toggleLoading,
        });

        return () => {
            UnsubscribeEvent({
                eventName: 'login_loading',
                callback: toggleLoading,
            });
        };
    }, []);

    return {
        loading,
        token,
        email,
        handleLogin,
        handleLogin2FA,
        handleResetOtp,
        processGoogleLogin,
    };
};
