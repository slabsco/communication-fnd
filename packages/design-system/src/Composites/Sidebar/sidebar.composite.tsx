'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import {
    ARC_HOME_ROUTE,
    BUSINESS_PROFILE_ROUTE,
    DASHBOARD_ROUTE,
    Ellipsis,
    EMPLOYEE_EXPENSE_DASHBOARD_ROUTE,
    FINOPS_EXPENSE_DASHBOARD_ROUTE,
    HOME_ROUTE,
    Navigation,
    PAYMENT_HOME_ROUTE,
    useApp,
    USER_PROFILE_ROUTE,
    useUserHook,
    VENDOR_EXPENSE_DASHBOARD_ROUTE,
} from '@finnoto/core';

import { Button } from '../../Components';
import { Avatar } from '../../Components/Data-display/Avatar/avatar.component';
import { HoverCard } from '../../Components/Data-display/Hover-Card/hoverCard.component';
import { Icon } from '../../Components/Data-display/Icon/icon.component';
import { Typography } from '../../Components/Data-display/Typography/typography.component';
import * as FunctionsUtil from '../../Utils';
import { cn, IsEmptyArray } from '../../Utils/common.ui.utils';
import { ThemeModeSwitch } from './Components/themeSwitchMode.component';

import * as Icons from 'assets';

const ARC_LOGO_HEIGHT = 24;

/**
 *
 * @description Sidebar For Finnoto Portal
 *
 * @author Saurav Nepal
 *
 * @returns {React Node}
 */
export const Sidebar = ({
    menus = [],
    bottomMenus = [],
    hideBanner = false,
    showArcHamburger = false,
}: {
    menus: any[];
    bottomMenus?: any[];
    hideBanner?: boolean;
    showArcHamburger?: boolean;
}) => {
    const { isSidebarExpand, toggleSidebarExpand, isArc } = useApp();

    return (
        <div
            className={cn('sidebar-block', {
                expanded: isSidebarExpand,
            })}
        >
            {!hideBanner && (
                <div className='sidebar-banner'>
                    <SidebarBanner className='absolute top-4 left-[19px]' />
                </div>
            )}
            <div className='sidebar-items'>
                <RenderMenus menus={menus} showIcon resolveUrl />
                <div className='mt-auto'></div>
                <RenderMenus menus={bottomMenus} showIcon resolveUrl />
                {!isArc && <ThemeModeSwitch />}

                <Profilecomponent {...{ isSidebarExpand }} />
                {isArc && !isSidebarExpand && (
                    <Button
                        appearance='polaris-transparent'
                        className='mt-3 w-full text-polaris-text-inverse hover:text-polaris-text-inverse hover:bg-polaris-bg-surface-inverse'
                        onClick={toggleSidebarExpand}
                    >
                        <Icon
                            source={Icons.CircleChevronLeftSvgIcon}
                            size={20}
                            className={cn('rotate-180', {
                                'rotate-0': isSidebarExpand,
                            })}
                            isSvg
                        />
                    </Button>
                )}
            </div>
        </div>
    );
};

export const SidebarBanner = (props: { className?: string }) => {
    const { isExpense, basePath, isArc } = useApp();

    return (
        <Link
            href={HOME_ROUTE}
            className='flex items-center text-xl normal-case'
        >
            <div className={cn('', props.className)}>
                <Image
                    src={'/logo.png'}
                    alt='Brand Logo'
                    height={isArc ? ARC_LOGO_HEIGHT : 32}
                    width={70}
                    style={{
                        maxHeight: isArc ? ARC_LOGO_HEIGHT : 32,
                        // maxWidth: 279,
                        objectFit: 'contain',
                        objectPosition: 'left',
                    }}
                    unoptimized
                    priority
                />
            </div>
        </Link>
    );
};

