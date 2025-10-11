/**
 * Base routes constants for public pages
 */

const HOME_ROUTE = '/'; // home
export const ERROR_ROUTE = HOME_ROUTE + '_error';
export const PAGE_NOT_FOUND_ROUTE = HOME_ROUTE + '404';
export const LOGIN_ROUTE = HOME_ROUTE + 'login';
export const SIGNUP_ROUTE = HOME_ROUTE + 'signup';
export const PRIVACY_POLICY = HOME_ROUTE + 'privacy-policy';
export const FORGOT_PASSWORD_ROUTE = HOME_ROUTE + 'forgot-password';
export const FORGOT_2FA_ROUTE = HOME_ROUTE + 'forgot-2fa';
export const RESET_PASSWORD_ROUTE = HOME_ROUTE + 'reset-password';
export const CHANGE_PASSWORD_ROUTE = HOME_ROUTE + 'change-password';
export const RESET_2FA_ROUTE = HOME_ROUTE + 'reset-2fa';
export const RESET_2FA_SYNC_ROUTE = HOME_ROUTE + 'reset-2fa-sync';
export const VERIFY_EMAIL_ROUTE = HOME_ROUTE + 'verify-email';
export const BUSINESS_AUTH_ROUTE = HOME_ROUTE + 'business-auth';
export const DISPUTE_PUBLIC_VIEW_ROUTE = HOME_ROUTE + 'p/d/[slug]';
export const REGISTER_VENDOR_ROUTE = HOME_ROUTE + 'vendor/register';
export const PUBLIC_VENDOR_KYC_ROUTE = HOME_ROUTE + 'vendor/kyc/[token]';
export const OWNER_TRANSFER = HOME_ROUTE + 'owner-transfer';
export const RECORD_EXPENSE_ROUTE = HOME_ROUTE + 'record/expense';
export const RECORD_ADVANCE_ROUTE = HOME_ROUTE + 'record/advance';
export const EXPENSE_DRAFT_ROUTE = HOME_ROUTE + 'expense/draft';
export const PUBLIC_ABOUT_ROUTE = HOME_ROUTE + 'about';
export const PUBLIC_EXPENSE_CREATION_ROUTE = HOME_ROUTE + 'p/expense/c';
export const PUBLIC_EXPENSE_DETAIL_ROUTE = HOME_ROUTE + 'p/expense/d/[id]';
export const PUBLIC_ADVANCE_DETAIL_ROUTE = HOME_ROUTE + 'p/advance/d/[id]';
export const PUBLIC_CONVERSATION_ROUTE = HOME_ROUTE + 'p/conversation';
export const CONNECT_CLIENT_PUBLIC = HOME_ROUTE + 'p/connect-client';

export const IGNORE_AUTH_ROUTES = [
    VERIFY_EMAIL_ROUTE,
    BUSINESS_AUTH_ROUTE,
    RECORD_EXPENSE_ROUTE,
    RECORD_ADVANCE_ROUTE,
    EXPENSE_DRAFT_ROUTE,
    PUBLIC_EXPENSE_CREATION_ROUTE,
    PUBLIC_EXPENSE_DETAIL_ROUTE,
    PUBLIC_ADVANCE_DETAIL_ROUTE,
    PUBLIC_CONVERSATION_ROUTE,
];
