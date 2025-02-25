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
} from '@finnoto/core';
import {
    cn,
    CommentConfirmUtil,
    ConfirmUtil,
    Modal,
    ModalWrapper,
    PageLoader,
    SlidingPane,
    SlidingPaneWrapper,
    ThemeCustomizer,
    Toast,
} from '@finnoto/design-system';

import AdminWrapper from '@Components/AdminWrappers/adminWrapper.component';
import EmployeeExpenseWrapper from '@Components/AdminWrappers/Expense/EmployeeWrapper/employeeExpenseWrapper.component';
import FinopsExpenseWrapper from '@Components/AdminWrappers/Expense/FinopsWrapper/finopsExpenseWrapper.component';
import VendorExpenseWrapper from '@Components/AdminWrappers/Expense/VendorWrapper/vendorExpenseWrapper.component';
import formBuilderElements from '@Components/formBuilderElements/formBuilderElements.component';
import API_CONSTANTS from '@Constants/api.constants';
import * as Functions from '@Utils/functions.utils';
import * as SessionStorage from '@Utils/sessionStorage.utils';
import { InitializeSessionStorageUtils } from '@Utils/sessionStorage.utils';

import '@finnoto/design-system/src/styles.scss';
import 'cropperjs/dist/cropper.css';
import 'react-toastify/dist/ReactToastify.min.css';
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
        <div className={cn('root', rubik.variable, jost.variable)}>
            <Head>
                <title>Finnoto</title>
                <meta
                    name='viewport'
                    content='width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
                />
                {/* <script
                    async
                    defer
                    crossOrigin='anonymous'
                    src='https://connect.facebook.net/en_US/sdk.js'
                ></script> */}
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

    if (typeof window !== 'undefined') {
        InitializeStorageUtils({ engine: localStorage });
        InitializeSessionStorageUtils({ engine: sessionStorage });
    }

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
            <ToastContainer />
        </AppProvider>
    );
};
