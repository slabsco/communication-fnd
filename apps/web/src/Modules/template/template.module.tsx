import { useMemo } from 'react';

import { HOME_ROUTE, WHATSAPP_TEMPLATE_LIST_ROUTE } from '@finnoto/core';
import { Breadcrumbs, Container } from '@finnoto/design-system';

import TemplateNavigationFooter from './components/template.navigation.footer';
import TemplateNavigationHeader from './components/template.navigation.header';
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
            <Container className='relative gap-3 py-4 h-content-screen col-flex'>
                <Breadcrumbs route={routes} />
                <TemplateNavigationHeader />
                <div className='flex flex-1 gap-3 items-center'></div>
                <TemplateNavigationFooter />
            </Container>
        </TemplateProvider>
    );
};

export default TemplateModule;