const RenderMenus = ({
    menus,
    showIcon = true,
    resolveUrl,
    menuClassName = '',
    isInsideSubmenu = false,
}: {
    menus: any[];
    showIcon: boolean;
    resolveUrl?: boolean;
    menuClassName?: string;
    isInsideSubmenu?: boolean;
}) => {
    const [expandSubmenuIndex, setExpandSubmenuIndex] = useState(-1);
    const pathname = usePathname();

    // Function to check if a route is active
    const isActiveRoute = useCallback(
        (route: string) => {
            if (route === pathname) return true;

            return pathname.startsWith(route) && route !== '/';
        },
        [pathname]
    );

    // Function to check if a submenu is active
    const isSubmenuActive = useCallback(
        (menu: any) => {
            return (menu.menus as any[]).some(
                (submenu: any) =>
                    submenu.attributes?.action !== true &&
                    isActiveRoute(
                        submenu.root_path ? submenu.root_path : submenu.path
                    )
            );
        },
        [isActiveRoute]
    );

    // Function to check if a menu has a submenu
    const hasSubmenu = useCallback((menu: any) => {
        if (menu?.attributes?.hide_submenu) return false;
        return menu.menus?.some((menu: any) => menu.visibility !== false);
    }, []);

    // Function to get the add action path
    const getAddActionPath = useCallback(
        (menu: any) => {
            if (menu.attributes?.action === true) return undefined;
            if (resolveUrl && menu.ui_action?.url) return menu.ui_action?.url;
            return menu.ui_action?.url;
        },
        [resolveUrl]
    );

    // Function to get the add action name
    const getAddActionName = useCallback((menu: any) => {
        if (menu.attributes?.action === true || menu.ui_action?.url)
            return undefined;

        return menu.ui_action?.name;
    }, []);

    return (
        <>
            {menus.map((menu, index) => {
                if (menu.visibility === false) return null;
                if (menu.image === 'spacer') {
                    return <div key={index} className='pt-3'></div>;
                }
                if (!hasSubmenu(menu)) {
                    return (
                        <RenderMenuItem
                            key={index}
                            name={menu.display_name}
                            defaultName={menu.display_name}
                            path={menu.path}
                            action={
                                menu.ui_action && !menu.ui_action.url
                                    ? menu.ui_action.name
                                    : null
                            }
                            icon={showIcon ? menu.image : null}
                            rootPath={
                                menu.root_path ? menu.root_path : menu.path
                            }
                            isSvg={true}
                            addPath={getAddActionPath(menu)}
                            addAction={getAddActionName(menu)}
                            addActionProps={menu.addActionProps}
                            spaceAbove={menu.spacer_above}
                            className={menuClassName}
                            isInsideSubmenu={isInsideSubmenu}
                            dropdownMenus={menu.dropdownMenus}
                        />
                    );
                }
                if (hasSubmenu(menu)) {
                    return (
                        <RenderSubMenu
                            key={index}
                            name={menu.display_name}
                            defaultName={menu.display_name}
                            icon={menu.image}
                            isActive={isSubmenuActive(menu)}
                            isSvg={true}
                            spaceAbove={menu.spacer_above}
                            expand={expandSubmenuIndex === index}
                            menus={menu.menus}
                            setExpand={() =>
                                index === expandSubmenuIndex
                                    ? setExpandSubmenuIndex(-1)
                                    : setExpandSubmenuIndex(index)
                            }
                        >
                            <RenderMenus
                                menus={menu.menus}
                                showIcon={false}
                                menuClassName='text-sm'
                                resolveUrl
                                isInsideSubmenu
                            />
                        </RenderSubMenu>
                    );
                }

                return null;
            })}
        </>
    );
};

