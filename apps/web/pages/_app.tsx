import { AppProps } from 'next/app';
import { Jost, Rubik } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import {
    StoreEvent,
    SubscribeToEvent,
    UnsubscribeEvent,
} from 'state-manager-utility';
import {
    GetItem,
    GetItemAsync,
    InitializeStorageUtils,
    RemoveItem,
    SetItem,
} from 'storage-utility';

import {
    AppProvider,
    AuthProvider,
    InitLibrary,
    InitUI,
    Navigation,
    useCustomEffect,
} from '@finnoto/core';
import {
    cn,
    CommentConfirmUtil,
    ConfirmUtil,
    formBuilderElements,
    Modal,
    ModalWrapper,
    PageLoader,
    SlidingPane,
    SlidingPaneWrapper,
    ThemeCustomizer,
    Toast,
} from '@finnoto/design-system';

import ArcAdminWrapper from '@Components/AdminWrappers/ARC/arcAdminWrapper.component';
import EmployeeExpenseWrapper from '@Components/AdminWrappers/Expense/EmployeeWrapper/employeeExpenseWrapper.component';
import FinopsExpenseWrapper from '@Components/AdminWrappers/Expense/FinopsWrapper/finopsExpenseWrapper.component';
import VendorExpenseWrapper from '@Components/AdminWrappers/Expense/VendorWrapper/vendorExpenseWrapper.component';
import AdminWrapper from '@Components/AdminWrappers/Reco/adminWrapper.component';
import API_CONSTANTS from '@Constants/api.constants';
import * as Functions from '@Utils/commonFunction.utils';
import * as SessionStorage from '@Utils/sessionStorage.utils';
import { InitializeSessionStorageUtils } from '@Utils/sessionStorage.utils';

import '@finnoto/design-system/src/styles.scss';
import 'cropperjs/dist/cropper.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'reactflow/dist/style.css';
import '../src/Styles/global.scss';

import { useSearchParams } from 'next/navigation';

const UATBanner = Functions.loadDynamicPage(
    () => import('@Components/UATBanner/uatBanner.component'),
    false,
    false
);

let globalModalRef: any;
let globalSlidingPaneRef: any;

const rubik = Rubik({
    subsets: ['latin'],
    display: 'swap',
    variable: '--rubik',
    weight: ['300', '400', '500', '600', '700', '800', '900'],
});
const jost = Jost({
    subsets: ['latin'],
    display: 'swap',
    variable: '--jost',
    weight: ['200', '500'],
});

InitLibrary({
    env: API_CONSTANTS,
    apiHost: API_CONSTANTS.ROUTE_URL,
    StateManager: { SubscribeToEvent, StoreEvent, UnsubscribeEvent },
    StorageUtility: { GetItem, SetItem, RemoveItem, GetItemAsync },
    SessionStorageUtility: SessionStorage,
    version_id: API_CONSTANTS.VERSION_ID,
    platform_id: API_CONSTANTS.PLATFORM_ID,
});

InitUI({
    adminWrapperComponent: AdminWrapper,
    arcAdminWrapperComponent: ArcAdminWrapper,
    expenseWrapperComponents: {
        vendor: VendorExpenseWrapper,
        employee: EmployeeExpenseWrapper,
        finops: FinopsExpenseWrapper,
    },
    pageLoaderComponent: PageLoader,
    formElementsComponent: formBuilderElements,
    functionMethods: Functions,
    themeCustomizerComponent: ThemeCustomizer,
    confirmUtilComponent: ConfirmUtil,
    commentConfirmUtilComponent: CommentConfirmUtil,
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={cn('root h-full', rubik.variable, jost.variable)}>
            <Head>
                <title>
                    DartInbox - Multi-Agent WhatsApp Inbox & Marketing
                    Automation
                </title>
                <meta
                    name='description'
                    content='Boost your business with DartInbox – a powerful multi-agent WhatsApp inbox and marketing tool. Automate messages, manage customer chats efficiently, and drive sales with WhatsApp marketing campaigns. Try it today!'
                />
            </Head>
            <RootApp component={Component} pageProp={pageProps} />
        </div>
    );
}

const RootApp = ({ component: Component, pageProps }: any) => {
    const navigationRef = useRouter();
    const urlSearchParams = useSearchParams();
    Navigation.getHistoryMethod({ ...navigationRef, urlSearchParams });

    useEffect(() => {
        Modal.register(globalModalRef);
        SlidingPane.register(globalSlidingPaneRef);
        Toast.register();

        return () => {
            Toast.unregister();
        };
    }, []);

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            (window as any).workbox !== undefined
        ) {
            const workbox = (window as any).workbox;

            const promptNewVersionAvailable = () => {
                workbox.addEventListener('controlling', () => {
                    Toast.info({
                        description: 'New Updates available. Please Reload',
                        toastId: 'new-updates-available',
                    });
                });
            };

            workbox.addEventListener('waiting', promptNewVersionAvailable);
            workbox.register();
        }
    }, []);

    useCustomEffect(() => {
        if (document?.body?.clientWidth < 1200) {
            let viewport;
            viewport = document?.querySelector('meta[name=viewport]');
            viewport?.setAttribute(
                'content',
                'width=device-width, initial-scale=0.8, user-scalable=0'
            );
        }
    });

    if (typeof window !== 'undefined') {
        InitializeStorageUtils({ engine: localStorage });
        InitializeSessionStorageUtils({ engine: sessionStorage });
    }
    // useRouteChange({
    //     onRouteChangeComplete: () => {
    //         Modal.closeAll();
    //         SlidingPane.closeAll();
    //     },
    // });

    return (
        <AppProvider>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>

            <UATBanner />
            <ModalWrapper
                ref={(ref) => {
                    globalModalRef = ref;
                }}
            />
            <SlidingPaneWrapper
                ref={(ref) => {
                    globalSlidingPaneRef = ref;
                }}
            />
            <ToastContainer className='ml-14' />
        </AppProvider>
    );
};
