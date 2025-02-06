import { useMemo, useRef } from 'react';

import {
    HOME_ROUTE,
    useFetchParams,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Breadcrumbs,
    Button,
    Container,
    PageLoader,
} from '@finnoto/design-system';

import YourTemplateEditor from './components/YourTemplateEditor.component';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';

export default function YourTemplateCreationModule() {
    const ref = useRef<any>(null);

    const { id } = useFetchParams();
    const { onSubmit, isLoading, defaultData, isFetched } =
        useHandleTemplate(id);

    const isDisabled = useMemo(() => {
        return ref?.current?.disableSubmit;
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
                        onClick={() => {
                            return ref?.current?.handleSubmit?.();
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
