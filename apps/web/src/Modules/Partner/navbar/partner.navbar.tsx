import Image from 'next/image';

import {
    CLIENT_CONFIG,
    Navigation,
    PARTNER_CLIENT_CONFIG_ROUTE,
    PARTNER_DASHBOARD_ROUTE,
    useApp,
    useOpenProperties,
    useUserHook,
} from '@finnoto/core';
import {
    Button,
    DropdownMenu,
    Icon,
    IconButton,
    logout,
} from '@finnoto/design-system';

import { openDebugForm } from '@Modules/user_profile/Forms/changeDebugForm';

import {
    ArcSettingsSvgIcon,
    BusinessSvgIcon,
    CodeSvgIcon,
    NavHome,
    UserSvgIcon,
} from 'assets';

const PartnerNavbar = () => {
    const { basePath } = useApp();

    const { user } = useUserHook();

    const [enabledDebug] = useOpenProperties('enable.debug.mode', {
        convertBoolean: true,
    });

    const handleHomeClick = () => {
        Navigation.navigate({ url: PARTNER_DASHBOARD_ROUTE });
    };

    const handleSettingsClick = () => {
        Navigation.navigate({ url: PARTNER_CLIENT_CONFIG_ROUTE });
    };

    return (
        <nav className='flex sticky top-0 z-50 justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm'>
            <div className='flex items-center space-x-2'>
                <Image
                    src={'/logo.png'}
                    alt='Brand Logo'
                    height={40}
                    width={40}
                    style={{
                        objectFit: 'contain',
                        objectPosition: 'left',
                    }}
                    unoptimized
                    priority
                />
                <span className='text-xl font-bold text-gray-900'>
                    Partner Portal
                </span>
            </div>

            <div className='flex items-center space-x-4'>
                {/* Home Button */}
                <Button
                    appearance='ghost'
                    size='md'
                    onClick={handleHomeClick}
                    className='flex items-center px-4 py-2 space-x-2 text-gray-700 rounded-lg transition-colors duration-200 hover:text-primary hover:bg-gray-50'
                >
                    <Icon source={BusinessSvgIcon} isSvg size={20} />
                    <span className='hidden sm:inline-block'>Businesses</span>
                </Button>

                <Button
                    appearance='ghost'
                    size='md'
                    onClick={handleSettingsClick}
                    className='flex items-center px-4 py-2 space-x-2 text-gray-700 rounded-lg transition-colors duration-200 hover:text-primary hover:bg-gray-50'
                >
                    <Icon source={ArcSettingsSvgIcon} isSvg size={20} />
                    <span className='hidden sm:inline-block'>
                        Api Configurations
                    </span>
                </Button>

                {/* User Avatar */}
                <div className='flex items-center pl-4 space-x-3 border-l border-gray-200'>
                    <div className='flex flex-col items-end'>
                        <span className='text-sm font-medium text-gray-900'>
                            {user?.name}
                        </span>
                        <span className='text-xs text-gray-500'>
                            {user?.email}
                        </span>
                    </div>
                    <DropdownMenu
                        actions={[
                            {
                                name: 'Debug Form',
                                icon: CodeSvgIcon,
                                isSvg: true,
                                action: openDebugForm,
                                visible: !!enabledDebug,
                                iconSize: 16,
                            },
                            {
                                name: 'Logout',
                                action: logout,
                            },
                        ]}
                    >
                        <IconButton
                            icon={UserSvgIcon}
                            size='md'
                            shape='circle'
                            appearance='ghost'
                            className='transition-colors duration-200 hover:bg-gray-100'
                        />
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default PartnerNavbar;
