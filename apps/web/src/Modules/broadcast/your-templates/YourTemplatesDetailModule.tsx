import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

import {
    HOME_ROUTE,
    Navigation,
    useFetchParams,
    WHATSAPP_TEMPLATE_CREATION_ROUTE,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Badge,
    Breadcrumbs,
    Button,
    ConfirmUtil,
    Container,
    Toast,
} from '@finnoto/design-system';

import DropdownActionButton from '../../../Components/DropdownButton/dropdown.action.button';
import YourTemplateEditor from './components/YourTemplateEditor.component';
import { WhatsappTemplateStatusEnum } from './enums/whatsapp.template.category.enum';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';

import { CopySvgIcon, DeleteSvgIcon } from 'assets';

const YourTemplatesDetailModule = () => {
    const { id } = useFetchParams();
    const { defaultData, response } = useHandleTemplate(+id);
    const { deleteTemplate } = useHandleTemplate();

    useEffect(() => {
        const log = response?.log || response?.logs;

        const last = log?.length;
        const error = log?.[last - 1]?.response?.error;
        if (!error) return;

        Toast.error({
            title: error?.error_user_title,
            description: error?.error_user_msg,
            position: 'top-center',
            progress: 1,
            closeButton: true,
            withBorder: true,
            className: 'w-[400px]',
        });

        return () => {
            Toast.dismissAll();
        };
    }, [response]);

    const isRejected =
        response?.status_id === WhatsappTemplateStatusEnum.REJECTED;

    return (
        <Container className='overflow-hidden gap-5 p-5 col-flex h-content-screen'>
            <Breadcrumbs
                route={[
                    { name: 'Home', link: HOME_ROUTE },
                    {
                        name: 'Your Templates',
                        link: WHATSAPP_TEMPLATE_LIST_ROUTE,
                    },
                    {
                        name: 'Your Templates Detail',
                    },
                ]}
            />
            <div className='flex gap-3 justify-between items-center'>
                <Badge
                    label={`${response?.status?.name} (You cannot Edit, or delete the
                        template once it is send for the processing, please
                        create the new one to proceeded)`}
                    appearance={isRejected ? 'error' : 'success'}
                />
                <div className='flex gap-2 items-center'>
                    <Button
                        outline
                        className='flex gap-2 items-center'
                        size='sm'
                        onClick={() => {
                            Navigation.back();
                        }}
                    >
                        <ArrowLeft size={18} /> Go Back
                    </Button>
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
                                            const data = await deleteTemplate(
                                                id
                                            );
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
            </div>
            <YourTemplateEditor
                key={defaultData?.name}
                defaultValues={defaultData}
                // onSubmit={() => {}}
            />
        </Container>
    );
};

export default YourTemplatesDetailModule;
