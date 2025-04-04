import { ObjectDto } from '../../backend/Dtos';
import { LOGIN_ANALYTICS } from '../../Constants/analyticsEvent.constant';
import { USER } from '../../Constants/event.constant';
import {
    ACCESS_TOKEN,
    ADDRESSES,
    FAVOURITE_BUSINESS,
    LAST_LOGIN_INFORMATION,
    LOGGED_USER_REFERRAL_CODE,
    META_ACCESS_TOKEN,
    REFRESH_TOKEN,
} from '../../Constants/storage.constant';
import { AnalyticsEvent } from '../../Utils/analytics.utils';
import { Authentication } from '../../Utils/authentication';
import { IsEmptyArray } from '../../Utils/common.utils';
import { StoreEvent } from '../../Utils/stateManager.utils';
import {
    GetItem,
    GetItemAsync,
    RemoveItem,
    SetItem,
} from './../../Utils/localStorage.utils';

type ID = number | string;
export interface USER_DATA {
    id: ID;
    name: string;
    email: string;
    mobile: string;
    dialing_code: ID;
    mobile_verified_at: string;
    email_verified_at: string;
    image_url?: string;
    roles: any[];
    permissions: any[];
    role_identifiers: any[];
    permission_identifiers: any[];
    loginCheckDone: boolean;
    business: ObjectDto;
    vendor: ObjectDto;
    employee?: ObjectDto;
    employee_id?: number;
    referral: {
        referral_code: string;
        dynamic_link_url?: string;
    };
    attributes: {
        referral_code: string;
        blocked: boolean;
        referral_count: number;
    };
    auth_attributes?: {
        vendor_id?: number;
        business_id?: number;
        product_id?: number;
    };
    meta_business_id?: number;
    metaAuthData?: any;
}

const DEFAULT_USER = {
    loginCheckDone: false,
};

export class User {
    private static userInstance: User;
    public userObject = DEFAULT_USER as USER_DATA;
    public;

    static getInstance() {
        if (!this.userInstance) {
            this.userInstance = new User();
        }
        return this.userInstance;
    }

    /**
     * if currently user has logged  user_id is sent
     * this method is mainly created for use in platforms where there is no business flow(pwa)
     */
    public async getIdObject() {
        let userId = this.userObject.id;
        if (!userId) {
            await this.getUserAsync();
            userId = this.userObject.id;
        }
        if (userId) return { user_id: parseInt(userId as string, 10) };

        return false;
    }

    async getUserAsync() {
        if (this.userObject && this.userObject.loginCheckDone) {
            return this.userObject;
        }

        await Authentication.loginCheck();

        return this.getUserData();
    }

    getUserData() {
        return this.userObject;
    }

    getProductId() {
        return this.userObject?.auth_attributes?.product_id || 1;
    }

    // reset access token
    // async loginCheck() {
    //     const result = await (this as User).get({ url: LOGIN_CHECK_API });
    //     return (this as User).updateUserData(result);
    // }

    saveUserLoginData() {
        const { meta_business_id, email, auth_attributes } = this.getUserData();

        const lastLoginInformation = {
            email,
            business_id: meta_business_id,
            product_id: auth_attributes?.product_id,
        };

        SetItem(
            LAST_LOGIN_INFORMATION + email + meta_business_id,
            lastLoginInformation,
            {
                isNonVolatile: true,
            }
        );
    }

    logoutUser() {
        // wipeout the tokens from localstorage
        ClearUserToken();

        this.saveUserLoginData();

        StoreEvent({ eventName: USER, data: { loginCheckDone: true } });

        // disconnect and reconnect to socket in order to remove current user session
        // ReconnectSocket();

        this.userObject = { loginCheckDone: true } as USER_DATA;
        // update internal user info
        this.updateUserData({ loginCheckDone: true });

        RemoveItem({ clearVolatileStorage: true }); // remove all volatile data
    }

    clearUserData() {
        this.userObject = { loginCheckDone: true } as USER_DATA;
        // update internal user info
        this.updateUserData({ loginCheckDone: true });
    }

    async updateUserData(data, isLogin?: boolean) {
        if (!this.userObject.id) {
            if (this.userObject.loginCheckDone && !data.id) {
                StoreEvent({ eventName: USER, data });
                return {};
            }
        }

        if (isLogin) {
            const { id, name, mobile, email } = data;
            AnalyticsEvent(LOGIN_ANALYTICS, { id, name, mobile, email });
        }

        // maintain userobject in the internal variable
        this.userObject = { ...data, loginCheckDone: true };

        const { referral_code } = this.userObject?.referral || {};

        this.setUserReferralCode(referral_code);

        // broadcast event about modification in user data in the system
        StoreEvent({ eventName: USER, data: this.userObject });
        return this.userObject;
    }

    setUserReferralCode(referralCode) {
        SetItem(LOGGED_USER_REFERRAL_CODE, referralCode);
    }

    getUserReferralCode(sync = true) {
        if (sync) {
            return GetItem(LOGGED_USER_REFERRAL_CODE);
        }
        return GetItemAsync(LOGGED_USER_REFERRAL_CODE);
    }

    /**
     * Will sync favourite businesses and addresses of user to local
     *
     * @param {*} data
     * @memberof User
     */
    async syncAddressAndFavouriteBusinesses(data: any) {
        if (!IsEmptyArray(data.favourites) && data.favourites) {
            SetItem(FAVOURITE_BUSINESS, data.favourites);
        }

        if (!IsEmptyArray(data.address) && data.addresses) {
            SetItem(ADDRESSES, data.addresses);
        }
    }
}

export function StoreUserToken(data?: ObjectDto, isMeta: boolean = false) {
    const { refresh_token, access_token } = data || {};
    // store refresh_token in the local storage
    refresh_token && SetItem(REFRESH_TOKEN, refresh_token);
    // store access_token in the local storage
    access_token &&
        SetItem(isMeta ? META_ACCESS_TOKEN : ACCESS_TOKEN, access_token);

    Authentication.BEARER_TOKEN = access_token;
    // LoginToSocket(access_token); // notify to socket about login event
}

export function ClearUserToken() {
    // wipeout the tokens from localstorage
    SetItem(REFRESH_TOKEN, null);
    SetItem(ACCESS_TOKEN, null);
    SetItem(META_ACCESS_TOKEN, null);
}

export const user = User.getInstance();
