import { BellIcon } from 'lucide-react';
import { useMemo } from 'react';

import {
    HOME_ROUTE,
    Navigation,
    useFetchParams,
    WHATSAPP_TEMPLATE_CREATION_ROUTE,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Breadcrumbs,
    ConfirmUtil,
    Container,
    FormatDisplayDateStyled,
    NoDataFound,
    PageLoader,
} from '@finnoto/design-system';

import DropdownActionButton from '../../Components/DropdownButton/dropdown.action.button';
import { TemplatePreviewer } from './components/template.preview.component';
import { WhatsappTemplateStatusEnum } from './constants/whatsapp.template.category.enum';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';

import { CopySvgIcon, DeleteSvgIcon } from 'assets';

const TemplateDetailModule = () => {
    const { id } = useFetchParams();

    const { isLoading, response: data, deleteTemplate } = useHandleTemplate(id);

    const routes = useMemo(() => {
        return [
            { name: 'Home', link: HOME_ROUTE },
            {
                name: 'Templates',
                link: WHATSAPP_TEMPLATE_LIST_ROUTE,
            },
            {
                name: 'Template detail',
            },
        ];
    }, []);

    if (isLoading) return <PageLoader />;

    return (
        <Container className='relative gap-3 p-7 col-flex'>
            <Breadcrumbs route={routes} />
            <div className='flex gap-4 items-center'>
                <TopBanner data={data} />
                <DropdownActionButton
                    actions={[
                        {
                            name: 'Duplicate',
                            key: 'duplicate',
                            icon: CopySvgIcon,
                            action: () => {
                                Navigation.navigate({
                                    url: `${WHATSAPP_TEMPLATE_CREATION_ROUTE}?id=${id}&is_duplicate=true`,
                                });
                            },
                        },

                        {
                            name: 'Delete',
                            key: 'delete',
                            action: () => {
                                ConfirmUtil({
                                    title: 'Do you want to delete?',
                                    message:
                                        'The action you are about to perform is irreversible.',
                                    icon: DeleteSvgIcon,
                                    isArc: true,
                                    onConfirmPress: async () => {
                                        const data = await deleteTemplate(id);
                                        if (data) Navigation.back();
                                    },
                                    appearance: 'error',
                                });
                            },
                            color: 'text-error',
                            isCancel: true,
                            icon: DeleteSvgIcon,
                        },
                    ]}
                />
            </div>

            <div className='flex flex-1 gap-4 items-start'>
                <div className='gap-3 col-flex'>
                    <TemplatePreviewer
                        state={{
                            ...data?.attributes,
                            ...data?.template_config,
                        }}
                    />
                    <div className='p-4 rounded col-flex bg-base-100'>
                        <h4 className='font-medium'>Top block reason</h4>
                        <p className='text-sm text-base-secondary'>
                            Last 30 days
                        </p>

                        <div className='mt-2 text-xl'>---</div>
                    </div>
                </div>
                <div className='grid flex-1 grid-cols-2 gap-4 w-full h-fit'>
                    <div className='p-4 rounded h-fit col-flex bg-base-100'>
                        <h4 className='font-medium'>Amount Spent</h4>
                        <div className='mt-2 text-xl'>---</div>
                    </div>
                    <div className='p-4 rounded h-fit col-flex bg-base-100'>
                        <h4 className='font-medium'>
                            Cost per message delivered
                        </h4>
                        <div className='mt-2 text-xl'>---</div>
                    </div>
                    <div className='col-span-2 p-4 rounded h-fit col-flex bg-base-100'>
                        <h4 className='font-medium'>Performance</h4>
                        <div className='mt-2'>
                            <NoDataFound
                                title='No insights available.'
                                description='Make sure the dates you selected includes a date this template was sent.'
                            />
                        </div>
                    </div>
                    <div className='col-span-2 p-4 rounded h-fit col-flex bg-base-100'>
                        <h4 className='font-medium'>Error messages</h4>
                        <div className='mt-2'>
                            <NoDataFound
                                title='No insights available.'
                                description='Make sure the dates you selected includes a date this template was sent.'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default TemplateDetailModule;

const TopBanner = ({ data }: any) => {
    return (
        <div className='flex flex-1 gap-4 items-center p-2 bg-base-100'>
            <div className='p-2 rounded bg-success text-success-content'>
                <BellIcon />
            </div>
            <div>
                <p className='flex gap-1 items-center text-lg font-medium'>
                    {data?.name || 'your_template_name'}
                    <span className='w-1 h-1 bg-black rounded-full'></span>
                    {data?.language?.name || 'English'}
                </p>
                <p className='flex gap-1 items-center text-sm text-base-secondary'>
                    {data?.status_id ===
                        WhatsappTemplateStatusEnum.APPROVED && (
                        <span className='text-success'>Approved</span>
                    )}
                    {data?.status_id ===
                        WhatsappTemplateStatusEnum.REJECTED && (
                        <span className='text-error'>Rejected</span>
                    )}
                    {data?.status_id === WhatsappTemplateStatusEnum.PENDING && (
                        <span className='text-info'>Pending</span>
                    )}

                    <span className='w-1 h-1 bg-gray-500 rounded-full'></span>
                    {data?.category?.name}
                    <span className='w-1 h-1 bg-gray-500 rounded-full'></span>
                    <FormatDisplayDateStyled value={data?.updated_at} />
                </p>
            </div>
        </div>
    );
};
