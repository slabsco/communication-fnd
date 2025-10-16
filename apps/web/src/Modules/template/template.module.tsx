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

import TemplateLayout from './components/template.layout';
import TemplateNavigationFooter from './components/template.navigation.footer';
import TemplateNavigationHeader from './components/template.navigation.header';
import TemplatePreviewComponentContainer from './components/template.preview.component';
import { TemplateConfigState } from './constants/template.config.reducer';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';
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

    const props = {
        defaultActiveState: !IsEmptyObject(response?.attributes?.active_step)
            ? { ...response?.attributes?.active_step }
            : undefined,
        edit_data: !IsEmptyObject(response)
            ? {
                  ...response?.template_config,
                  header_media_detail:
                      response?.attributes?.header_media_detail,
                  language: response?.language?.code,
                  category: response?.category?.name?.toUpperCase(),
              }
            : undefined,
        templateConfigState: {
            is_unsubscribe_template: response?.is_unsubscribe_template,
        } as TemplateConfigState,
    };

    return (
        <TemplateProvider {...props}>
            <Container className='overflow-hidden relative gap-3 p-5 col-flex h-content-screen'>
                <Breadcrumbs route={routes} />
                <div className='flex overflow-hidden flex-1 gap-4'>
                    <div className='overflow-hidden flex-1 gap-2 col-flex'>
                        <TemplateNavigationHeader />
                        <TemplateLayout />
                        <TemplateNavigationFooter />
                    </div>
                    <TemplatePreviewComponentContainer />
                </div>
            </Container>
        </TemplateProvider>
    );
};

export default TemplateModule;
