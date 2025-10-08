import { useMemo } from 'react';

import {
    HOME_ROUTE,
    useFetchParams,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import {
    Breadcrumbs,
    Container,
    IsEmptyObject,
    PageLoader,
} from '@finnoto/design-system';

import { useHandleTemplate } from '../broadcast/your-templates/hooks/useHandleTemplate.hook';
import TemplateLayout from './components/template.layout';
import TemplateNavigationFooter from './components/template.navigation.footer';
import TemplateNavigationHeader from './components/template.navigation.header';
import TemplatePreviewComponent from './components/template.preview.component';
import TemplatePreviewComponentContainer from './components/template.preview.component';
import { TemplateProvider } from './template.context';

const TemplateModule = () => {
    const { id } = useFetchParams();
    const { response, isLoading } = useHandleTemplate(id);

    const routes = useMemo(() => {
        return [
            { name: 'Home', link: HOME_ROUTE },
            {
                name: 'Templates',
                link: WHATSAPP_TEMPLATE_LIST_ROUTE,
            },
            {
                name: 'Create Template',
            },
        ];
    }, []);

    if (isLoading) return <PageLoader />;
    if (id && IsEmptyObject(response)) return;

    return (
        <TemplateProvider
            edit_data={
                !IsEmptyObject(response) && {
                    ...response?.attributes,
                    ...response?.template_config,
                    language: response?.language?.name,
                    category: response?.category?.name?.toUpperCase(),
                }
            }
        >
            <div className='overflow-hidden relative gap-3 p-7 col-flex h-content-screen'>
                <Breadcrumbs route={routes} />
                <div className='flex overflow-hidden flex-1 gap-4'>
                    <div className='overflow-hidden flex-1 gap-2 col-flex'>
                        <TemplateNavigationHeader />
                        <TemplateLayout />
                        <TemplateNavigationFooter />
                    </div>
                    <TemplatePreviewComponentContainer />
                </div>
            </div>
        </TemplateProvider>
    );
};

export default TemplateModule;
