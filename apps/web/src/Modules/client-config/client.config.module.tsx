'use client';

import { HOME_ROUTE, useClientConfig } from '@finnoto/core';
import {
    ArcBreadcrumbs,
    Button,
    cn,
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
import { InputPassword } from '@finnoto/design-system/src/Components/Inputs/InputField/input.password.component';

import { InfoCircleSvgIcon, MoreIcon } from 'assets';

const ClientConfigModule = () => {
    const {
        changeStatus,
        clientSecrets,
        clientSecretsLoading,
        generateSecret,
    } = useClientConfig();

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
                    <h2 className='text-2xl font-medium'>App Credentials</h2>
                    <p className='text-base-secondary'>
                        These credentials allow your app to access the system
                        API. They are secret. Please do not share your app
                        credentials with anyone, include them in public code
                        repositories, or store them in insecure ways.
                    </p>
                    <Button className='mt-2' onClick={openConfirmModal}>
                        Generate Secret
                    </Button>
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
                                        />
                                        <InputPassword
                                            label='Client Secret'
                                            disabled
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
        await generateSecret({ ...values, id: initialData?.id });
        Modal.close();
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
