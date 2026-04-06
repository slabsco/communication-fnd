import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
    ARC_NOTIFICATION_LIST,
    EMPLOYEE_NOTIFICATION_LIST_ROUTE,
    FINOPS_NOTIFICATION_LIST_ROUTE,
    IsEmptyArray,
    IsUndefinedOrNull,
    PAYMENT_NOTIFICATION_LIST_ROUTE,
    PRODUCT_IDENTIFIER,
    RECKO_NOTIFICATION_LIST_ROUTE,
    useApp,
    useHeaderNotification,
    useHeaderNotificationMethods,
    UserNotificationSourceTypeEnum,
} from '@finnoto/core';
import {
    Avatar,
    cn,
    DropdownMenu,
    Icon,
    IconButton,
    Loading,
    NoDataFound,
    Popover,
    Tab,
} from '@finnoto/design-system';
import { TabBorderButtonAction } from '@finnoto/design-system/src/Components/Navigation/Tabs/Tab/tab.types';

import {
    ArcInvoicesSvgIcon,
    BagSvgIcon,
    MoreIcon,
    PurchaseSvgIcon,
    PwaAdvanceSvgIcon,
    PwaExpenseSvgIcon,
    PwaReimbursementSvgIcon,
    UserSvgIcon,
} from 'assets';

const HeaderNotification = () => {
    const { notificationData, totalUnread } = useHeaderNotification({
        isArchived: false,
    });

    const [popoverVisible, setPopOverVisible] = useState(false);

    return (
        <Popover
            onVisibleChange={(key) => {
                setPopOverVisible(key);
            }}
            element={
                <RenderNotifications
                    data={notificationData}
                    setPopOverVisible={setPopOverVisible}
                />
            }
            align='center'
            side='bottom'
            offsetY={10}
            id='notifications'
            visible={popoverVisible}
        >
            <div className='indicator'>
                <span
                    className={cn(
                        'indicator-item hidden  top-2 right-1 badge badge-info badge-sm text-[10px]',
                        {
                            'flex animate-pulse': totalUnread > 0,
                        }
                    )}
                >
                    {totalUnread}
                </span>

                <IconButton
                    icon={'notifications_none'}
                    size='md'
                    shape='square'
                    outline
                    appearance='ghost'
                    className='text-base-300 dark:text-base-content'
                    iconSize={30}
                />
            </div>
        </Popover>
    );
};

const RenderNotifications = ({
    data: notificationData,
    setPopOverVisible,
}: any) => {
    const { acknowledgeAll, archiveAll } = useHeaderNotificationMethods();

    const canArchiveAll = useMemo(() => {
        return (
            notificationData.filter((data) =>
                IsUndefinedOrNull(data?.archived_at)
            ).length > 0
        );
    }, [notificationData]);

    const canMarkAsReadAll = useMemo(() => {
        return (
            notificationData.filter((data) =>
                IsUndefinedOrNull(data?.acknowledged_at)
            ).length > 0
        );
    }, [notificationData]);

    const commonActions = {
        all_read: {
            name: 'Mark All as Read',
            action: () => {
                acknowledgeAll();
            },
            visible: canMarkAsReadAll,
        },
        archive_all: {
            name: 'Archive All',
            action: () => {
                archiveAll();
            },
            visible: canArchiveAll,
        },
    };

    const actions: TabBorderButtonAction[] = [
        {
            name: 'Actions',
            key: 'inbox',
            type: 'dropdown',
            visible: canMarkAsReadAll || canArchiveAll,
            actions: [commonActions.all_read, commonActions.archive_all],
        },
    ];

    const closePopOver = () => {
        setPopOverVisible(false);
    };

    return (
        <div className='shadow col-flex text-base-content'>
            <Tab
                active='inbox'
                containerClassName='2xl:w-[500px] md:w-[300px] xl:w-[400px] rounded-none'
                contentContainerClass='overflow-y-auto scrollbar-xs min-h-[300px] max-h-[500px] xl:min-h-[400px] xl:max-h-[600px]'
                disableNav
                tabListClassName='w-full border-b pb-0'
                animationClassName='-bottom-0.5'
                actions={actions}
                tabs={[
                    {
                        title: 'Inbox',
                        key: 'inbox',
                        component: (
                            <CommonRenderComponent
                                onClick={closePopOver}
                                data={notificationData}
                                active='inbox'
                            />
                        ),
                    },
                    {
                        title: 'Archived',
                        component: <HeaderArchivedTab onClick={closePopOver} />,
                        key: 'archived',
                    },
                    {
                        title: 'All',
                        component: <HeaderAllTab onClick={closePopOver} />,
                        key: 'all',
                    },
                ]}
            />
        </div>
    );
};

