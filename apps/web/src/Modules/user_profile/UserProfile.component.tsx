import { PenLine, User2Icon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import {
    FetchData,
    HOME_ROUTE,
    IsEmptyArray,
    ObjectDto,
    RefetchGenericListing,
    TitleRoutePayload,
    useFetchParams,
    useQuery,
    useUserHook,
    useUserProfileHook,
} from '@finnoto/core';
import { UserProfileController } from '@finnoto/core/src/backend/communication/controller/user.profile.controller';
import { MetaUserController } from '@finnoto/core/src/backend/meta/controllers/meta.user.controller';
import {
    AnimatedTabs,
    ApiSchema,
    Avatar,
    Badge,
    Breadcrumbs,
    cn,
    CommonFileUploader,
    Container,
    GetObjectFromArray,
    Icon,
    IconButton,
    InformationCardUpdated,
    IsEmptyObject,
    Loading,
    Modal,
    ModalFormUtil,
    SlidingPane,
    Table,
    TableProps,
    Toast,
} from '@finnoto/design-system';
import { TAB_ITEM } from '@finnoto/design-system/src/Components/Navigation/Tabs/commonTab.types';

import DropdownActionButton from '@Components/DropdownButton/dropdown.action.button';
import { openImageCropper } from '@Utils/functions.utils';

import AddEditProfileMobile from './Forms/addEditProfileMobile.form';
import ChangePasswordForm from './Forms/changePassword.form';

import {
    AddSvgIcon,
    EditSvgIcon,
    OrganizationSvgIcon,
    TickMarkSvgIcon,
    UnVerifiedSvgIcon,
} from 'assets';

const UserProfile = () => {
    const { user } = useUserHook();

    const { changeProfilePicture } = useUserProfileHook();

    const handleProfileImage = (image_url) => {
        openImageCropper(image_url, { rotatable: true }, (file) => {
            changeProfilePicture(file?.serverUrl);
        });
    };

    // const { userRolesList } = useGetUserRoles();

    const { tabs, tab = 'active_organization' } = useFetchParams();

    const openChangePassword = () => {
        SlidingPane.open({
            component: ChangePasswordForm,
            props: {
                callback: () => {
                    SlidingPane.close();
                },
            },
        });
    };

    const breadCrumbs: Array<TitleRoutePayload> = [
        { name: 'Home', link: HOME_ROUTE, className: 'text-base-tertiary' },
        { name: 'My Profile' },
    ];

    const actions = useMemo(
        () => [
            {
                name: 'Change Password',
                key: 'change_password',
                action: openChangePassword,
            },
        ],
        []
    );

    const tab_items: TAB_ITEM[] = useMemo(
        () => [
            {
                title: 'Active Organization',
                key: 'active_organization',
                component: <ActiveBusinessComponent />,
            },
        ],
        []
    );

    const handleShowButton = useCallback(
        (key: string) => {
            const renderData = GetObjectFromArray(actions, 'key', key);

            if (IsEmptyObject(renderData)) {
                return <></>;
            }
            return (
                <IconButton
                    icon={AddSvgIcon}
                    outline
                    onClick={renderData?.action}
                    name={renderData?.name}
                />
            );
        },
        [actions]
    );

    const openUserProfileImage = useCallback(() => {
        Modal.open({
            component: ProfileImageViewer,
            modalSize: 'full',
            className: 'bg-black/60',
            closeClassName: 'text-white',
            props: {
                imageUrl: user?.image_url,
            },
        });
    }, [user?.image_url]);

    const openProfileMobileVerify = () => {
        SlidingPane.open({
            component: AddEditProfileMobile,
            props: {
                dialing_code: user.dialing_code,
                mobile: user.mobile,
                callback: () => {},
            },
        });
    };

    return (
        <Container className='overflow-hidden gap-4 py-5 col-flex h-content-screen'>
            <div className='flex gap-4 justify-between items-center'>
                <Breadcrumbs title='My Profile' route={breadCrumbs} />
                <div className='gap-4 items-center row-flex'>
                    {handleShowButton(tabs || null)}
                    <DropdownActionButton actions={actions} size='md' />
                </div>
            </div>
            <div className='flex overflow-hidden flex-1 gap-3 items-center'>
                <div
                    className='col-flex gap-y-3 md:w-5/12 h-full lg:w-4/12 xl:w-[30%] self-start'
                    data-title='detail_information'
                >
                    <div className='rounded border border-base-300 bg-base-100 col-flex'>
                        <div className='gap-1 items-center p-4 pb-2 col-flex'>
                            <div className='relative'>
                                {!user?.image_url ? (
                                    <div className='overflow-hidden rounded-full cursor-pointer bg-base-200'>
                                        <User2Icon
                                            size={100}
                                            className='text-gray-300'
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        {/*  eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={user?.image_url}
                                            alt='WhatsApp Profile'
                                            className='object-cover w-24 h-24 rounded-full border-2 border-base-200'
                                            onClick={() =>
                                                openUserProfileImage()
                                            }
                                        />
                                    </div>
                                )}

                                <CommonFileUploader
                                    is_multiple={false}
                                    maxFiles={1}
                                    accept={{
                                        'image/jpeg': [],
                                        'image/png': [],
                                    }}
                                    onFileUpload={(files: any) => {
                                        handleProfileImage(
                                            files?.[0]?.serverUrl
                                        );
                                    }}
                                >
                                    {({ uploading }) => (
                                        <div
                                            className={cn(
                                                'overflow-hidden absolute -top-2 -right-2 w-8 h-8 rounded-full cursor-pointer p-[2px] bg-base-100',
                                                {
                                                    'cursor-not-allowed':
                                                        uploading,
                                                }
                                            )}
                                        >
                                            {uploading ? (
                                                <div className='p-1 rounded-full transition-all text-base-primary centralize bg-base-300 hover:bg-success hover:text-white'>
                                                    <Loading
                                                        size='sm'
                                                        color='primary'
                                                    />
                                                </div>
                                            ) : (
                                                <Icon
                                                    source={EditSvgIcon}
                                                    isSvg
                                                    size={20}
                                                    className='p-1 rounded-full transition-all text-base-primary centralize bg-base-300 hover:bg-success hover:text-white'
                                                />
                                            )}
                                        </div>
                                    )}
                                </CommonFileUploader>
                            </div>
                            <p className='text-lg font-semibold'>{user.name}</p>
                            <div className='w-full border-b border-dashed border-base-300'></div>
                        </div>
                        <InformationCardUpdated
                            firstItemType='gray'
                            containerClassName='pb-0 shadow-none border-0'
                            data={[
                                {
                                    label: 'Email',
                                    info: user?.email,
                                    infoClassName: 'break-long-word w-[80%]',
                                    labelClassName: 'w-[20%]',
                                },
                                {
                                    label: 'Mobile',
                                    info: (
                                        <div className='flex gap-2 justify-end'>
                                            {user?.mobile ? (
                                                <>
                                                    <div data-title='mobile_edit'>
                                                        <PenLine
                                                            size={16}
                                                            onClick={() => {
                                                                openProfileMobileVerify();
                                                            }}
                                                            className='cursor-pointer link'
                                                        />
                                                    </div>
                                                    +{user?.dialing_code}
                                                    {user?.mobile}
                                                </>
                                            ) : (
                                                <div className='flex flex-col gap-1'>
                                                    <span
                                                        className='link link-hover'
                                                        onClick={() => {
                                                            openProfileMobileVerify();
                                                        }}
                                                    >
                                                        +Add Mobile Number
                                                    </span>
                                                    <span className='text-xs animate-pulse text-warning'>
                                                        ⚠️ Mobile number is
                                                        required for account
                                                        verification
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>

                <AnimatedTabs
                    tabs={tab_items}
                    containerClassName='h-full w-full overflow-x-auto'
                    contentContainerClass='p-0 overflow-x-auto'
                    active={tab}
                />
            </div>
        </Container>
    );
};

const PendingBusinessComponent = ({
    invitations,
    handleAcceptUser,
    handleRejectUser,
    userRoles,
}: any) => {
    const [showRole, setShowRole] = useState<any>([]);

    const insertShowRole = useCallback(
        (id: number) => {
            if (showRole.includes(id)) return;
            setShowRole((prev) => [...prev, id]);
        },
        [showRole]
    );
    const BadgeRole = useCallback(
        ({ role_ids, roles }: any) => {
            return (
                <div className='flex-wrap gap-2 items-center row-flex'>
                    {IsEmptyArray(roles) ? (
                        <>
                            {role_ids?.map((role_id) => {
                                const role = GetObjectFromArray(
                                    userRoles,
                                    'id',
                                    role_id
                                );
                                if (!role?.name) return null;

                                return (
                                    <Badge
                                        appearance='secondary'
                                        key={role?.id}
                                        label={role?.name}
                                        size='sm'
                                    />
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {roles?.map((role, key) => {
                                return (
                                    <Badge
                                        appearance='secondary'
                                        key={key}
                                        label={role}
                                        size='sm'
                                    />
                                );
                            })}
                        </>
                    )}
                </div>
            );
        },
        [userRoles]
    );

    const ShowRoles = useCallback(
        ({ item }: any) => {
            const role_ids = item?.role;
            const roles = item?.roles;

            if (showRole.includes(item.id))
                return <BadgeRole {...{ role_ids, roles }} />;

            const suffix = role_ids > 1 ? `Roles` : 'Role';
            return (
                <div
                    className='table-link'
                    onClick={() => insertShowRole(item?.id)}
                >
                    {role_ids?.length} {suffix}
                </div>
            );
        },
        [BadgeRole, insertShowRole, showRole]
    );

    const pending_invitation_props: TableProps = {
        column: [
            {
                key: 'business_name',
                name: 'Business Name',
                renderValue: (item: ObjectDto) => {
                    return (
                        <div className='gap-2 items-center row-flex'>
                            <Avatar
                                // source={user?.image_url}
                                alt={item?.name || 'F'}
                                shape='circle'
                                size='xs'
                                source={item?.image || ''}
                                imageWrapperClassName='!h-[30px] !w-[30px] rounded-full'
                            />
                            <span>{item?.name}</span>
                        </div>
                    );
                },
            },

            {
                key: 'role',
                name: 'Roles',
                renderValue: (item) => <ShowRoles {...{ item }} />,
            },
            {
                name: 'Added At',
                key: 'created_at',
                type: 'date_time',
            },
        ],
        data: invitations,
        rowAction: {
            menuActions: [
                {
                    name: 'Accept',
                    action: (item: ObjectDto) => handleAcceptUser(item?.id),
                    type: 'inner',
                },
                {
                    name: 'Reject',
                    action: (item: ObjectDto) => handleRejectUser(item?.id),
                    type: 'inner',
                    isCancel: true,
                },
            ],
        },
    };
    return <Table {...pending_invitation_props} rowNumbering={false} />;
};

const ActiveBusinessComponent = () => {
    const fetchAllBusinesses = async () => {
        const { response, success } = await FetchData({
            className: UserProfileController,
            method: 'getUserBusiness',
        });
        if (success) return response;
        return [];
    };

    const { data } = useQuery({
        queryFn: fetchAllBusinesses,
        queryKey: ['active_businesses'],
    });

    const activeBusinessesProps: TableProps = {
        column: [
            {
                key: 'name',
                name: 'Organization Name',
                renderValue: (item: ObjectDto) => {
                    return (
                        <div className='gap-3 items-center row-flex'>
                            <div className='flex items-center justify-center rounded h-8 w-8 bg-[#3F1C6C33] text-[#624686]'>
                                <Icon
                                    source={OrganizationSvgIcon}
                                    isSvg
                                    size={20}
                                />
                            </div>

                            <span>{item?.business.name}</span>
                        </div>
                    );
                },
            },
            {
                name: 'Active',
                key: 'active',
                type: 'activate_badge',
            },
            {
                name: 'Created At',
                key: 'created_at',
                type: 'date_time',
            },
        ],
        data: data,
    };

    return <Table {...activeBusinessesProps} rowNumbering={false} />;
};

export const hasVerified = (verified: boolean, className?: string) => {
    if (!verified) {
        return (
            <Icon
                source={UnVerifiedSvgIcon}
                isSvg
                iconColor='text-error'
                size={22}
            />
        );
    }
    return (
        <Icon
            source={TickMarkSvgIcon}
            isSvg
            iconColor='text-success'
            size={22}
        />
    );
};

export default UserProfile;

const ProfileImageViewer = ({ imageUrl }: any) => {
    return (
        <div className='flex justify-center items-center w-full h-full'>
            <img src={imageUrl} alt='Profile' className='object-contain' />
        </div>
    );
};

const RenameUserNameForm = ({
    data,
    callback,
}: {
    data?: ObjectDto;
    callback?: Function;
}) => {
    const formSchema = {
        name: {
            type: 'text',
            name: 'name',
            required: true,
            label: 'Name',
            placeholder: 'Enter  name',
        },
    };

    const apiSchema: ApiSchema = {
        controller: MetaUserController,
        method: 'UpdateUserName',
        onSuccess: () => {
            callback && callback();
            RefetchGenericListing();
            Toast.success({ description: 'Name successfully updated!' });
        },
    };

    return new ModalFormUtil(formSchema, apiSchema).process({
        modal_type: 'slidingPanel',
        title: `Rename User`,
        slidingPanelProps: {
            size: 'sm',
        },
        formBuilderProps: {
            layout: 'two-column',
        },
        initialValues: {
            name: data?.name,
        },
    });
};
