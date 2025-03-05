'use client';

import Link from 'next/link';
import { ColorMode } from 'react-terminal-ui';

import {
    CopyToClipBoard,
    HOME_ROUTE,
    useClientConfig,
    useLogs,
    useOpenProperties,
} from '@finnoto/core';
import { ClientConfigController } from '@finnoto/core/src/backend/communication/controller/client.config.controller';
import {
    ArcBreadcrumbs,
    Button,
    cn,
    ConfirmUtil,
    Container,
    DropdownMenu,
    FormBuilder,
    Icon,
    IconButton,
    InputField,
    Loading,
    Modal,
    ModalBody,
    ModalContainer,
} from '@finnoto/design-system';

import LogTerminal from '../../Components/LogTerminal/logTerminal.component';

import {
    CopyPaperSvgIcon,
    InfoCircleSvgIcon,
    MoreIcon,
    WarningErrorSvgIcon,
} from 'assets';

const ClientConfigModule = () => {
    const {
        changeStatus,
        clientSecrets,
        clientSecretsLoading,
        generateSecret,
    } = useClientConfig();

    const [fileUrl] = useOpenProperties('external.api.collection.url');

    const openConfirmModal = (initialData: any) => {
        Modal.open({
            component: GenerateSecret,
            props: { generateSecret, initialData },
        });
    };
    return (
        <Container className='overflow-hidden gap-3 py-5 col-flex h-content-screen'>
            <ArcBreadcrumbs
                mainClassName='rounded py-4 rounded-none pb-2'
                title={'Configure Client'}
                route={[
                    { name: 'Home', link: HOME_ROUTE },
                    { name: 'Developers' },
                    { name: 'Client Config' },
                ]}
            />
            <div className='flex-1 gap-4 p-4 rounded col-flex bg-polaris-bg-surface'>
                <div>
                    <div className='flex gap-3 justify-between items-center'>
                        <h2 className='text-2xl font-medium'>
                            App Credentials
                        </h2>
                        <Button
                            appearance='primary'
                            outline
                            onClick={() => openLogModal()}
                        >
                            View Api Log
                        </Button>
                    </div>
                    <p className='text-base-secondary'>
                        These credentials allow your app to access the system
                        API. They are secret. Please do not share your app
                        credentials with anyone, include them in public code
                        repositories, or store them in insecure ways.
                    </p>
                    <div className='flex gap-2 items-center'>
                        <Button className='mt-2' onClick={openConfirmModal}>
                            Generate Secret
                        </Button>
                        <Link href={(fileUrl as string) || '#'} target='_blank'>
                            <Button className='mt-2' outline>
                                Download API Collection
                            </Button>
                        </Link>
                    </div>
                </div>

                {clientSecretsLoading ? (
                    <div className='flex items-center justify-center min-h-[500px]'>
                        <Loading color='primary' size='xl' />
                    </div>
                ) : (
                    <div className='grid grid-cols-3 gap-3'>
                        {clientSecrets?.map((val) => {
                            return (
                                <div
                                    key={val?.id}
                                    className='gap-2 p-3 rounded border transition-all col-flex hover:shadow'
                                >
                                    <div className='flex gap-2 items-center'>
                                        <h3 className='flex flex-1 gap-2 items-center text-lg font-medium'>
                                            {val?.name}{' '}
                                            <p
                                                className={cn(
                                                    'w-3 h-3 rounded-full bg-polaris-bg-fill-success animate-pulse',
                                                    {
                                                        'bg-error':
                                                            !val?.active,
                                                    }
                                                )}
                                            ></p>
                                        </h3>

                                        <DropdownMenu
                                            actions={[
                                                {
                                                    name: 'Change Name',
                                                    action: () =>
                                                        openConfirmModal(val),
                                                },
                                                {
                                                    name: 'Inactive',
                                                    action: () => {
                                                        changeStatus({
                                                            id: val?.id,
                                                            currentStatus:
                                                                val?.active,
                                                        });
                                                    },
                                                    isCancel: true,
                                                    visible: val?.active,
                                                },
                                                {
                                                    name: 'Active',
                                                    action: () =>
                                                        changeStatus({
                                                            id: val?.id,
                                                            currentStatus:
                                                                val?.active,
                                                        }),
                                                    isSuccess: true,
                                                    visible: !val?.active,
                                                },
                                            ]}
                                            className='gap-2 mt-2'
                                        >
                                            <IconButton
                                                icon={MoreIcon}
                                                appearance='polaris-transparent'
                                            />
                                        </DropdownMenu>
                                    </div>
                                    <div className='gap-2 col-flex'>
                                        <InputField
                                            label='Client ID'
                                            disabled
                                            value={val?.identifier}
                                            suffix={
                                                <IconButton
                                                    name='Copy Client Id'
                                                    icon={CopyPaperSvgIcon}
                                                    size='md'
                                                    appearance='base'
                                                    onClick={() => {
                                                        CopyToClipBoard(
                                                            val?.identifier
                                                        );
                                                    }}
                                                />
                                            }
                                        />
                                        <InputField
                                            label='Client Secret'
                                            disabled
                                            type='password'
                                            value={val?.credential}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default ClientConfigModule;

const GenerateSecret = ({
    generateSecret,
    initialData,
}: {
    generateSecret: any;
    initialData: any;
}) => {
    const schema = {
        name: {
            type: 'text',
            placeholder: 'Enter the Name of the secret here',
            required: true,
        },
    };

    const handleSubmit = async (values: any) => {
        const data = await generateSecret({ ...values, id: initialData?.id });
        const credentials = data?.credential;

        ConfirmUtil({
            message: (
                <div className='gap-4 col-flex'>
                    <div className='relative mx-auto w-14 h-14 rounded-full bg-warning'>
                        <Icon
                            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                            source={WarningErrorSvgIcon}
                            size={20}
                            isSvg
                            iconColor='text-warning'
                        />
                    </div>
                    <p>
                        On clicking Copy, your credentials will be copied to
                        your clipboard. You can only view them once - they will
                        be hidden after closing this dialog.
                    </p>
                    <InputField width={'100%'} disabled value={credentials} />
                </div>
            ),
            title: 'Here is your Secret!!',
            confirmText: 'Copy',
            confirmAppearance: 'success',
            cancelAppearance: 'errorHover',
            cancelText: 'Close',
            onConfirmPress: () => {
                CopyToClipBoard(credentials);
            },
        });
    };
    return (
        <ModalContainer title='Manage Secret'>
            <ModalBody>
                {!initialData && (
                    <div className='flex gap-3 items-center p-3 mb-2 rounded bg-info/40'>
                        <Icon source={InfoCircleSvgIcon} isSvg />
                        <p className='text-sm'>
                            Generate a new client ID and client secret for API
                            authentication. This will allow your application to
                            securely access our services.
                        </p>
                    </div>
                )}

                <FormBuilder
                    formSchema={schema}
                    initValues={initialData}
                    onSubmit={handleSubmit}
                    buttonLabel='Generate'
                />
            </ModalBody>
        </ModalContainer>
    );
};

const LogModal = () => {
    const { logs, isLoading } = useLogs({ controller: ClientConfigController });

    if (isLoading)
        return (
            <div className='min-h-[500px] min-w-[500px] centralize'>
                <Loading color='primary' />;
            </div>
        );

    const items = logs.map((val) => {
        return {
            type: 'log',
            time: new Date(val?.created_at),
            message: `${val?.request?.url} /${val?.request?.method}`,
            dropdownComponent: (
                <div className='mt-2'>
                    <h2 className='text-info'>Request:</h2>
                    <ul className='list-item list-disc'>
                        {Object.entries(val?.request).map(([key, value]) => {
                            return (
                                <div key={key} className='flex'>
                                    {key}:{' '}
                                    <p className='whitespace-pre-line'>
                                        {JSON.stringify(value)}
                                    </p>
                                </div>
                            );
                        })}
                    </ul>
                    <h2 className='mt-2 text-success'>Response</h2>
                    <ul className='list-item list-disc'>
                        {Object.entries(val?.response).map(([key, value]) => {
                            return (
                                <div key={key} className='flex'>
                                    {key}:{' '}
                                    <p className='whitespace-pre-line'>
                                        {JSON.stringify(value)}
                                    </p>
                                </div>
                            );
                        })}
                    </ul>
                </div>
            ),
        };
    });
    return <LogTerminal theme={ColorMode.Dark} items={items} />;
};

const openLogModal = () => {
    Modal.open({ component: LogModal, modalSize: 'lg' });
};
