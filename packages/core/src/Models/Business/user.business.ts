import { CURRENT_BUSINESS, SET_CURRENT_BUSINESS, USER } from '../../Constants';
import { API_CONSTANTS } from '../../Constants/env.constant';
import { AutoBind } from '../../Decorators/autobind.decorator';
import { IsEmptyObject } from '../../Utils/common.utils';
import { GetItem, SetItem } from '../../Utils/localStorage.utils';
import { StoreEvent, SubscribeToEvent } from '../../Utils/stateManager.utils';
import { ObjectDto } from '../../backend/Dtos';
import { USER_DATA, user } from '../User';
import { AddAddressDto } from '../dto/add.address.dto';

type ID = number | string;

export const BUSINESS_API_URL = 'BUSINESS_API_URL';
const META_BUSINESS_API_URL = 'META_BUSINESS_API_URL';

interface BUSINESS_INTERFACE {
    id: ID;
    name: string;
    identifier: string;
    address?: AddAddressDto;
    dialing_code: string | number;
    mobile: string;
    address_id: number;
    owner_id: string | number;
    verified_at: string;
    primary_image_url: string;
    opening_hour: string;
    closing_hour: string;
    average_rating: ID;
    country_id: ID;
    meta_server_id: number;
    country?: {
        id: ID;
        name: string;
        identifier: string;
        currency_identifier: string;
        dialing_code: number;
        international_dialing_code: number;
        timezone_offset: number;
        flag_image_url: string;
        is_sms_otp_supported: boolean;
    };
    isSessionActive?: boolean;
    lastActive?: boolean;
    primary_upi?: ObjectDto;
    access_type: {
        id: ID;
        deleted_at: null;
        lookup_type_id: ID;
        name: string;
        value: string;
        description: string;
    };
    attributes: ObjectDto;
}

class userBusiness {
    // private static businessInstance: userBusiness;

    protected static api: string;

    private static current_business: BUSINESS_INTERFACE =
        {} as BUSINESS_INTERFACE; // stores current business being selected in app

    private static api_url: string; // stores current business api url

    static _registerEvents() {
        SubscribeToEvent({
            eventName: SET_CURRENT_BUSINESS,
            callback: this._updateAndBroadcastCurrentBusiness,
        });
        SubscribeToEvent({ eventName: USER, callback: this._userDataModified });
    }

    // static getInstance() {
    //     if (!this.businessInstance) {
    //         this.businessInstance = new userBusiness();
    //     }

    @AutoBind
    static _userDataModified(data) {
        if (IsEmptyObject(data)) {
            return;
        }

        // if user is not logged in and loginCheck is already done
        if (data && data.loginCheckDone && !data.id) {
            // clear current business
            this._updateAndBroadcastCurrentBusiness();
        }
    }

    /**
     * fetch last selected business, and if active, set it to current business
     */
    // @AutoBind
    // static async setLastActiveBusiness() {
    //     if (this.isValidBusiness(this.current_business)) {
    //         return this.current_business;
    //     }
    //     const businesses = await this.get();

    @AutoBind
    static getCurrentBusiness() {
        if (this.isValidBusiness(this.current_business)) {
            return this.current_business;
        }
        return null;
    }

    /**
     * as same as setLastActiveBusiness, except it skips check of isSessionActive
     * used when business mode is selected without specifying about which business
     * method uses last stored business and set it to current active business
     */
    // @AutoBind
    // static async setLastBusiness() {
    //     if (this.isValidBusiness(this.current_business)) {
    //         return this.current_business;
    //     }
    //     const lastBusiness = await this._getLastBusinessSession();
    //     const identifier = lastBusiness?.identifier;
    //     return this.setCurrentBusiness(identifier);
    // }

    /**
     * takes business id and sets current business id
     * @param  {} business_id
     */
    @AutoBind
    public static async setCurrentBusiness(business) {
        if (this.isValidBusiness(business)) {
            this._updateAndBroadcastCurrentBusiness(business);
            return business;
        }
        return false;
    }

