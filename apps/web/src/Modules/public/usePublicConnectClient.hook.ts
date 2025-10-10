import { useCallback, useEffect, useState } from 'react';

import { toastBackendError, useFetchParams } from '@finnoto/core';

export const usePublicConnectClient = () => {
    const { backend_url, token } = useFetchParams();
    const [facebookSDKLoaded, setFacebookSDKLoaded] = useState(false);

    const [sentAccessToken, setSentAccessToken] = useState(false);
    const [sentWaBaId, setSentWaBaId] = useState(false);

    const sendData = useCallback(
        async (data: any) => {
            const response = await fetch(`${backend_url}auth/connect-client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, ...data }),
            });

            if (!response.ok)
                toastBackendError(undefined, 'Something went wrong');
        },
        [backend_url, token]
    );

    const sendEventData = async (data: any) => {
        await sendData(data);
        setSentWaBaId(true);
    };

    const sendCode = async (access_code: any) => {
        const payload = { code: access_code };
        await sendData(payload);
        setSentAccessToken(true);
    };

    const launchWhatsAppSignup = () => {
        if (!facebookSDKLoaded || typeof window.FB === 'undefined') {
            setTimeout(launchWhatsAppSignup, 100);
            return;
        }

        window.fbq('trackCustom', 'WhatsAppOnboardingStart', {
            appId: '2535913113279344',
            feature: 'whatsapp_embedded_signup',
        });

        window.FB.login(
            (response) => {
                if (response.authResponse) {
                    console.log({ response });

                    const code = response.authResponse.code;
                    sendCode(code);

                    console.log('Authorization code:', code);
                    // Handle the code (e.g., send to backend)
                } else {
                    console.log(
                        'User cancelled login or did not fully authorize.'
                    );
                }
            },
            {
                config_id: '1818797815522125',
                response_type: 'code',
                override_default_response_type: true,
                extras: {
                    sessionInfoVersion: 2,
                },
            }
        );
    };

    useEffect(() => {
        // Initialize Facebook Pixel
        if (!window.fbq) {
            window.fbq = function () {
                window.fbq.callMethod
                    ? window.fbq.callMethod.apply(window.fbq, arguments)
                    : window.fbq.queue.push(arguments);
            };
            if (!window._fbq) window._fbq = window.fbq;
            window.fbq.push = window.fbq;
            window.fbq.loaded = true;
            window.fbq.version = '2.0';
            window.fbq.queue = [];

            const pixelScript = document.createElement('script');
            pixelScript.async = true;
            pixelScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
            document.head.appendChild(pixelScript);
        }

        // Initialize Facebook SDK
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '2535913113279344', // Use actual app ID
                cookie: true,
                xfbml: true,
                version: 'v19.0',
            });
            setFacebookSDKLoaded(true);
        };

        // Load Facebook SDK
        if (!document.getElementById('facebook-jssdk')) {
            const sdkScript = document.createElement('script');
            sdkScript.id = 'facebook-jssdk';
            sdkScript.src = 'https://connect.facebook.net/en_US/sdk.js';
            document.head.appendChild(sdkScript);
        }

        // Track page view
        window.fbq('init', 'your-pixel-id-goes-here');
        window.fbq('track', 'PageView');

        // Session logging message event listener
        window.addEventListener('message', (event) => {
            if (
                event.origin !== 'https://www.facebook.com' &&
                event.origin !== 'https://web.facebook.com'
            )
                return;
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'WA_EMBEDDED_SIGNUP') {
                    sendEventData(data?.data);
                }
            } catch {
                console.log('message event error: ', event.data); // remove after testing
                // your code goes here
            }
        });

        return () => {
            // Cleanup if needed
        };
    }, [sendEventData, token, backend_url]);

    return { launchWhatsAppSignup, sentWaBaId, sentAccessToken };
};
