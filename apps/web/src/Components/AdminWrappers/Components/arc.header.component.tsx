'use client';

import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';

import {
    authenticateBusiness,
    Navigation,
    PRODUCT_IDENTIFIER,
    storeProductPathState,
    TEAM_INBOX_SPLIT_LIST,
    useApp,
    useAppProducts,
    useCurrentBusiness,
    useOperatingSystem,
    useUserHook,
} from '@finnoto/core';
import {
    Avatar,
    Button,
    cn,
    DropdownMenu,
    DropdownMenuActionProps,
    Icon,
    IconButton,
    Popover,
    SidebarBanner,
} from '@finnoto/design-system';

import ProductSwitchSelector from '@Modules/AuthPage/Components/productSwitchSelector.component';

import { ArcHeaderPopover } from './header.user.component';

import {
    ApProductSvgIcon,
    AppsSvgIcon,
    ArcChatSvgIcon,
    ArcProductSvgIcon,
    ArProductSvgIcon,
    EmployeeProductSvgIcon,
} from 'assets';

export const ProductIcons = {
    [PRODUCT_IDENTIFIER.RECO]: ArProductSvgIcon,
    [PRODUCT_IDENTIFIER.VENDOR]: ApProductSvgIcon,
    [PRODUCT_IDENTIFIER.EMPLOYEE]: EmployeeProductSvgIcon,
    [PRODUCT_IDENTIFIER.FINOPS]: ApProductSvgIcon,
    [PRODUCT_IDENTIFIER.ARC]: ArcProductSvgIcon,
    [PRODUCT_IDENTIFIER.PAYMENT]: ArcProductSvgIcon,
};

const ArcHeader = () => {
    const { isProductAvailable, isArc } = useApp();
    const { products } = useAppProducts();
    const { pathname } = useRouter();

    const { type: osType } = useOperatingSystem();
    const checkAvailableProduct = isProductAvailable && products?.length > 1;

    return (
        <nav className='sticky top-0 justify-between py-4 pr-8 pl-0 navbar bg-polaris-bg-inverse text-polaris-text-inverse'>
            <SidebarBanner className='pl-4' />
            <div className='flex flex-1 justify-between'>
                <div className='flex flex-1 gap-3 items-center'>
                    <Button
                        className={cn({
                            hidden: pathname.includes(TEAM_INBOX_SPLIT_LIST),
                        })}
                        onClick={() => {
                            Navigation.navigate({ url: TEAM_INBOX_SPLIT_LIST });
                        }}
                        defaultMinWidth
                        appearance='info'
                    >
                        <Icon source={ArcChatSvgIcon} isSvg /> Go to Inbox
                    </Button>
                </div>
                {/* <div className='flex flex-1 justify-center'>
                    <InputField
                        className='rounded-lg bg-polaris-bg-surface-inverse hover:bg-polaris-bg-surface-hover text-polaris-text-inverse'
                        inputClassName='bg-polaris-bg-fill-inverse header-search text-polaris-text-inverse'
                        addonStart={
                            <Icon
                                iconColor='text-base-tertiary'
                                source={'search'}
                                size={24}
                            />
                        }
                        addonEnd={
                            <span className='text-xs whitespace-nowrap bg-transparent border-0 text-base-tertiary'>
                                {osType === 'mac' ? '⌘' : 'Ctrl'} + K
                            </span>
                        }
                        placeholder={'Search here...'}
                        readOnly
                        onClick={() => OpenSpotlight()}
                        size='sm'
                    />
                </div> */}

                <div className='gap-4 items-center row-flex'>
                    {/* <HeaderNotification /> */}
                    {checkAvailableProduct && !isArc ? (
                        <Popover
                            element={<ProductSwitchSelector />}
                            offsetX={40}
                            offsetY={10}
                            id='product-selector'
                        >
                            <IconButton
                                icon={AppsSvgIcon}
                                size='sm'
                                shape='square'
                                outline
                                appearance='ghost'
                                className='text-base-300 dark:text-base-content bg-[var(--p-color-bg-fill-inverse)] hover:bg-[var(--p-color-bg-fill-inverse-hover)] rounded-lg'
                                iconSize={20}
                            />
                        </Popover>
                    ) : (
                        checkAvailableProduct && <ArcProductSwitchSelector />
                    )}
                    <ArcHeaderPopover>
                        <ArcHeaderAvatar />
                    </ArcHeaderPopover>
                </div>
            </div>
        </nav>
    );
};

const ArcHeaderAvatar = React.forwardRef<HTMLDivElement, any>((props, ref) => {
    const { currentBusiness } = useCurrentBusiness();
    const { user } = useUserHook();

    return (
        <div
            className='items-center gap-4 py-0.5 rounded-lg cursor-pointer select-none row-flex bg-polaris-bg-fill-inverse text-polaris-text-inverse hover:bg-polaris-bg-fill-inverse-hover transition-all pl-3 pr-0.5'
            ref={ref}
            {...props}
        >
            <span>{currentBusiness?.name}</span>

            <Avatar
                source={user?.image_url}
                alt={user?.name}
                size='xs'
                shape='rounded'
                color='polaris'
            />
        </div>
    );
});

const ArcProductSwitchSelector = () => {
    const { product_id } = useApp();
    const { user } = useUserHook();
    const { products } = useAppProducts();

    const onClick = useCallback(
        (product) => {
            storeProductPathState(product_id, Navigation.currentRoute().path);
            authenticateBusiness(user.business || user.vendor, {
                product,
            });
        },
        [product_id, user]
    );

    const sanitizedProducts: DropdownMenuActionProps[] = useMemo(() => {
        return products.map((product) => {
            return {
                name: product.name,
                icon: ProductIcons[product.id],
                action: () => onClick(product),
                iconSize: 20,
                isSvg: true,
            };
        });
    }, [onClick, products]);

    return (
        <DropdownMenu
            actions={sanitizedProducts}
            searchable={false}
            align='end'
            className='min-w-[180px]'
        >
            <IconButton
                icon={AppsSvgIcon}
                size='sm'
                shape='square'
                outline
                appearance='ghost'
                className='text-base-300 dark:text-base-content bg-[var(--p-color-bg-fill-inverse)] hover:bg-[var(--p-color-bg-fill-inverse-hover)] rounded-lg'
                iconSize={20}
            />
        </DropdownMenu>
    );
};

export default ArcHeader;