    /**
     * returns id object on the basis of user's business
     * if currently user has logged in as business, object with key business_id is sent
     * else user_id is sent
     */
    @AutoBind
    public static getIdObject() {
        if (this.isValidBusiness(this.current_business)) {
            return {
                business_id: this.current_business.id,
            };
        }

        const userId = user.getUserData().id;
        if (userId) return { user_id: parseInt(userId as string, 10) };

        return false;
    }

    /**
     * returns relevant session data of business or user based on current mode
     */
    @AutoBind
    public static getSessionDetail(): BUSINESS_INTERFACE | USER_DATA | false {
        if (this.isValidBusiness(this.current_business)) {
            return this.current_business;
        }

        const userobject = user.getUserData();
        if (userobject.id) return userobject;

        return false;
    }

    public static isValidBusiness(business) {
        return !!(!IsEmptyObject(business) && business.id);
    }

    // /**
    //  *
    //  * @param  {boolean} forceful?
    //  */
    // static async get(forceful?: boolean) {
    //     if (forceful || !this.businesses.length) {
    //         return this.fetchBusiness();
    //     }

    /**
     * avoids parallel call and resolves with single promise
     * @param  {} this._fetchBusiness
     */

    // protected static async fetchBusiness() {
    //     const response = await Get({ url: 'api/auth' });
    //     const { data } = response;

    @AutoBind
    private static async _updateAndBroadcastCurrentBusiness(
        business?: undefined | { lastActive: boolean } | BUSINESS_INTERFACE
    ) {
        // if business object is specified
        if (this.isValidBusiness(business)) {
            // update this.current_business with isSessionActive true
            // and store same object to storage
            this.current_business = business as BUSINESS_INTERFACE;
        } else if (!business) {
            // if already theres no business set, no need to further make current business null
            if (IsEmptyObject(this.current_business)) {
                return false;
            }

            // no business means, user mode is selected
            // in that case store last active business to storage with isSessionActive false
            // and update this.current_business to empty object
            this.current_business = {} as BUSINESS_INTERFACE;
        }

        // broadcase current active business
        StoreEvent({
            eventName: CURRENT_BUSINESS,
            data: this.current_business,
        });
        return true;
    }

    /**
     * update current selected business data to local storage,
     * to make available data on subsequent load and pre select business
     * @param  {boolean} isSessionActive - is currently selected business active
     */
    // private static _setCurrentBusinessToLocalStorage(lastBusiness) {
    // SetItem(LAST_BUSINESS_SESSION, lastBusiness, { isNonVolatile: true });
    // }

    /**
     * returns last selected business object from local storage
     */
    // private static async _getLastBusinessSession() {
    // const lastBusiness = await GetItemAsync(LAST_BUSINESS_SESSION, true);
    //     return lastBusiness;
    // }

    public static setBusinessAPIURLToLocalStorage(api_url: string) {
        SetItem(BUSINESS_API_URL, api_url, { isNonVolatile: true });
        this.api_url = api_url;
    }

    public static getBusinessAPIUrl(isMeta: boolean = false) {
        if (!this.api_url) this.api_url = GetItem(BUSINESS_API_URL, true);

        if (isMeta) {
            const meta_url = GetItem(META_BUSINESS_API_URL, true);
            return meta_url || API_CONSTANTS.ROUTE_URL;
        }

        return this.api_url || 'https://wapi.dartinbox.in/'; // TO-DO: remove it in future
    }

    /**
     * update businesses data for user
     * @param  {} businesses
     */
    // private static _updateBusinesses(businesses?: BUSINESS_INTERFACE[]) {
    //     if (Array.isArray(businesses)) {
    //         this.businesses = businesses;
    //         if (this.isValidBusiness(this.current_business)) {
    //             this.setCurrentBusiness(this.current_business.identifier);
    //         }
    //     } else {
    //         this.businesses = [];
    //     }
    //     StoreEvent({ eventName: BUSINESSES, data: this.businesses });
    // }
}

export { userBusiness as UserBusiness };
