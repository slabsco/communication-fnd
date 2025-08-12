import { PublicController } from '../backend/common/controllers/public.controller';
import { ObjectDto } from '../backend/Dtos';
import {
    ACCESS_TOKEN,
    CHANGE_PASSWORD_ROUTE,
    CLIENT_INVITATION_DATA,
    HOME_ROUTE,
    LOGIN_ROUTE,
    PRODUCT_IDENTIFIER,
    PRODUCT_PATH_STATE,
    REFERRER_STORE,
    TEAM_INBOX_SPLIT_LIST,
    VENDOR_CLIENT_ROUTE,
    VENDOR_REGISTER_ROUTE,
} from '../Constants';
import { FetchData } from '../Hooks/useFetchData.hook';
import { UserBusiness } from '../Models/Business/user.business';
import { StoreUserToken, user } from '../Models/User';
import { AuthUser } from '../Models/User/auth.user';
import {
    groupBy,
    IsEmptyArray,
    IsObjectHaveKeys,
    IsValidString,
    toastBackendError,
} from './common.utils';
import { ExpenseRouteUtils } from './expenseRoute.utils';
import { GetItem, SetItem } from './localStorage.utils';
import { Menu } from './menu.utils';
import { Navigation, SerializeObj } from './navigation.utils';
import { GetSessionItem } from './sessionStorage.utils';
import { StoreEvent } from './stateManager.utils';
import { Functions } from './ui.utils';

const initializeUser = (data: any) => {
    const { user: userObj, businesses = [], invitations } = data;

    StoreUserToken(userObj, true);
    SetItem('user_email', userObj.email);

    if (userObj?.attributes?.reset_password) {
        Navigation.navigate({
            url: CHANGE_PASSWORD_ROUTE,
            method: 'replace',
        });
        return;
    }

    const referrer = GetSessionItem(REFERRER_STORE);
    if (referrer?.url === VENDOR_REGISTER_ROUTE) {
        Navigation.navigate({
            url: referrer.url,
            queryParam: referrer.params,
            method: 'replace',
        });
        return;
    }

    StoreUserToken({ access_token: userObj?.access_token });

    storeProductPathState(1, '');

    const isAvailable = Menu.isMenuAvailable(HOME_ROUTE);

    if (isAvailable) {
        window.location.replace(HOME_ROUTE);
    } else {
        window.location.replace(TEAM_INBOX_SPLIT_LIST);
    }

    return businesses?.[0];
};

export const handleLoginNextScreen = async (data: ObjectDto) => {
    const { user: userObj, businesses = [], invitations } = data;

    UserBusiness.setBusinessAPIURLToLocalStorage(userObj?.api_url);
    StoreUserToken({ access_token: userObj?.access_token }, true);

    if (!IsEmptyArray(invitations)) {
        Functions.openBusinessInvitation(invitations, (bu) =>
            authenticateBusiness(bu, data)
        );
        return;
    }

    if (!businesses.length) {
        return Functions.openOnboarding((data) => {
            initializeUser(data);
        }, data);
    }

    const groupedBusiness = groupBusiness(businesses);
    if (groupedBusiness.length === 1)
        return authenticateBusiness(businesses[0], data);

    Functions.openBusinessSelector(businesses, (bu) =>
        authenticateBusiness(bu, data)
    );
};

