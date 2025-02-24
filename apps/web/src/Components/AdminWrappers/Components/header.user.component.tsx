import { useMemo, useState } from 'react';
import { useUnmount } from 'react-use';

import {
    AccessManager,
    authenticateBusiness,
    groupBusiness,
    Navigation,
    PRODUCT_IDENTIFIER,
    useApp,
    useAppBusinesses,
    useCurrentBusiness,
    useOpenProperties,
    useUserHook,
} from '@finnoto/core';
import {
    Avatar,
    cn,
    DropdownMenu,
    DropdownMenuActionProps,
    Icon,
    Modal,
    ModalBody,
    ModalContainer,
    Popover,
} from '@finnoto/design-system';

import { openDebugForm } from '@Modules/user_profile/Forms/changeDebugForm';
import {
    logout,
    openChangeOrganizationName,
    openShortCutKeys,
} from '@Utils/functions.utils';

import {
    ArcInfoSvgIcon,
    CodeSvgIcon,
    LogoutSvgIcon,
    RenameOrgSvgImage,
    RepeatSvgIcon,
    ShortcutSvgIcon,
    UserSvgIcon,
} from 'assets';

const HeaderUser = (props: { customAvatar?: React.ReactNode }) => {
    const { currentBusiness } = useCurrentBusiness();
    const { businesses } = useAppBusinesses();
    const { product_id } = useApp();
    const { user } = useUserHook();

    const isOwner = useMemo(() => {
        return AccessManager.isAuthUser(currentBusiness?.owner_id);
    }, [currentBusiness.owner_id]);

    const portalName = useMemo(() => {
        switch (product_id) {
            case PRODUCT_IDENTIFIER.RECO:
                return 'AR';
            case PRODUCT_IDENTIFIER.EMPLOYEE:
                return 'EP';
            case PRODUCT_IDENTIFIER.VENDOR:
                return 'VP';
            case PRODUCT_IDENTIFIER.FINOPS:
                return 'AP';
        }
    }, [product_id]);

    return (
        <Popover
            id='user-popover'
            element={
                <HeaderLogoutPopper
                    {...{ isOwner, currentBusiness, businesses }}
                />
            }
            offsetX={40}
            className='!overflow-visible'
        >
            {props.customAvatar || (
                <div className='gap-4 row-flex'>
                    <div className='gap-4 items-center px-2 -mr-2 rounded cursor-pointer select-none row-flex hover:bg-neutral-focus'>
                        <div className='items-end text-sm col-flex'>
                            {currentBusiness?.name}

                            <span className='text-xs text-base-secondary'>
                                {user?.name || user?.email}
                            </span>
                        </div>

                        <Avatar
                            initial={portalName}
                            alt={portalName}
                            size='xs'
                            shape='circle'
                        />
                    </div>
                </div>
            )}
        </Popover>
    );
};

