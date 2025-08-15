import {
    ARC_CUSTOMER_DETAIL_ROUTE,
    ARC_CUSTOMER_PAYMENT_DETAIL_ROUTE,
    ARC_DEBIT_NOTE_LIST_ROUTE,
    ARC_DISPUTE_DETAIL_ROUTE,
    ARC_INVOICE_DETAILS_ROUTE,
    ArcSourceHash,
    CALL_REMINDER_DETAIL_ROUTE,
    PRODUCT_IDENTIFIER,
    PROMISE_TO_PAY_DETAIL_VIEW,
    SOURCEHASH,
} from '../Constants';
import { SourceDetailObj } from '../Types';
import { ExpenseRouteUtils } from './expenseRoute.utils';
import { Navigation } from './navigation.utils';
import { Functions } from './ui.utils';

export const openSourceDetails = (
    id: number,
    source_hash: string,
    navigate = false,
    options?: { product_id: PRODUCT_IDENTIFIER }
) => {
    const { product_id } = options || {};
    const source_details: any = getSourceDetails(source_hash);

    if (!source_details && !source_details.action)
        return console.error('fn: openSourceDetails - source not found!', {
            payload: { id, source_hash },
        });

    if (product_id === PRODUCT_IDENTIFIER.RECO)
        return source_details.action(id);

    if (!navigate) return source_details.action(id);

    Navigation.navigate({ url: `${source_details.path}/${id}` });
};

export const getSourceDetails = (source_hash: string): SourceDetailObj => {
    const { pathname } = Navigation.currentRoute();

    const isAr = ExpenseRouteUtils.CheckARRoute(pathname);
    const isFinops = ExpenseRouteUtils.GetPortalType(pathname) === 'finops';

    switch (source_hash) {
        case SOURCEHASH.orderItem:
            return {
                name: 'Order Item',
                key: 'order_item',
                // controller: PAYMENT_CONTROLLER_ROUTER['item'],
                // action: Functions.openItemDetail,
            };

        case SOURCEHASH.user:
            return {
                name: 'User',
                key: 'user',
                action: Functions.openArUserDetailsModal,
            };
        case SOURCEHASH.paymentMode:
            return {
                name: 'Payment Mode',
                key: 'payment_mode',
            };
        case ArcSourceHash.invoice:
            return {
                name: 'Invoice',
                key: 'invoice',
                path: ARC_INVOICE_DETAILS_ROUTE,
                action: Functions.openInvoiceDetailModal,
            };
        case ArcSourceHash.dcNote:
            return {
                name: 'Debit Credit Note',
                key: 'dc_note',
                path: ARC_DEBIT_NOTE_LIST_ROUTE,
                action: Functions.openNoteDetailModal,
            };
        case ArcSourceHash.payment:
            return {
                name: 'Payment',
                key: 'payment',
                path: ARC_CUSTOMER_PAYMENT_DETAIL_ROUTE,
                action: Functions.openInvoicePaymentDetailModal,
            };
        case ArcSourceHash.p2p:
            return {
                name: 'Promise to pay',
                key: 'p2p',
                path: PROMISE_TO_PAY_DETAIL_VIEW,
                action: Functions.openPromiseToPayDetailModal,
            };
        case ArcSourceHash.ticket:
            return {
                name: 'Ticket',
                key: 'ticket',
                path: ARC_DISPUTE_DETAIL_ROUTE,
                action: Functions.openTicketDetailModal,
            };
        case ArcSourceHash.reminder:
            return {
                name: 'Call Reminder',
                key: 'reminder',
                path: CALL_REMINDER_DETAIL_ROUTE,
                action: Functions.openCallReminderDetailModal,
            };
        case ArcSourceHash.customer:
            return {
                name: 'Customer',
                key: 'customer',
                path: ARC_CUSTOMER_DETAIL_ROUTE,
                action: Functions.openCustomerDetailModal,
            };

        case SOURCEHASH.paymentMode:
            return {
                name: 'Payment Mode',
                key: 'payment_mode',
            };
        default:
            return { name: 'Unknown' };
    }
};