export const authenticateBusiness = async (
    business: ObjectDto,
    userData?: any
) => {
    const businessApiUrl = UserBusiness.getBusinessAPIUrl();
    const { user } = userData;

    const accessToken = user?.access_token || GetItem(ACCESS_TOKEN, false);

    const response = await fetch(`${businessApiUrl}auth/validate-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: business.business_id }),
    });

    const data = await response.json();
    const success = response.ok;

    if (success) return initializeUser(data);
    return response;
};

export const validateBusinessToken = async ({
    token,
    backend,
    frontend,
    referrer,
    noNavigate,
}: {
    token: string;
    backend: string;
    frontend: string;
    referrer?: string;
    noNavigate?: boolean;
}) => {
    if (!token || !backend) {
        user.clearUserData();
        return false;
    }

    const { success, response } = await FetchData({
        className: AuthUser,
        method: 'validateToken',
        classParams: { token, baseURL: backend },
    });

    if (!success) {
        Navigation.navigate({
            url: LOGIN_ROUTE,
            queryParam: { referrer },
            method: 'replace',
        });
        toastBackendError(response, 'Oops! Something went wrong.');
        StoreEvent({
            eventName: 'login_loading',
            data: false,
            isTemp: true,
            isMemoryStore: false,
        });
        return false;
    }

    user.updateUserData(response);

    StoreUserToken(response);
    UserBusiness.setBusinessAPIURLToLocalStorage(backend);

    if (noNavigate) return true;

    window.location.replace(IsValidString(referrer) ? referrer : frontend);
    return true;
};

export const validatePublicToken = async ({
    token,
    scope,
    source,
    referrer,
    noNavigate,
}: {
    token: string;
    scope: string[];
    source: string;
    referrer?: string;
    noNavigate?: boolean;
}) => {
    if (!token) {
        user.clearUserData();
        return Promise.reject('No token found.');
    }

    const { success, response } = await FetchData({
        className: PublicController,
        method: 'validateToken',
        classParams: {
            token,
            scope,
            source,
            baseURL: 'https://eapi.finnoto.dev/',
        },
    });

    if (!success) {
        if (IsValidString(referrer)) {
            Navigation.navigate({
                url: LOGIN_ROUTE,
                queryParam: { referrer },
                method: 'replace',
            });
        }
        toastBackendError(response, 'Oops! Something went wrong.');
        StoreEvent({
            eventName: 'login_loading',
            data: false,
            isTemp: true,
            isMemoryStore: false,
        });
        return Promise.reject(response.message ?? 'Unable to authenticate.');
    }

    user.updateUserData(response);

    StoreUserToken(response);
    UserBusiness.setBusinessAPIURLToLocalStorage(
        response.backend_url ?? 'https://eapi.finnoto.dev'
    );

    if (noNavigate) return true;

    if (IsValidString(referrer)) {
        window.location.replace(referrer);
    }

    return true;
};

export const storeProductPathState = (
    type: PRODUCT_IDENTIFIER | -1,
    path: string
) => {
    if (type === -1) return;
    const prevState = GetItem(PRODUCT_PATH_STATE);
    SetItem(PRODUCT_PATH_STATE, { ...prevState, [type]: path });
};

export const getProductPathState = (type: PRODUCT_IDENTIFIER) => {
    const currState = GetItem(PRODUCT_PATH_STATE) || {};
    return currState[type] || null;
};

export const groupBusiness = (businesses: ObjectDto[]): ObjectDto[] => {
    const grouped = groupBy(businesses, 'id');
    if (!IsObjectHaveKeys(grouped)) return [];

    const result = {};

    Object.keys(grouped).forEach((business_id) => {
        result[business_id] = grouped[business_id][0];
        result[business_id].products = grouped[business_id]
            .map((business) => {
                if (!business.product_id) return null;
                return {
                    id: business.product_id,
                    name: business.product_name,
                };
            })
            .filter(Boolean);
    });

    return Object.values(result);
};

export const navigateToClientOnboarding = (
    data: {
        client_id: number;
        client_name?: string;
    },
    shallowNavigation: boolean = true
) => {
    SetItem(CLIENT_INVITATION_DATA, data, { span: 6 * 60 }); // Timeout for notification

    const params = {
        add_form: 'true',
        form_params: JSON.stringify(data),
    };

    if (shallowNavigation) {
        Navigation.navigate({
            url: VENDOR_CLIENT_ROUTE,
            queryParam: params,
            method: 'replace',
        });
        return;
    }
    window.location.replace(`${VENDOR_CLIENT_ROUTE}${SerializeObj(params)}`);
};

export const handleProductPathMismatch = (
    path: string,
    frontendPath: string
) => {
    if (path.startsWith(frontendPath)) return path;

    const cleanPath = ExpenseRouteUtils.GetPathWithoutPortalRoute(path);
    return frontendPath + cleanPath;
};
