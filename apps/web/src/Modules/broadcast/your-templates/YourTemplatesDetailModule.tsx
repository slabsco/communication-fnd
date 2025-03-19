import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

import {
    HOME_ROUTE,
    Navigation,
    useFetchParams,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Badge,
    Breadcrumbs,
    Button,
    Container,
    Toast,
} from '@finnoto/design-system';

import YourTemplateEditor from './components/YourTemplateEditor.component';
import { WhatsappTemplateStatusEnum } from './enums/whatsapp.template.category.enum';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';

const YourTemplatesDetailModule = () => {
    const { id } = useFetchParams();
    const { defaultData, response } = useHandleTemplate(+id);

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
                <Button
                    className='flex gap-2 items-center'
                    onClick={() => {
                        Navigation.back();
                    }}
                >
                    <ArrowLeft size={18} /> Go Back
                </Button>
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