const HeaderLogoutPopper = ({
    isOwner,
    currentBusiness,
    businesses,
}: {
    isOwner?: boolean;
    currentBusiness?: any;
    businesses?: any[];
}) => {
    const { basePath, isArc } = useApp();
    const { user } = useUserHook();
    const [enabledDebug] = useOpenProperties('enable.debug.mode', {
        convertBoolean: true,
    });

    const [showSwitch, setShowSwitch] = useState(false);

    const groupedBusinesses: any = useMemo(() => {
        return groupBusiness(businesses);
    }, [businesses]);

    const navigateToProfile = () => {
        Navigation.navigate({ url: `${basePath}/settings/my-profile` });
    };

    useUnmount(() => {
        setShowSwitch(false);
    });

    return (
        <div
            className={cn(
                'p-2 rounded min-w-[220px] bg-base-100 text-base-primary col-flex menu menu-horizontal',
                {
                    'py-1': isArc,
                }
            )}
        >
            {groupedBusinesses?.length > 1 && (
                <div
                    className='relative'
                    onMouseEnter={() => setShowSwitch(true)}
                    onMouseLeave={() => setShowSwitch(false)}
                >
                    <div className='w-full h-full'>
                        <ActionCard
                            name='Switch Organisation'
                            icon={RepeatSvgIcon}
                            showBackground={showSwitch}
                            showEndIcon
                        />
                    </div>
                    {showSwitch && (
                        <div className='absolute z-[9999999999] pr-3 top-0 right-[100%]'>
                            <div className='max-h-[40vh] w-[250px] overflow-y-auto p-2 bg-base-100 shadow-md rounded border'>
                                {groupedBusinesses?.map((val, index) => {
                                    return (
                                        <ActionCard
                                            key={index}
                                            name={val?.name}
                                            onClick={() => {
                                                authenticateBusiness(val);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <ActionCard
                name='My Profile'
                icon={UserSvgIcon}
                onClick={navigateToProfile}
            />
            {isOwner && (
                <ActionCard
                    name='Rename Organisation'
                    icon={RenameOrgSvgImage}
                    onClick={() => {
                        openChangeOrganizationName({
                            data: {
                                name: currentBusiness?.name,
                            },
                        });
                    }}
                />
            )}

            {enabledDebug && (
                <ActionCard
                    icon={CodeSvgIcon}
                    name='Debug Form'
                    onClick={openDebugForm}
                />
            )}

            <ActionCard
                icon={ShortcutSvgIcon}
                name='Shortcut Keys'
                onClick={openShortCutKeys}
            />

            <ActionCard
                name='Logout'
                className='text-error hover:!bg-error '
                icon={LogoutSvgIcon}
                onClick={logout}
            />
        </div>
    );
};

export const ArcHeaderPopover = ({ children }: any) => {
    const { currentBusiness } = useCurrentBusiness();
    const { basePath } = useApp();
    // const { businesses } = useAppBusinesses();
    const { user } = useUserHook();
    // const [enabledDebug] = useOpenProperties('enable.debug.mode', {
    //     convertBoolean: true,
    // });

    const isOwner = useMemo(() => {
        return AccessManager.isAuthUser(currentBusiness?.owner_id);
    }, [currentBusiness.owner_id]);

    const navigateToProfile = () => {
        Navigation.navigate({ url: `${basePath}/settings/my-profile` });
    };

    // const groupedBusinesses = useMemo(() => {
    //     return groupBusiness(businesses);
    // }, [businesses]);

    // const switchOrgActions = useMemo(() => {
    //     return groupedBusinesses?.map((val, index) => {
    //         return {
    //             name: val?.name,
    //             action: () => {
    //                 authenticateBusiness(val);
    //             },
    //         };
    //     });
    // }, [groupedBusinesses]);

    const actions: DropdownMenuActionProps[] = [
        // {
        //     name: 'Switch Organisation',
        //     icon: RepeatSvgIcon,
        //     isSvg: true,
        //     expandableActions: switchOrgActions,
        //     className: 'gap-2',
        //     iconSize: 16,
        //     visible: groupedBusinesses?.length > 1,
        // },
        // {
        //     name: 'My Profile',
        //     action: navigateToProfile,
        //     isSvg: true,
        //     icon: UserSvgIcon,
        //     iconSize: 16,
        // },
        // {
        //     name: 'Rename Organisation',
        //     icon: RenameOrgSvgImage,
        //     isSvg: true,
        //     action: () => {
        //         openChangeOrganizationName({
        //             data: {
        //                 name: currentBusiness?.name,
        //             },
        //         });
        //     },
        //     visible: isOwner,
        //     iconSize: 16,
        // },
        {
            name: 'Debug Form',
            icon: CodeSvgIcon,
            isSvg: true,
            action: openDebugForm,
            visible: true,
            iconSize: 16,
        },
        // {
        //     name: 'Enable Developer Mode',
        //     icon: LockSvgIcon,
        //     isSvg: true,
        //     action: enableDeveloperMode,
        //     visible: !!enabledDebug,
        //     iconSize: 16,
        // },
        // {
        //     name: 'Shortcut Keys',
        //     icon: ShortcutSvgIcon,
        //     isSvg: true,
        //     action: openShortCutKeys,
        //     iconSize: 16,
        // },
        {
            name: 'Business Info',
            icon: ArcInfoSvgIcon,
            isSvg: true,
            action: () => {
                Modal.open({ component: BusinessInfoModal, modalSize: 'sm' });
            },
            iconSize: 16,
        },
        {
            name: 'Logout',
            icon: LogoutSvgIcon,
            isSvg: true,
            action: logout,
            className:
                'text-error focus:!bg-error/20 focus:!text-error hover:bg-error/20 hover:text-error',
            iconSize: 16,
        },
    ];

    return (
        <DropdownMenu actions={actions} searchable={false}>
            {children}
        </DropdownMenu>
    );
};

const ActionCard = ({
    name,
    icon,
    onClick,
    showEndIcon,
    className,
    showBackground,
}: any) => {
    const { isArc } = useApp();

    if (isArc) {
        return (
            <div
                onClick={onClick}
                className={cn(
                    'flex gap-3 items-center px-2 py-1 rounded transition-all cursor-pointer hover:bg-primary hover:text-primary-content',
                    {
                        'bg-primary text-primary-content': showBackground,
                    },
                    className
                )}
            >
                {icon && <Icon size={20} source={icon} isSvg />}

                <p className='flex-1 text-polaris-size-325'>{name}</p>
                {showEndIcon && <Icon source={'play_arrow'} isSvg size={22} />}
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                'flex gap-3 items-center px-3 py-2 rounded transition-all cursor-pointer hover:bg-primary hover:text-primary-content',
                {
                    'bg-primary text-primary-content': showBackground,
                },
                className
            )}
        >
            {icon && <Icon size={18} source={icon} isSvg />}

            <p className='flex-1 text-sm'>{name}</p>
            {showEndIcon && <Icon source={'play_arrow'} isSvg size={22} />}
        </div>
    );
};

export default HeaderUser;

const BusinessInfoModal = () => {
    const { user } = useUserHook();

    return (
        <ModalContainer title='Business Info'>
            <ModalBody className='grid grid-cols-2 gap-2 items-center'>
                <div className='p-3 bg-white shadow'>
                    <p>Business Mobile</p>
                    <span className='font-medium'>
                        {user.business?.internal_number ||
                            'No set, please connect with facebook'}
                    </span>
                </div>
                <div className='p-3 bg-white shadow'>
                    <p>Whatsapp Business Id</p>
                    <span className='font-medium'>
                        {user.business?.internal_id ||
                            'No set, please connect with facebook'}
                    </span>
                </div>
            </ModalBody>
        </ModalContainer>
    );
};
