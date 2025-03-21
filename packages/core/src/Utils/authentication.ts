import {
    ACCESS_TOKEN,
    LOGIN_WHATS_APP_TOKEN,
    META_ACCESS_TOKEN,
    REFRESH_TOKEN,
    U_DEVICE_IDENTIFIER,
} from '../Constants';
import { API_CONSTANTS } from '../Constants/env.constant';
import { UserBusiness } from '../Models/Business/user.business';
import { StoreUserToken, user } from '../Models/User';
import { FetchReferralCode } from './common.utils';
import { Get, IsValidResponse, Post } from './http.utils';
import { GetItemAsync, SetItem } from './localStorage.utils';
import { GetPlatformId, GetVersion } from './version.utils';

export class Authentication {
    private static DEVICE_TOKEN_URL = 'auth/device';
    public static LOGIN_GOOGLE_API = 'auth/google';
    public static LOGIN_GOOGLE_ONE_API = 'auth/google-one';
    private static LOGIN_CHECK = 'auth';
    private static LOGOUT_API = 'auth/logout';
    public static BEARER_TOKEN: string | null = null;

    /**
     * user login call
     */
    static async googleOneLogin({ access_token }: { access_token: string }) {
        const { status, data } = await Post({
            url: Authentication.LOGIN_GOOGLE_ONE_API,
            data: { access_token },
            isMeta: true,
        });

        if (!data || !(status >= 200 && status < 300)) return null;

        return data;
    }

    /**
     * user login call
     */
    static async googleLogin({ access_token }: { access_token: string }) {
        const { status, data } = await Post({
            url: Authentication.LOGIN_GOOGLE_API,
            data: { access_token },
            isMeta: true,
        });

        if (!data || !(status >= 200 && status < 300)) return null;

        return data;
    }

    // static async signup({}) {}

    /**
     * try to resolves access token in following order
     * if found in local memory, return
     * else if found in local storage, return
     * else retrieve from api server and return
     * @param  {boolean} isMeta?
     */
    static async fetchAccessToken(isMeta: boolean = false) {
        if (isMeta) return await GetItemAsync(META_ACCESS_TOKEN);

        if (this.BEARER_TOKEN) return this.BEARER_TOKEN;
        // if in local storage
        const access_token = await GetItemAsync(ACCESS_TOKEN);
        if (access_token) {
            this.BEARER_TOKEN = access_token;
            return access_token;
        }

        return null;
    }

    // public static fetchFreshAccessToken = AvoidParallelAsyncCall(Authentication._fetchFreshAccessToken);

    /**
     * Fetches access token from the server by passing the refresh_token
     * @param  {boolean} redirectToLoginWhenFailToFetch?
     */

    public static async loginCheck(
        checkBusiness: boolean = false,
        isMeta: boolean = false
    ) {
        let userObj = user.getUserData();

        if (!userObj.loginCheckDone || !userObj.id) {
            const access_token = await this.fetchAccessToken(isMeta);

            if (!access_token) {
                user.updateUserData({});
                return false;
            }

            const result = await Get({
                url: this.LOGIN_CHECK,
                baseURL: isMeta ? API_CONSTANTS.ROUTE_URL : undefined,
                isMeta,
            });

            let metaAuthData = null;
            if (!isMeta) {
                metaAuthData = await Get({
                    url: this.LOGIN_CHECK,
                    baseURL: API_CONSTANTS.ROUTE_URL,
                    isMeta: true,
                });

                if (!metaAuthData?.data) return false;
            }
            if (Number(result.status) === 600 || !result.data) {
                return false;
            }
            userObj = result?.data
                ? { ...result?.data, metaAuthData: metaAuthData?.data }
                : {};
        }

        if (checkBusiness && !(userObj.business || userObj.vendor))
            return false;

        user.updateUserData(userObj);
        UserBusiness.setCurrentBusiness(userObj.business || userObj.vendor);
        return userObj;
    }

    public static async refreshUserData() {
        const result = await Get({
            url: this.LOGIN_CHECK,
            baseURL: API_CONSTANTS.ROUTE_URL,
            isMeta: true,
        });

        let userObj = user.getUserData();

        if (result?.data) {
            user.updateUserData(result?.data);
        }
    }

    /**
     * fetches refresh token from localstorage
     * if token not found and redirectToLoginWhenFailToFetch is true, redirects to home page
     * @param  {boolean} redirectToLoginWhenFailToFetch?
     */
    static async fetchRefreshToken(redirectToLoginWhenFailToFetch?: boolean) {
        const refresh_token = await GetItemAsync(REFRESH_TOKEN);
        if (refresh_token) {
            return refresh_token;
        }

        if (redirectToLoginWhenFailToFetch) {
        }
    }

    /**
     * returns device uuid token stored in the localstorage
     */
    static async fetchDeviceToken() {
        const device_identifier_token = await GetItemAsync(
            U_DEVICE_IDENTIFIER,
            true
        );
        return device_identifier_token;
    }

    /**
     * makes api call with device token and stores device uuid in the localstorage
     * @param  {string} deviceToken
    //  * @param  {number} platform_id=1
    //  * @param  {string} version
     */
    static async storeDeviceIdentifierToken(
        device_token: string,
        version?: string
    ) {
        const platform_id = await GetPlatformId();

        if (!version) {
            version = await GetVersion();
        }

        if (!device_token) {
            return false;
        }

        const { data: device } = await Post({
            url: this.DEVICE_TOKEN_URL,
            data: { token: device_token, platform_id, version },
        });

        if (device) {
            const device_identifier_token = device.uuid;
            SetItem(U_DEVICE_IDENTIFIER, device_identifier_token, {
                isNonVolatile: true,
            });
            return device;
        }
    }

    static async logout() {
        // Logout in meta server.
        await Post({
            url: this.LOGOUT_API,
            baseURL: API_CONSTANTS.ROUTE_URL,
            isMeta: true,
        });

        // Logout in business server.
        await Post({
            url: this.LOGOUT_API,
        });

        user.logoutUser();
        this.BEARER_TOKEN = null;
    }

    static storeWhatsAppToken(token) {
        // set whats app token id for 5 minutes
        SetItem(LOGIN_WHATS_APP_TOKEN, token, { span: 5 });
    }

    static async checkWhatsAppLogin() {
        const id = await GetItemAsync(LOGIN_WHATS_APP_TOKEN);
        if (id) {
            Authentication.verifyWhatsappToken({ id });
        }
    }

    static clearWhatAppToken() {
        SetItem(LOGIN_WHATS_APP_TOKEN, null, { span: 5 });
    }

    static verifyWhatsappToken = async ({ id }) => {
        const api = 'validateWhatsAppToken';
        const result = await Get({ url: api + '/' + id });
        const { data, status } = result;
        if (IsValidResponse({ status }) && data) {
            StoreUserToken(data);
            Authentication.clearWhatAppToken();
            Authentication.loginCheck();
            return result;
        }

        return { status: null };
    };

    static generateWhatsappToken = async () => {
        const api = 'generateWhatsAppToken';
        const referral_code = await FetchReferralCode();
        const body: { referral_code?: string } = {};

        if (referral_code) {
            body.referral_code = referral_code;
        }

        const { data = {}, status } = await Post({ url: api, data: body });

        if (IsValidResponse({ status })) {
            const whatsappPollingId = data.id;
            Authentication.storeWhatsAppToken(whatsappPollingId);
            return { success: true, response: data };
        }
        return { success: false, response: {} };
    };
}

interface LOGIN_INTERFACE {
    username: string;
    password: string;
}
