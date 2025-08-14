'use client';

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useLocation, useToggle } from 'react-use';

import { Modal, SlidingPane } from '@finnoto/design-system';
import { MentionUserContextProvider } from '@finnoto/design-system/src/Components/Inputs/MentionInput/mention.user.provider';

import { QueryClientProvider } from '@tanstack/react-query';

import {
    ARC_HOME_ROUTE,
    CLOSE_SPOTLIGHT,
    DASHBOARD_ROUTE,
    EMPLOYEE_EXPENSE_DASHBOARD_ROUTE,
    FINOPS_EXPENSE_DASHBOARD_ROUTE,
    PAYMENT_HOME_ROUTE,
    VENDOR_EXPENSE_DASHBOARD_ROUTE,
} from '../Constants';
import { useUserHook } from '../Hooks/user.hook';
import { queryClient } from '../Lib/react-query';
import { AppState } from '../Types';
import { ExpenseRouteUtils } from '../Utils/expenseRoute.utils';
import { GetItem, SetItem } from '../Utils/localStorage.utils';
import { StoreEvent } from '../Utils/stateManager.utils';
import { ThemeCustomizer } from '../Utils/ui.utils';
import { NotificationProvider } from './notification.provider';
import { ThemeContextProvider } from './theme.provider';

export const AppContext = createContext<AppState>({
    isExpense: false,
    isArc: false,
    isSidebarExpand: false,
    isProductAvailable: false,
    isFormUpdated: false,
    isPublicSignedIn: false,
    basePath: '/',
    expenseType: null,
    product_id: -1,
    menuDetails: null,
    showBottomNav: false,
    toggleBottomNav: () => {},
    setMenuDetails: () => {},
    toggleSidebarExpand: () => {},
    toggleFormUpdated: () => {},
    setIsPublicSignedIn: () => {},
});

export const AppProvider = ({ children }: any) => {
    const { pathname } = useLocation();
    const { user } = useUserHook();

    const [isSidebarExpand, setSidebarExpand] = useToggle(
        !!GetItem('IsSidebarExpand', true) || false
    );
    const [isFormUpdated, toggleFormUpdated] = useToggle(false);
    const [isPublicSignedIn, setIsPublicSignedIn] = useToggle(false);
    const [showBottomNav, toggleBottomNav] = useToggle(true);
    const [menuDetails, setMenuDetails] = useState(null);

    const isExpense = useMemo(
        () => ExpenseRouteUtils.CheckExpenseRoute(pathname),
        [pathname]
    );
    const isArc = useMemo(
        () =>
            ExpenseRouteUtils.CheckARCRoute(pathname) ||
            ExpenseRouteUtils.CheckARRoute(pathname) ||
            ExpenseRouteUtils.CheckPaymentRoute(pathname),
        [pathname]
    );

    const basePath = useMemo(() => {
        return '/';
        if (isExpense) {
            if (ExpenseRouteUtils.CheckVendorExpenseRoute(pathname)) {
                return VENDOR_EXPENSE_DASHBOARD_ROUTE;
            }
            if (ExpenseRouteUtils.CheckEmployeeExpenseRoute(pathname)) {
                return EMPLOYEE_EXPENSE_DASHBOARD_ROUTE;
            }
            if (ExpenseRouteUtils.CheckFinopsExpenseRoute(pathname)) {
                return FINOPS_EXPENSE_DASHBOARD_ROUTE;
            }
        }

        if (ExpenseRouteUtils.CheckARCRoute(pathname)) {
            return ARC_HOME_ROUTE;
        }
        if (ExpenseRouteUtils.CheckPaymentRoute(pathname)) {
            return PAYMENT_HOME_ROUTE;
        }

        return '/' + DASHBOARD_ROUTE;
    }, [pathname, isExpense]);

    const expenseType = useMemo(() => {
        return ExpenseRouteUtils.GetPortalType(pathname);
    }, [pathname]);

    const isProductAvailable = useMemo(() => {
        return !!user?.meta_business_id;
    }, [user]);

    const product_id = useMemo(() => {
        return user?.auth_attributes?.product_id;
    }, [user]);

    const toggleSidebarExpand = useCallback(() => {
        SetItem('IsSidebarExpand', !isSidebarExpand, { isNonVolatile: true });
        setSidebarExpand(!isSidebarExpand);
    }, [isSidebarExpand, setSidebarExpand]);

    useEffect(() => {
        if (typeof window === 'undefined') return null;
        const handleBrowserBackNextButton = (event) => {
            if (event.state) {
                CloseSpotlight();
                // Handle the back or forward button press button press here
                Modal.closeAll();
                SlidingPane.closeAll();
            }
        };

        window.addEventListener('popstate', handleBrowserBackNextButton);
        return () => {
            // Cleanup the event listener when the component is unmounted
            window.removeEventListener('popstate', handleBrowserBackNextButton);
        };
    }, []);

    useEffect(() => {
        const body = document.querySelector('body');
        if (isArc) {
            body.classList.add('arc-portal');
        } else {
            body.classList.remove('arc-portal');
        }
    }, [isArc]);

    const value = useMemo(() => {
        return {
            basePath,
            isExpense,
            isArc,
            expenseType,
            isProductAvailable,
            isSidebarExpand,
            isFormUpdated,
            product_id,
            menuDetails,
            showBottomNav,
            setMenuDetails,
            toggleBottomNav,
            toggleSidebarExpand,
            toggleFormUpdated,
            isPublicSignedIn,
            setIsPublicSignedIn,
        };
    }, [
        basePath,
        isExpense,
        isArc,
        expenseType,
        isProductAvailable,
        isSidebarExpand,
        isFormUpdated,
        product_id,
        menuDetails,
        showBottomNav,
        toggleBottomNav,
        setMenuDetails,
        toggleSidebarExpand,
        toggleFormUpdated,
        isPublicSignedIn,
        setIsPublicSignedIn,
    ]);

    return (
        <AppContext.Provider value={value}>
            <NotificationProvider>
                <ThemeContextProvider>
                    <QueryClientProvider client={queryClient}>
                        <MentionUserContextProvider>
                            {children}
                            {/* {!IsProduction() && (
                            <ReactQueryDevtools
                                position='bottom-right'
                                toggleButtonProps={{
                                    style: { bottom: '20px' },
                                }}
                                initialIsOpen={false}
                            />
                        )} */}
                            {/* Theme customizer available for only user id 1. i.e. Hemant Kumar Sah */}
                            {user?.id === 1 && <ThemeCustomizer />}
                        </MentionUserContextProvider>
                    </QueryClientProvider>
                </ThemeContextProvider>
            </NotificationProvider>
        </AppContext.Provider>
    );
};
export const CloseSpotlight = () => {
    StoreEvent({ eventName: CLOSE_SPOTLIGHT, isTemp: true });
};
