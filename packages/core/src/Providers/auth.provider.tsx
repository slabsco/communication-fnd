import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import { IsEmptyArray } from '@finnoto/design-system';

import { ObjectDto } from '../backend/Dtos';
import { MenuController } from '../backend/meta/controllers/menu.controller';
import { MetaBusinessController } from '../backend/meta/controllers/meta.business.controller';
import { PublicRoutes, USER } from '../Constants';
import { useMutation, useOpenProperties } from '../Hooks';
import { useApp } from '../Hooks/useApp.hook';
import { FetchData } from '../Hooks/useFetchData.hook';
import { useInterval } from '../Hooks/useInterval.hook';
import { useMenu } from '../Hooks/useMenu.hook';
import { useUserHook } from '../Hooks/user.hook';
import { user, USER_DATA } from '../Models';
import { Authentication } from '../Utils/authentication';
import { IsObjectHaveKeys } from '../Utils/common.utils';
import { ExpenseRouteUtils } from '../Utils/expenseRoute.utils';
import { authenticateBusiness } from '../Utils/login.utils';
import { Navigation } from '../Utils/navigation.utils';
import {
    SubscribeToEvent,
    UnsubscribeEvent,
} from '../Utils/stateManager.utils';
import {
    AdminWrapper,
    ArcAdminWrapper,
    ExpenseWrappers,
    PageLoader,
} from '../Utils/ui.utils';

