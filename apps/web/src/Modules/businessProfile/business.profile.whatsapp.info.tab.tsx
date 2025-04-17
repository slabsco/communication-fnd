import { AlertCircle, User2Icon } from 'lucide-react';
import Link from 'next/link';

import {
    FormatDisplayDate,
    getBusinessErrors,
    IsEmptyArray,
    useBusinessPreference,
    UserBusiness,
} from '@finnoto/core';
import {
    Badge,
    Button,
    cn,
    CommonFileUploader,
    FormBuilder,
    Icon,
    IconButton,
    IsFunction,
    Loading,
    Modal,
    ModalBody,
    ModalContainer,
    Tooltip,
} from '@finnoto/design-system';

import { EditSvgIcon, InfoCircleSvgIcon } from 'assets';

const BusinessProfileWhatsappInfoTab = () => {
    const {
        businessInfo,
        verifyNumber,
        whatsappProfileInfo,
        changeProfileData,
        changingProfile,
    } = useBusinessPreference();

    const businessUrl = UserBusiness.getBusinessAPIUrl();

    return (
        <div className='overflow-y-auto gap-3 px-3 py-5 w-full h-full col-flex'>
            {!businessInfo?.verified_at && (
                <div className='flex gap-2 items-center p-1 mb-3 rounded bg-error text-error-content'>
                    <Icon source={InfoCircleSvgIcon} isSvg />
                    <p className='flex-1 text-sm'>
                        Your business is not verified. Please verify your
                        business to access all features.
                    </p>
                    <Link
                        target='_blank'
                        href={'https://business.facebook.com/'}
                    >
                        <Button appearance='success' size='xs'>
                            Verify Your Business
                        </Button>
                    </Link>
                </div>
            )}
            <div className='flex relative mx-auto w-fit'>
                {!whatsappProfileInfo?.profile_picture_url ? (
                    <div className='overflow-hidden rounded-full cursor-pointer bg-base-200'>
                        <User2Icon size={100} className='text-gray-300' />
                    </div>
                ) : (
                    <div>
                        {/*  eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={whatsappProfileInfo.profile_picture_url}
                            alt='WhatsApp Profile'
                            className='object-cover w-24 h-24 rounded-full border-2 border-base-200'
                            onClick={() =>
                                window.open(
                                    whatsappProfileInfo.profile_picture_url,
                                    '_blank'
                                )
                            }
                        />
                    </div>
                )}

                <CommonFileUploader
                    is_multiple={false}
                    maxFiles={1}
                    endpoint={`${businessUrl}api/b/business-detail/upload-file`}
                    accept={{
                        'image/jpeg': [],
                        'image/png': [],
                    }}
                    onFileUpload={(files: any) => {
                        changeProfileData({
                            profile_picture_handle: files?.[0]?.serverUrl?.id,
                        });
                    }}
                >
                    {({ uploading }) => (
                        <div
                            className={cn(
                                'overflow-hidden absolute -top-2 -right-2 w-8 h-8 rounded-full cursor-pointer p-[2px] bg-base-100',
                                { 'cursor-not-allowed': uploading }
                            )}
                        >
                            {uploading || changingProfile ? (
                                <div className='p-1 rounded-full transition-all text-base-primary centralize bg-base-300 hover:bg-success hover:text-white'>
                                    <Loading size='sm' color='primary' />
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

            <div className='grid grid-cols-2 gap-3'>
                <DisplayCard
                    label={'Whatsapp Business Number'}
                    value={
                        <div className='flex gap-3 items-center'>
                            {businessInfo?.default_mobile || '-'}
                            {!businessInfo?.phone_registered_at && (
                                <Button
                                    onClick={async (next) => {
                                        await verifyNumber(
                                            businessInfo?.internal_number
                                        );
                                        next();
                                    }}
                                    progress
                                    size='xs'
                                    appearance='success'
                                >
                                    Connect Number
                                </Button>
                            )}
                            {businessInfo?.phone_registered_at && (
                                <Badge
                                    size='sm'
                                    appearance='info'
                                    label={`Connected at ${FormatDisplayDate(
                                        businessInfo?.phone_registered_at,
                                        true
                                    )}`}
                                />
                            )}
                        </div>
                    }
                />
                <DisplayCard
                    label={'Whatsapp Business Id'}
                    value={businessInfo?.internal_id}
                />
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <DisplayCard
                    label={'Messaging Limit'}
                    value={`${businessInfo?.total_message_limit} Contacts/24 Hours`}
                />
                <DisplayCard
                    label={'Quality Rating'}
                    value={businessInfo?.quality_response?.quality_rating}
                />
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <DisplayCard
                    label={'Whatsapp Business Name'}
                    value={businessInfo?.wa_display_name || '-'}
                />
                <DisplayCard
                    label={'Email'}
                    onEdit={() =>
                        openEditForm({
                            name: 'Email',
                            keyName: 'email',
                            type: 'email',
                            value: whatsappProfileInfo?.email,
                            handleSubmit: async (values) => {
                                await changeProfileData(values);
                                Modal.close();
                            },
                        })
                    }
                    value={whatsappProfileInfo?.email || '-'}
                />
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <DisplayCard
                    label={'About'}
                    onEdit={() =>
                        openEditForm({
                            name: 'About',
                            keyName: 'about',
                            type: 'textarea',
                            value: whatsappProfileInfo?.about,
                            handleSubmit: async (values) => {
                                await changeProfileData(values);
                                Modal.close();
                            },
                        })
                    }
                    value={whatsappProfileInfo?.about}
                />

                <DisplayCard
                    label={'Address'}
                    onEdit={() =>
                        openEditForm({
                            name: 'Address',
                            keyName: 'address',
                            type: 'text',
                            value: whatsappProfileInfo?.address,
                            handleSubmit: async (values) => {
                                await changeProfileData(values);
                                Modal.close();
                            },
                        })
                    }
                    value={whatsappProfileInfo?.address || '-'}
                />
            </div>

            <DisplayCard
                label={'Description'}
                onEdit={() =>
                    openEditForm({
                        name: 'description',
                        keyName: 'description',
                        type: 'textarea',
                        value: whatsappProfileInfo?.description,
                        handleSubmit: async (values) => {
                            await changeProfileData(values);
                            Modal.close();
                        },
                    })
                }
                value={whatsappProfileInfo?.description}
            />
        </div>
    );
};

export default BusinessProfileWhatsappInfoTab;

const DisplayCard = ({
    label,
    value,
    onEdit,
}: {
    label: any;
    value: any;
    onEdit?: () => void;
}) => {
    return (
        <div className='relative p-3 rounded border'>
            {IsFunction(onEdit) && (
                <IconButton
                    icon={EditSvgIcon}
                    appearance='polaris-transparent'
                    className='absolute top-2 right-2'
                    size='sm'
                    onClick={onEdit}
                />
            )}

            <p className='font-medium'>{label}</p>
            <span className='text-base-secondary'>{value}</span>
        </div>
    );
};

const openEditForm = (props) => {
    return Modal.open({ component: EditForm, modalSize: 'sm', props: props });
};

const EditForm = ({
    name,
    keyName,
    value,
    type = 'text',
    handleSubmit,
}: any) => {
    return (
        <ModalContainer title={`Update ${name}`}>
            <ModalBody>
                <FormBuilder
                    onSubmit={handleSubmit}
                    formSchema={{
                        [keyName]: {
                            type,
                            placeholder: `Enter ${name}`,
                        },
                    }}
                    initValues={{ [keyName]: value }}
                />
            </ModalBody>
        </ModalContainer>
    );
};

export const RenderBusinessError = ({ businessInfo }: any) => {
    const errors = getBusinessErrors(businessInfo);

    if (IsEmptyArray(errors)) return <></>;
    return errors.map((item, index) => (
        <BusinessErrorCard
            key={index}
            entityType={item.entity_type}
            errors={item.errors}
        />
    ));
};
const BusinessErrorCard = ({ entityType, errors }) => {
    if (entityType?.toLowerCase() === 'business') return <></>;
    return (
        <div className='p-4 w-full max-w-lg bg-white rounded-lg shadow-sm'>
            <h2 className='mb-2 text-lg font-semibold'>
                Error Entity Type: {entityType}
            </h2>

            {errors.map((error, index) => (
                <div key={index} className='space-y-3'>
                    <div className='flex gap-2 items-center'>
                        <Tooltip message={error.possible_solution}>
                            <AlertCircle className='mt-1 w-5 h-5 text-red-500 shrink-0' />
                        </Tooltip>
                        <div className='flex gap-2 items-start'>
                            <p className='text-red-500'>
                                {error.error_description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
