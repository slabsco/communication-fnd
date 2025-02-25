import { PublicController } from '../backend/common/controllers/public.controller';
import { ObjectDto } from '../backend/Dtos';
import {
    CHANGE_PASSWORD_ROUTE,
    CLIENT_INVITATION_DATA,
    LAST_LOGIN_INFORMATION,
    LOGIN_ROUTE,
    PRODUCT_IDENTIFIER,
    PRODUCT_PATH_STATE,
    REFERRER_STORE,
    VENDOR_CLIENT_ROUTE,
    VENDOR_REGISTER_ROUTE,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '../Constants';
import { FetchData } from '../Hooks/useFetchData.hook';
import { UserBusiness } from '../Models/Business/user.business';
import { StoreUserToken, user } from '../Models/User';
import { AuthUser } from '../Models/User/auth.user';
import { ProductPayload } from '../Types';
import {
    groupBy,
    IsEmptyArray,
    IsObjectHaveKeys,
    IsValidString,
    SortArrayObjectBy,
    toastBackendError,
} from './common.utils';
import { ExpenseRouteUtils } from './expenseRoute.utils';
import { GetItem, SetItem } from './localStorage.utils';
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

    UserBusiness.setBusinessAPIURLToLocalStorage(userObj?.api_url);
    window.location.replace(WHATSAPP_TEMPLATE_LIST_ROUTE);

    return businesses?.[0];
};

export const handleLoginNextScreen = async (data: ObjectDto) => {
    const { user: userObj, businesses = [], invitations } = data;

    if (!businesses.length) {
        return Functions.openOnboarding((data) => {
            initializeUser(data);
        }, data);
    }

    return initializeUser(data);

    // if (IsEmptyArray(businesses)) {
    //     if (!userObj.email_verified_at) {
    //         return Navigation.navigate({
    //             url: VERIFY_EMAIL_ROUTE,
    //             queryParam: { email: userObj.email },
    //             method: 'replace',
    //         });
    //     }
    // }

    // if (!IsEmptyArray(invitations)) {
    //     Functions.openBusinessInvitation(invitations, authenticateBusiness);
    //     return;
    // }

    // if (IsEmptyArray(businesses)) {
    //     const isOnboardingEnabled = await GetOpenPropertyValue(
    //         'self-business-onboarding',
    //         { convertBoolean: true }
    //     );

    //     if (isOnboardingEnabled)
    //         return Functions.openOnboarding(authenticateBusiness);

    //     Navigation.navigate({
    //         url: LOGIN_ROUTE,
    //         queryParam: { no_business: true },
    //         method: 'replace',
    //     });

    //     return;
    // }

    // const groupedBusiness = groupBusiness(businesses);
    // if (groupedBusiness.length === 1)
    // return authenticateBusiness(businesses[0]);

    // Functions.openBusinessSelector(businesses, authenticateBusiness);
};

export const authenticateBusiness = async (
    business: ObjectDto,
    options?: {
        handleStopLoading?: any;
        product?: ProductPayload;
        referrer?: string;
        noNavigate?: boolean;
    }
) => {
    const { handleStopLoading, product, noNavigate } = options || {};
    let { referrer }: any =
        Navigation.getUrlParams()?.queryString || ({} as ObjectDto);

    let selectedProduct = product || { id: business.product_id };

    const user_email = GetItem('user_email');

    const lastLoginInformation = GetItem(
        LAST_LOGIN_INFORMATION + user_email + business?.id,
        true
    );

    if (!product?.id && !IsEmptyArray(business.products)) {
        if (business.products.length > 1) {
            if (lastLoginInformation) {
                const { product_id, business_id } = lastLoginInformation;
                if (
                    business_id === business?.id &&
                    business?.products?.some((p) => p.id === product_id)
                ) {
                    return authenticateBusiness(business, {
                        product: { id: product_id },
                        noNavigate,
                    });
                }
            }

            handleStopLoading?.();
            setTimeout(() => {
                Functions.openProductSelector(
                    SortArrayObjectBy(business.products || [], 'id'),
                    (product: ProductPayload) =>
                        authenticateBusiness(business, {
                            product,
                            noNavigate,
                        })
                );
            }, 50);
            return false;
        }

        selectedProduct = business.products[0];
    }

    StoreEvent({
        eventName: 'login_loading',
        data: true,
        isTemp: true,
        isMemoryStore: false,
    });

    const { hide: hideLoading = () => {} } = Functions.toastLoading({
        description: 'Please wait. Processing Business authorization...',
    });

    // const { success, response } = await FetchData({
    //     className: AuthUser,
    //     method: 'authBusinessToken',
    //     methodParams: business.meta_server_id || business.id,
    //     classParams: { product_id: selectedProduct?.id },
    // });

    let result: ObjectDto | false = false;
    result = business;

    // if (success) {
    //     const { token, api_url } = response;

    //     //for ownership transfer
    //     const ownerShipReferralLocalStore = GetItem(OWNER_TRANSFER_REFERER);

    //     let ownership_referrer = '';
    //     if ([OWNER_TRANSFER].includes(ownerShipReferralLocalStore?.url)) {
    //         const searchParams = new URLSearchParams(
    //             ownerShipReferralLocalStore?.params || {}
    //         );
    //         ownership_referrer = `${
    //             ownerShipReferralLocalStore?.url
    //         }?${searchParams.toString()}`;
    //     }

    //     let frontendPath = '';

    //     const pathState = getProductPathState(selectedProduct?.id);

    //     if (pathState) {
    //         frontendPath = pathState;
    //     } else {
    //         frontendPath = ExpenseRouteUtils.GetFrontendPath(
    //             selectedProduct?.id
    //         );
    //     }

    //     if (referrer) {
    //         referrer = handleProductPathMismatch(referrer, frontendPath);
    //     }

    //     const validateResult = await validateBusinessToken({
    //         token,
    //         backend: api_url,
    //         referrer: (options?.referrer ||
    //             ownership_referrer ||
    //             referrer) as string,
    //         frontend: frontendPath,
    //         noNavigate,
    //     });

    //     if (validateResult) {
    //         result = business;
    //     }
    // } else {
    //     const { message } = response;
    //     Toast.error({ description: message });
    //     StoreEvent({
    //         eventName: 'login_loading',
    //         data: false,
    //         isTemp: true,
    //         isMemoryStore: false,
    //     });
    //     if (!noNavigate) {
    //         Navigation.navigate({
    //             url: LOGIN_ROUTE,
    //             queryParam: { referrer: options?.referrer || referrer },
    //             method: 'replace',
    //         });
    //     }
    // }

    handleStopLoading?.();
    hideLoading();

    return result;
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
