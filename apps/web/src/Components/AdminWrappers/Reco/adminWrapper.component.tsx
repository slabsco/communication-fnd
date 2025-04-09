'use client';

import { useApp, useMenu } from '@finnoto/core';
import { cn, Sidebar } from '@finnoto/design-system';

import { SpotlightSearch } from '@Components/Spotlight/spotlightSearch.component';

import { SocketProvider } from '../../../Utils/socket/socket.context.main';
import ArcHeader from '../Components/arc.header.component';

const AdminWrapper = ({ children }: any) => {
    const { modules, bottomModules } = useMenu();
    const { isSidebarExpand } = useApp();

    return (
        <main className='dashboard full-width-topnav arc-portal'>
            <ArcHeader />

            <div className='relative flex-1 row-flex'>
                <Sidebar
                    menus={modules}
                    bottomMenus={bottomModules}
                    hideBanner
                    showArcHamburger
                />
                <article
                    className={cn('relative dashboard-content', {
                        expanded: isSidebarExpand,
                    })}
                >
                    <SocketProvider>{children}</SocketProvider>
                </article>
            </div>
            {/* <GlobalActivityLog /> */}
            <SpotlightSearch menus={[...modules, ...bottomModules]} />
        </main>
    );
};

export default AdminWrapper;