const iconsAccordingToType = {
    [UserNotificationSourceTypeEnum.VENDOR_EXPENSE]: PwaExpenseSvgIcon,
    [UserNotificationSourceTypeEnum.PURCHASE_ORDER]: PurchaseSvgIcon,
    [UserNotificationSourceTypeEnum.PURCHASE_QUOTE]: BagSvgIcon,
    [UserNotificationSourceTypeEnum.PURCHASE_REQUEST]: UserSvgIcon,
    [UserNotificationSourceTypeEnum.REIMBURSEMENT]: PwaReimbursementSvgIcon,
    [UserNotificationSourceTypeEnum.EMPLOYEE_ADVANCE]: PwaAdvanceSvgIcon,
};
const NotificationItem = ({
    data,
    onClick,
}: {
    data: any;
    onClick?: () => void;
}) => {
    const { actions, contextKey, isRead, formatDate, handleNavigation } =
        useHeaderNotificationMethods(data);

    return (
        <div
            className={cn(
                'flex gap-3 items-start p-3 border-b transition-all cursor-pointer last:border-0 hover:bg-polaris-bg-surface-secondary',
                {
                    'bg-polaris-bg-surface-secondary': !isRead,
                }
            )}
            onClick={() => {
                handleNavigation?.();
                onClick?.();
            }}
        >
            <div className='flex gap-1 items-center'>
                <span
                    className={cn('w-2 h-2 rounded-full bg-polaris-icon-info', {
                        'opacity-0': isRead,
                    })}
                ></span>

                {data?.type_id && iconsAccordingToType[data?.type_id] ? (
                    <Icon
                        source={
                            iconsAccordingToType[data?.type_id] ??
                            ArcInvoicesSvgIcon
                        }
                        isSvg
                        size={20}
                    />
                ) : (
                    <Avatar
                        className='mt-1'
                        alt={data.type ?? 'su'}
                        shape='circle'
                        size='28'
                    />
                )}
            </div>
            <div className='flex-1 gap-4 col-flex'>
                <div className='col-flex'>
                    <p
                        className={cn(
                            'flex gap-1 items-center text-sm text-polaris-text-primary',
                            {
                                'text-polaris-text-secondary': !isRead,
                            }
                        )}
                    >
                        Commented in
                        <span className='font-medium'>{contextKey[0]}</span>
                    </p>
                    <span
                        className={cn(
                            'flex gap-2 items-center text-xs text-polaris-text-secondary',
                            {
                                'text-polaris-text-disabled': !isRead,
                            }
                        )}
                    >
                        <span>{formatDate(data?.created_at)}</span>
                        <span className='w-1 h-1 rounded-full bg-base-tertiary'></span>
                        <span>{data?.type}</span>
                    </span>
                </div>
                <p
                    className={cn(
                        'text-sm text-polaris-text [&>b]:font-semibold',
                        {
                            'text-polaris-text-secondary': !isRead,
                        }
                    )}
                    dangerouslySetInnerHTML={{ __html: data?.message }}
                ></p>
            </div>
            <DropdownMenu actions={actions}>
                <IconButton
                    icon={MoreIcon}
                    size='sm'
                    shape='square'
                    appearance='ghost'
                    iconSize={20}
                />
            </DropdownMenu>
        </div>
    );
};

const HeaderArchivedTab = ({ onClick }: any) => {
    const { notificationData, notificationLoading } = useHeaderNotification({
        isArchived: true,
    });
    if (notificationLoading)
        return (
            <div className='flex-1 centralize'>
                <Loading color='primary' size='lg' type='infinity' />
            </div>
        );
    return (
        <CommonRenderComponent
            onClick={onClick}
            data={notificationData}
            active='archive'
        />
    );
};
const HeaderAllTab = ({ onClick }: any) => {
    const { notificationData, notificationLoading } = useHeaderNotification({
        isArchived: undefined,
    });
    if (notificationLoading)
        return (
            <div className='flex-1 centralize'>
                <Loading color='primary' size='lg' type='infinity' />
            </div>
        );
    return (
        <CommonRenderComponent
            onClick={onClick}
            data={notificationData}
            active='all'
        />
    );
};

type ActiveTabType = 'inbox' | 'archive' | 'all';

const CommonRenderComponent = ({
    data,
    onClick,
    active,
}: {
    data: any;
    onClick?: () => void;
    active: ActiveTabType;
}) => {
    return (
        <div className='flex-1 col-flex'>
            {data?.map((val) => {
                return (
                    <NotificationItem
                        onClick={onClick}
                        data={val}
                        key={val.id}
                    />
                );
            })}
            {IsEmptyArray(data) ? (
                <NoDataFound
                    description='You dont have any notifications here'
                    title='No Notifications'
                />
            ) : (
                <ViewAll {...{ onClick, active }} />
            )}
        </div>
    );
};

const productNotificationPath = {
    [PRODUCT_IDENTIFIER.ARC]: ARC_NOTIFICATION_LIST,
    [PRODUCT_IDENTIFIER.EMPLOYEE]: EMPLOYEE_NOTIFICATION_LIST_ROUTE,
    [PRODUCT_IDENTIFIER.FINOPS]: FINOPS_NOTIFICATION_LIST_ROUTE,
    [PRODUCT_IDENTIFIER.PAYMENT]: PAYMENT_NOTIFICATION_LIST_ROUTE,
    [PRODUCT_IDENTIFIER.RECO]: RECKO_NOTIFICATION_LIST_ROUTE,
};

const ViewAll = ({
    onClick,
    active,
}: {
    onClick: () => void;
    active: ActiveTabType;
}) => {
    const { product_id } = useApp();

    return (
        <div className='fixed bottom-0 p-2 w-full border-t centralize bg-base-100'>
            <Link
                onClick={onClick}
                className='text-xs link link-hover'
                href={`${productNotificationPath[product_id]}?archive=${active}`}
            >
                View All
            </Link>
        </div>
    );
};

export default HeaderNotification;
