import { useMemo } from 'react';

import { HOME_ROUTE, WHATSAPP_TEMPLATE_LIST_ROUTE } from '@finnoto/core';
import { Breadcrumbs, Container } from '@finnoto/design-system';

import TemplateLayout from './components/template.layout';
import TemplateNavigationFooter from './components/template.navigation.footer';
import TemplateNavigationHeader from './components/template.navigation.header';
import TemplatePreviewComponent from './components/template.preview.component';
import { TemplateProvider } from './template.context';

const TemplateModule = () => {
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

    return (
        <TemplateProvider>
            <Container className='overflow-hidden relative gap-3 py-4 col-flex h-content-screen'>
                <Breadcrumbs route={routes} />
                <div className='flex overflow-hidden flex-1 gap-4'>
                    <div className='overflow-hidden flex-1 gap-2 col-flex'>
                        <TemplateNavigationHeader />
                        <TemplateLayout />
                        <TemplateNavigationFooter />
                    </div>
                    <TemplatePreviewComponent />
                </div>
            </Container>
        </TemplateProvider>
    );
};

export default TemplateModule;
