import { useMemo, useRef } from 'react';

import {
    HOME_ROUTE,
    useFetchParams,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Breadcrumbs,
    Button,
    ConfirmUtil,
    Container,
    PageLoader,
} from '@finnoto/design-system';

import YourTemplateEditor from './components/YourTemplateEditor.component';
import { WhatsappTemplateStatusEnum } from './enums/whatsapp.template.category.enum';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';

export default function YourTemplateCreationModule() {
    const ref = useRef<any>(null);

    const { id, is_duplicate } = useFetchParams();
    const { onSubmit, isLoading, defaultData, isFetched } = useHandleTemplate(
        id,
        { is_duplicate: Boolean(is_duplicate) }
    );

    const isDisabled = useMemo(() => {
        return ref?.current?.disableSubmit;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref?.current?.disableSubmit]);

    if (isLoading) return <PageLoader />;

    return (
        <Container className='flex overflow-hidden relative flex-col gap-5 py-6 h-content-screen'>
            <div className='flex justify-between items-center'>
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
                <div className='flex gap-4 justify-end items-center'>
                    {/* <Button appearance='secondary' outline>
                        Save as Draft
                    </Button> */}
                    <Button
                        key={ref?.current}
                        disabled={isDisabled}
                        appearance={'primary'}
                        progress
                        onClick={async (next) => {
                            if (
                                defaultData?.status_id ===
                                WhatsappTemplateStatusEnum.APPROVED
                            ) {
                                return ConfirmUtil({
                                    isReverseAction: true,
                                    appearance: 'warning',
                                    isArc: true,
                                    title: 'Edit Template !!',
                                    onConfirmPress: async () => {
                                        await ref?.current?.handleSubmit?.();
                                        next();
                                    },
                                    message:
                                        'Are you sure want to edit the template ?. this action is irreversible, this might effect your current flow with the chatbot and other actions. We recommend you to create the new template instead',
                                });
                            }
                            await ref?.current?.handleSubmit?.();
                            next();
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </div>

            {isFetched ? ( // For Edit
                <YourTemplateEditor
                    key={defaultData?.name}
                    defaultValues={defaultData}
                    onSubmit={onSubmit}
                    ref={ref}
                />
            ) : (
                <YourTemplateEditor
                    onSubmit={onSubmit}
                    key={defaultData?.name}
                    ref={ref}
                />
            )}
        </Container>
    );
}