const RenderMenuItem = ({
    name,
    defaultName,
    icon,
    path,
    rootPath,
    isSvg,
    addPath,
    action,
    spaceAbove,
    isInsideSubmenu,
    className = '',
    dropdownMenus = [],
}: {
    name: string;
    defaultName?: string;
    icon: string | any;
    path: string;
    rootPath: string;
    isSvg?: boolean;
    addPath?: string;
    addAction?: any;
    addActionProps?: object;
    action?: any;
    spaceAbove?: boolean;
    isInsideSubmenu?: boolean;
    className?: string;
    dropdownMenus?: any[];
}) => {
    const pathname = usePathname();
    const { isSidebarExpand } = useApp();
    const [isHover, setIsHover] = useState(false);

    // Function to check if a route is active
    const isActiveRoute = useCallback(
        (route: string) => {
            if (route === pathname) return true;

            if (
                pathname.includes('expense-approval') ||
                pathname.includes('expense-head')
            ) {
                return route === pathname; // remove issue-->  expense and expense-approval show active same time when navigation in expense-approval
            }

            if (pathname.includes('advance-approval-limits'))
                return route === pathname; // remove issue-->  expense and expense-approval show active same time when navigation in expense-approval

            return (
                pathname.startsWith(route) &&
                route !== '/' + DASHBOARD_ROUTE &&
                route !== VENDOR_EXPENSE_DASHBOARD_ROUTE &&
                route !== EMPLOYEE_EXPENSE_DASHBOARD_ROUTE &&
                route !== FINOPS_EXPENSE_DASHBOARD_ROUTE &&
                route !== ARC_HOME_ROUTE &&
                route !== PAYMENT_HOME_ROUTE
            );
        },
        [pathname]
    );

    const getMenu = useCallback(
        (path?: string) => {
            const handleNavigation = (path, e) => {
                Navigation.navigate({ url: path }, e);
            };

            return (
                <HoverCard
                    openDelay={100}
                    closeDelay={100}
                    position='right'
                    align='start'
                    offSet={18}
                    contentClassName='zoom-in-95'
                    content={
                        <>
                            {!IsEmptyArray(dropdownMenus) && (
                                <div className='sidebar-dropdown sidebar-dropdown-always dropdown-content'>
                                    <div className='sidebar-drop-content'>
                                        <Typography
                                            noStyle
                                            size='normal'
                                            className='sidebar-drop-title'
                                        >
                                            {name}
                                        </Typography>
                                        <div className='overflow-hidden relative transition-all'>
                                            <RenderMenus
                                                menus={dropdownMenus}
                                                showIcon={false}
                                                menuClassName='text-sm'
                                                resolveUrl
                                                isInsideSubmenu
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!isInsideSubmenu &&
                                !isSidebarExpand &&
                                IsEmptyArray(dropdownMenus) && (
                                    <div className='sidebar-dropdown dropdown-content'>
                                        <div
                                            className={cn(
                                                'sidebar-drop-content',
                                                {
                                                    'sidebar-content-active':
                                                        isActiveRoute(path),
                                                }
                                            )}
                                        >
                                            <Typography
                                                onClick={(e) => {
                                                    if (!path) return;
                                                    Navigation.navigate(
                                                        {
                                                            url: path,
                                                        },
                                                        e
                                                    );
                                                }}
                                                noStyle
                                                className={cn(
                                                    'rounded transition-all cursor-pointer sidebar-drop-text hover:bg-base-200',
                                                    {
                                                        'sidebar-drop-text-active':
                                                            isActiveRoute(path),
                                                    }
                                                )}
                                            >
                                                {defaultName || name}
                                            </Typography>
                                        </div>
                                    </div>
                                )}
                        </>
                    }
                >
                    <button
                        onClickCapture={(e) => {
                            if (path) handleNavigation(path, e);
                        }}
                        className={cn(
                            'sidebar-item',
                            {
                                active: !action && isActiveRoute(path),
                                'mt-3': spaceAbove,
                            },
                            className
                        )}
                        onMouseOver={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        {icon && (
                            <MenuIcon
                                icon={icon}
                                isActive={isActiveRoute(path)}
                                isHover={isHover}
                                isSvg={isSvg}
                            />
                        )}
                        {!icon && isInsideSubmenu && (
                            <Icon
                                source={Icons.ArrowRightSvgIcon}
                                isSvg={isSvg}
                                iconColor='text-current'
                                size={16}
                            />
                        )}
                        <Typography noStyle className='sidebar-item-title'>
                            {defaultName || name}
                        </Typography>
                        {addPath && (
                            <div
                                className='sidebar-item-addPath'
                                onClick={(e) => {
                                    e.preventDefault();
                                    Navigation.navigate({ url: addPath });
                                }}
                            >
                                <Icon
                                    className='m-1'
                                    source={'add'}
                                    size={20}
                                />
                            </div>
                        )}
                        {!IsEmptyArray(dropdownMenus) && (
                            <Icon
                                className='ml-auto dropdown-icon'
                                source={'arrow_right'}
                                iconColor='text-current'
                                size={20}
                            />
                        )}
                    </button>
                </HoverCard>
            );
        },
        [
            action,
            addPath,
            className,
            defaultName,
            dropdownMenus,
            icon,
            isActiveRoute,
            isHover,
            isInsideSubmenu,
            isSidebarExpand,
            isSvg,
            name,
            spaceAbove,
        ]
    );

    if (action) {
        return (
            <div
                className='sidebar-action'
                onClick={
                    typeof action === 'string'
                        ? (FunctionsUtil as any)[action]
                        : action
                }
            >
                {getMenu()}
            </div>
        );
    }

    if (path) {
        return getMenu(path);
    }
    return getMenu();
};

const RenderSubMenu = React.memo(
    ({
        name,
        icon,
        children,
        isActive,
        isSvg,
        expand,
        spaceAbove,
        setExpand,
        menus,
    }: {
        name: string;
        defaultName?: string;
        icon: any;
        menus: any;
        children: React.ReactNode;
        isActive?: boolean;
        isSvg?: boolean;
        expand?: boolean;
        spaceAbove?: boolean;
        setExpand?: Function;
    }) => {
        const { isSidebarExpand, isArc } = useApp();
        const [isHover, setIsHover] = useState(false);

        const activeMenus = useMemo(
            () => menus.filter((menu) => !!menu.visibility),
            [menus]
        );

        return (
            <HoverCard
                openDelay={200}
                closeDelay={100}
                position='right'
                align='start'
                offSet={18}
                contentClassName='zoom-in-95'
                content={
                    <>
                        {!isSidebarExpand && (
                            <div className='sidebar-dropdown submenu-sidebar-dropdown'>
                                <div className='sidebar-drop-content'>
                                    <Typography
                                        noStyle
                                        size='normal'
                                        className='sidebar-drop-title'
                                    >
                                        {name}
                                    </Typography>
                                    <div
                                        className={cn(
                                            'relative gap-1 overflow-hidden overflow-y-auto transition-all small-scrollbar-sidebar !max-h-[70vh] col-flex',
                                            {
                                                'bg-neutral': isArc,
                                            }
                                        )}
                                    >
                                        {children}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                }
            >
                <div
                    className={cn('submenu', {
                        expand,
                        active: isActive && (!expand || !isSidebarExpand),
                        'mt-3': spaceAbove,
                    })}
                >
                    <div
                        className='sidebar-item'
                        onClick={(e) => {
                            if (setExpand) {
                                setExpand();
                            }
                            if (isActive || isSidebarExpand) return null;
                            e.preventDefault();
                            Navigation.navigate({
                                url: activeMenus[0]?.path,
                            });
                        }}
                        onMouseOver={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        <div className='flex flex-row gap-3'>
                            {icon && (
                                <MenuIcon
                                    icon={icon}
                                    isActive={isActive}
                                    isHover={isHover}
                                    isSvg={isSvg}
                                />
                            )}
                            <Typography noStyle className='sidebar-item-title'>
                                {name}
                            </Typography>
                        </div>
                        <Icon
                            source={'arrow_drop_down'}
                            iconColor='text-current'
                            size={20}
                            isSvg
                        />
                    </div>

                    <AnimateHeight height={expand ? 'auto' : 0}>
                        <div className='menus hover text-[0.950rem]'>
                            {children}
                        </div>
                    </AnimateHeight>
                </div>
            </HoverCard>
        );
    }
);

const MenuIcon = ({ icon, isSvg, isHover, isActive }) => {
    const iconComponent = useMemo(() => {
        if (typeof icon !== 'string') return icon;
        if (!isSvg) return icon;

        const iconSource = (Icons as any)[icon];
        if (!isHover && !isActive) return iconSource;

        const hoverIcon = (Icons as any)[icon + 'Hover'];

        if (hoverIcon) return hoverIcon;
        return iconSource;
    }, [icon, isActive, isHover, isSvg]);

    if (!iconComponent) return null;

    return (
        <Icon
            source={iconComponent}
            isSvg={isSvg}
            iconColor='text-current'
            size={20}
            // fill={
            //     isActive || isHover
            //         ? 'currentColor'
            //         : null
            // }
        />
    );
};

// Component for displaying the user's profile information
const Profilecomponent = ({ isSidebarExpand }: any) => {
    const { user } = useUserHook() as any;

    const { basePath, isArc, toggleSidebarExpand } = useApp();

    const arcAvatarWidthClassName = isArc ? 'h-8 w-8 rounded-full' : '';

    return (
        <div
            className={cn(
                'flex items-center justify-start w-full gap-3 mt-4 user-profile ',
                {
                    'px-3': isSidebarExpand,
                    'h-[42px] ': !isArc,
                    'p-0': !isSidebarExpand,
                    'p-0 pl-1.5': isArc && isSidebarExpand,
                    'pl-1.5': isArc && !isSidebarExpand,
                }
            )}
        >
            {isSidebarExpand ? (
                <>
                    {user?.image_url ? (
                        <div
                            className={cn(
                                'overflow-hidden p-1 w-8 h-8 rounded bg-base-200 centralize',
                                arcAvatarWidthClassName
                            )}
                        >
                            {/*  eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={user?.image_url}
                                alt='profile'
                                className={cn(
                                    'object-cover w-8 h-8',
                                    arcAvatarWidthClassName
                                )}
                            />
                        </div>
                    ) : (
                        <Avatar
                            alt={user?.name || 'F'}
                            size='sm'
                            shape='circle'
                            // className='p-1'
                            imageWrapperClassName={cn(arcAvatarWidthClassName, {
                                'bg-polaris-avatar-four-bg-fill text-polaris-avatar-four-text-on-bg-fill':
                                    isArc,
                            })}
                        />
                    )}
                </>
            ) : (
                <HoverCard
                    align='end'
                    position='right'
                    offSet={17}
                    openDelay={400}
                    content={
                        <div className='flex items-center gap-2 p-3 min-w-[200px] rounded shadow-lg bg-base-100'>
                            {user?.image_url ? (
                                <div
                                    className={cn(
                                        'overflow-hidden p-1 w-8 h-8 rounded bg-base-200 centralize',
                                        arcAvatarWidthClassName
                                    )}
                                >
                                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={user?.image_url}
                                        alt='profile'
                                        className={cn(
                                            'object-cover w-14 h-14',
                                            arcAvatarWidthClassName
                                        )}
                                    />
                                </div>
                            ) : (
                                <Avatar
                                    alt={user?.name || 'F'}
                                    size='xs'
                                    shape='circle'
                                    imageWrapperClassName={cn(
                                        'h-8 w-8 bg-polaris-avatar-four-bg-fill text-polaris-avatar-four-text-on-bg-fill',
                                        arcAvatarWidthClassName
                                    )}
                                />
                            )}
                            <div className='text-sm text-base-primary col-flex'>
                                <p>{user?.name}</p>
                                <p className='text-xs text-base-secondary'>
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    }
                >
                    <Link href={USER_PROFILE_ROUTE}>
                        {user?.image_url ? (
                            <div
                                className={cn(
                                    'overflow-hidden p-1 w-8 h-8 rounded bg-base-200 centralize',
                                    arcAvatarWidthClassName
                                )}
                            >
                                {/*  eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={user?.image_url}
                                    alt='profile'
                                    className={cn(
                                        'object-cover w-8 h-8',
                                        arcAvatarWidthClassName
                                    )}
                                />
                            </div>
                        ) : (
                            <div
                                className={cn(
                                    'overflow-hidden p-1 w-8 h-8 rounded-full centralize',
                                    arcAvatarWidthClassName
                                )}
                            >
                                <Avatar
                                    alt={user?.name || 'F'}
                                    size='sm'
                                    shape='circle'
                                    imageWrapperClassName={cn({
                                        'h-8 w-8 bg-polaris-avatar-four-bg-fill text-polaris-avatar-four-text-on-bg-fill':
                                            isArc,
                                    })}
                                />
                            </div>
                        )}
                    </Link>
                </HoverCard>
            )}

            {isSidebarExpand && !isArc && (
                <div className='user-profile-details'>
                    <p className='font-medium user-profile-name'>
                        {user?.name || '-'}
                    </p>
                    <p className='text-base-tertiary break-words max-w-[200px] overflow-hidden user-profile-email !leading-3'>
                        <Ellipsis length={24} text={user?.email} />
                    </p>
                </div>
            )}

            {isSidebarExpand && isArc && (
                <Button
                    appearance='polaris-transparent'
                    className='ml-auto w-fit text-polaris-text-inverse hover:text-polaris-text-inverse hover:bg-polaris-bg-surface-inverse !min-h-8'
                    onClick={toggleSidebarExpand}
                >
                    <Icon
                        source={Icons.CircleChevronLeftSvgIcon}
                        size={20}
                        className={cn('rotate-180', {
                            'rotate-0': isSidebarExpand,
                        })}
                        isSvg
                    />
                </Button>
            )}
        </div>
    );
};
