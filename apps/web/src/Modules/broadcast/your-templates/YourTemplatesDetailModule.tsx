import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';

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
import {
    WhatsappTemplateCategoryEnum,
    WhatsappTemplateStatusEnum,
} from './enums/whatsapp.template.category.enum';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';

import { CopySvgIcon, DeleteSvgIcon, EditSvgIcon } from 'assets';

const YourTemplatesDetailModule = () => {
    const { id } = useFetchParams();
    const { defaultData, response } = useHandleTemplate(+id);
    const { deleteTemplate } = useHandleTemplate();

    useEffect(() => {
        if (response?.status_id !== WhatsappTemplateStatusEnum.REJECTED) return;
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

    const isEditAble = useMemo(() => {
        if (
            response.category_id === WhatsappTemplateCategoryEnum.AUTHENTICATION
        )
            return false;
        return [
            WhatsappTemplateStatusEnum.REJECTED,
            WhatsappTemplateStatusEnum.APPROVED,
            WhatsappTemplateStatusEnum.PAUSED,
        ].includes(response.status_id);
    }, [response.category_id, response.status_id]);

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
                    label={`${response?.status?.name} (View Only mode)`}
                    appearance={
                        isRejected
                            ? 'error'
                            : response?.status_id ===
                              WhatsappTemplateStatusEnum.PENDING
                            ? 'info'
                            : 'success'
                    }
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
                                name: 'Edit',
                                key: 'edit',
                                icon: EditSvgIcon,
                                visible: isEditAble,
                                action: () => {
                                    Navigation.navigate({
                                        url: `${WHATSAPP_TEMPLATE_CREATION_ROUTE}?id=${id}`,
                                    });
                                },
                            },
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
                onSubmit={async () => {}}
            />
        </Container>
    );
};

export default YourTemplatesDetailModule;
