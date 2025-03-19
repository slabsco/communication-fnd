import { HOME_ROUTE } from '@finnoto/core';
import { ArcBreadcrumbs, Button } from '@finnoto/design-system';

import { FlowBuilderProvider } from './flowbuilder.context';
import FlowBuilderMain from './flowbuilder.main';
import FlowBuilderPanel from './flowbuilder.panel';

const FlowBuilderModule = () => {
    return (
        <div className='flex overflow-hidden gap-3 items-center w-full h-content-screen'>
            <FlowBuilderProvider>
                <FlowBuilderPanel />

                <div className='overflow-hidden w-full h-full col-flex'>
                    <div className='p-3 rounded'>
                        <ArcBreadcrumbs
                            rightComponent={
                                <Button outline size='sm'>
                                    Save
                                </Button>
                            }
                            actions={[{ name: 'Export Json' }]}
                            mainClassName='rounded py-4 rounded-none pb-2'
                            title={'Configure Client'}
                            route={[
                                { name: 'Home', link: HOME_ROUTE },
                                { name: 'Flows' },
                            ]}
                        />
                    </div>
                    <FlowBuilderMain />
                </div>
            </FlowBuilderProvider>
        </div>
    );
};

export default FlowBuilderModule;
