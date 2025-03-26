import Joi from 'joi';
import { useEffect, useState } from 'react';

import { AuthUser } from '../../Models/User/auth.user';
import { FetchData } from '../useFetchData.hook';
import { useFetchParams } from '../useFetchParams.hook';

export const useForgotPassword = () => {
    const { email: queryEmail } = useFetchParams();
    const [email, setEmail] = useState(queryEmail || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [showCountDown, setShowCountDown] = useState(true);

    const msg = 'A password reset link has been sent to your email.';

    useEffect(() => {
        if (queryEmail) setEmail(queryEmail);
    }, [queryEmail]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const { error } = Joi.string()
            .email({ tlds: { allow: false } })
            .validate(email);

        if (error) {
            setLoading(false);
            setError(true);
            return;
        }
        setError(false);

        const { success } = await FetchData({
            className: AuthUser,
            method: 'sendForgetPasswordEmail',
            classParams: { email },
        });
        if (success) {
            setSuccess(true);
        }
        setLoading(false);
    };

    const reSendOtp = async () => {
        const { success } = await FetchData({
            className: AuthUser,
            method: 'sendForgetPasswordEmail',
            classParams: { email },
        });
        if (success) {
            setShowCountDown(true);
        }
    };

    return {
        success,
        error,
        loading,
        email,
        msg,
        showCountDown,
        setEmail,
        handleSubmit,
        setShowCountDown,
        reSendOtp,
    };
};
