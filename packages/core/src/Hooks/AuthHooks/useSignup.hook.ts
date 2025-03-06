import { useEffect, useState } from 'react';

import { VERIFY_EMAIL_ROUTE } from '../../Constants';
import { StoreUserToken } from '../../Models';
import { AuthUser } from '../../Models/User/auth.user';
import { FormBuilderSubmitType } from '../../Types/formBuilder.types';
import { IsValidString } from '../../Utils/common.utils';
import { Navigation } from '../../Utils/navigation.utils';
import { Toast } from '../../Utils/toast.utils';
import { FetchData } from '../useFetchData.hook';
import { useFetchParams } from '../useFetchParams.hook';

export const useSignup = () => {
    const { email, token, seed: paramsSeed } = useFetchParams();
    const [username, setUsername] = useState(email || '');
    const [seed, setSeed] = useState(paramsSeed || '');
    const [credential, setCredential] = useState(token || '');
    const [isTotp, setIsTotp] = useState(false);

    useEffect(() => {
        if (token) setIsTotp(true);
    }, [token]);

    const handleSignup: FormBuilderSubmitType = async (
        values,
        { setError }
    ) => {
        const { success, response } = await FetchData({
            className: AuthUser,
            method: 'signup',
            classParams: values,
        });
        if (!success) {
            if (response.columns) {
                setError(response.columns);
            } else {
                Toast.error({
                    description: response.message || 'Something Went Wrong!!',
                });
            }

            return;
        }

        // setUsername(values.username);
        // setSeed(response.totp_seed);
        // setCredential(response.credential);
        // setIsTotp(true);

        Navigation.navigate({
            url: VERIFY_EMAIL_ROUTE,
            queryParam: { token: response?.code, email: response?.email },
        });
        // Toast.success({
        //     description:
        //         'Please Login Via the credentials that you have set before.',
        // });
    };

    const handleTotp = async (next = () => {}, totp?: string) => {
        const params: any = { credential };

        if (totp && IsValidString(totp)) {
            params.code = totp;
        }

        const { success, response } = await FetchData({
            className: AuthUser,
            method: 'register',
            classParams: params,
        });

        if (success) {
            StoreUserToken(response?.user, true);
            Navigation.navigate({
                url: VERIFY_EMAIL_ROUTE,
                queryParam: { email: username },
                method: 'replace',
            });
        }

        next();
    };

    return { username, seed, isTotp, handleSignup, handleTotp };
};