export const AuthProvider = ({ children }: any) => {
    const { isReady, pathname, asPath } = useRouter();

    const [loading, setLoading] = useState(true);

    const { user: userObj } = useUserHook();
    const {
        isArc,
        isExpense,
        expenseType,
        menuDetails,
        basePath,
        setMenuDetails,
    } = useApp();
    const { isLoading: isMenuLoading, original: modules } = useMenu();
    const [validateProductInterval = 60 * 1000] = useOpenProperties<number>(
        'validate.product.interval'
    );

    const validateProduct = useCallback(
        ({
            business_id,
            product_id,
        }: {
            business_id: number;
            product_id: number;
        }) => {
            if (!business_id || !product_id) return;
            FetchData({
                className: MetaBusinessController,
                method: 'validateProduct',
                methodParams: {
                    businessId: business_id,
                    productId: product_id,
                },
            }).then(async ({ success }) => {
                if (success) return;
                let referrer = Navigation.currentRoute()?.path;

                if (isPublicRoute(referrer)) referrer = undefined;

                stopProductValidation();
                await Authentication.logout();
                Navigation.navigate({
                    url: PublicRoutes.LOGIN_ROUTE,
                    queryParam: { referrer },
                });
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [asPath]
    );

    const { start: startProductValidation, stop: stopProductValidation } =
        useInterval(validateProduct, validateProductInterval);

    const removeProductValidation = (userObj: USER_DATA) => {
        if (!userObj.id && userObj.loginCheckDone) {
            stopProductValidation();
        }
    };

    const isPublicRoute = useCallback(
        (pathname) =>
            Object.values(PublicRoutes).some((route) =>
                pathname.startsWith(route)
            ),
        []
    );

    // const alertMenuNotAllowed = () => {
    //     AlertUtil({
    //         title: 'Error',
    //         message: 'This page is not allowed or disabled! Redirecting to home page.',
    //         onOkPress: () => Navigation.navigate({ url: ResolveNavigationRoute('/') }),
    //     });
    // };

    const getMenuId = useCallback(() => {
        let path: any = {};

        modules.forEach((module: ObjectDto) => {
            if (path?.id) return;
            path = module.menus?.find(
                (subMenu: ObjectDto) =>
                    subMenu.path === pathname && subMenu.active !== false
            );
        });

        if (path?.id) return path?.id;

        // alertMenuNotAllowed();
        return null;
    }, [modules, pathname]);

    const { mutateAsync: loadMenuDetails, isLoading: isLoadingMenuDetail } =
        useMutation({
            cacheTime: Infinity,
            mutationFn: async (menuId: number) => {
                const { success, response } = await FetchData({
                    className: MenuController,
                    method: 'show',
                    methodParams: menuId,
                });

                if (success) {
                    setMenuDetails(response);
                } else {
                    setMenuDetails(null);
                }
            },
        });

    const checkIsSameMenu = useCallback(
        (menu_id: number) => {
            const menuId = getMenuId();
            if (menuId === menu_id) return true;
            return false;
        },
        [getMenuId]
    );

    const checkProductMismatch = useCallback(
        async (business: USER_DATA['business'], product_id: number) => {
            const { success, response } = await FetchData({
                className: MetaBusinessController,
                method: 'getProducts',
                methodParams: business.meta_server_id,
            });

            if (!success) return false;
            if (IsEmptyArray(response)) return false;

            if (response.some((product: any) => product.id === product_id)) {
                await authenticateBusiness(business, {
                    product: { id: product_id },
                    referrer: asPath,
                });
                return true;
            }

            return false;
        },
        [asPath]
    );

    useEffect(() => {
        if (!isReady) return;

        const userObj = user.getUserData();

        if (!PublicRoutes.IGNORE_AUTH_ROUTES.includes(pathname)) {
            setLoading(true);
            if (userObj?.loginCheckDone) {
                return setLoading(false);
            }

            Authentication.loginCheck(true).then(async (data) => {
                if (
                    !isPublicRoute(pathname) &&
                    (!data || !data?.id || !(data.business || data.vendor))
                ) {
                    Navigation.navigate({
                        url: PublicRoutes.LOGIN_ROUTE,
                        queryParam: { referrer: asPath },
                    });
                }

                if (!isPublicRoute(pathname) && data) {
                    if (pathname === '/')
                        ExpenseRouteUtils.fixPortalPath(1, pathname);
                }

                setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPublicRoute, pathname, asPath, isReady]);

    useEffect(() => {
        if (!(isPublicRoute(pathname) || isMenuLoading || loading)) {
            const menu_id = getMenuId();

            if (menu_id) {
                loadMenuDetails(menu_id);
            } else {
                setMenuDetails(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, isMenuLoading, modules, isPublicRoute, getMenuId, loading]);

    useEffect(() => {
        SubscribeToEvent({
            eventName: USER,
            callback: removeProductValidation,
        });
        return () => {
            UnsubscribeEvent({
                eventName: USER,
                callback: removeProductValidation,
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isPublicRoute(pathname)) {
        if (!userObj.loginCheckDone || !userObj.id || loading) {
            return <PageLoader />;
        }

        const dashboardChildren =
            !!menuDetails && children ? (
                React.cloneElement(children as any, {
                    menu: checkIsSameMenu(menuDetails.id) ? menuDetails : null,
                })
            ) : (
                <div className='flex flex-col justify-center items-center bg-gray-50 h-content-screen'>
                    <div
                        className='p-8 max-w-md text-center bg-white rounded-lg shadow-lg opacity-0 transition-opacity duration-500'
                        style={{
                            animation: 'fadeIn 0.5s forwards',
                            animationDelay: '10s',
                        }}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='mx-auto w-16 h-16 text-red-500'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                        </svg>
                        <h2 className='mt-6 text-2xl font-bold text-gray-800'>
                            Something Went Wrong
                        </h2>
                        <p className='mt-2 text-gray-600'>
                            You don&apos;t have permission to access this page
                            or your internet is unstable
                        </p>
                        <p className='mt-2 text-gray-600'>
                            Please contact your administrator if you believe
                            this is an error.
                        </p>
                        <button
                            onClick={() =>
                                Navigation.navigate({ url: basePath || '/' })
                            }
                            className='px-6 py-2 mt-6 text-white rounded-md transition-colors bg-primary hover:bg-primary-dark'
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            );

        if (isExpense && IsObjectHaveKeys(ExpenseWrappers) && expenseType) {
            const ExpenseWrapper = ExpenseWrappers[expenseType];

            if (ExpenseWrapper) {
                return <ExpenseWrapper>{dashboardChildren}</ExpenseWrapper>;
            }
        }

        if (isArc && ArcAdminWrapper) {
            return <ArcAdminWrapper>{dashboardChildren}</ArcAdminWrapper>;
        }

        return <AdminWrapper>{dashboardChildren}</AdminWrapper>;
    }

    return children;
};
