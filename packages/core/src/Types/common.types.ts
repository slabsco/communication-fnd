import { ObjectDto } from '../backend/Dtos';
import { PRODUCT_IDENTIFIER } from '../Constants';
import {
    LISTING_CONTROLLER_ROUTER,
    OTHERS_CONTROLLER_ROUTE,
    SPOTLIGHT_QUERY_CONTROLLER_ROUTE,
} from '../Constants/controller.router.constant';

export interface BasicAuthDto {
    username: string;
    password?: string;
}

export interface ApiSecretPayloadDto {
    client_id?: string;
    client_secret?: string;
}

export type OthersControllerType = typeof OTHERS_CONTROLLER_ROUTE;
export class ApiHeaderDto {
    key?: string;
    value?: string;
    encrypt?: boolean;
    visible?: boolean;
}

export interface EventGroup {
    title: string;
    events: EventRecord[];
}

export type EventRecord = { name: string; key: string };

export interface ContactPersonCreationPayload {
    id?: number;
    name: string;
    email?: string;
    mobile?: number;
    role?: string;
    comments?: string;
}

export interface BankAccountPayload {
    id?: number;
    attributes?: { name?: string; branch?: string };
    account_number: string;
    ifsc_code: string;
    legal_name: string;
}

export interface InvitedUserPayload {
    id?: number;
    email: string;
    role_id: number;
}

export interface FileUploadDto {
    id?: number;
    document_url?: string;
    comments?: string;
    created_at?: string;
    attributes?: ObjectDto;
}

export interface FilesUploadDto {
    files?: FileUploadDto[];
}

export interface FileData extends Partial<File> {
    id?: number;
    serverUrl?: string;
    hideDelete?: boolean;
}

export interface DocumentUploadResponsePayload {
    id?: number;
    document_url?: string;
    source_type?: string;
    attributes?: {
        comments?: string;
    };
}

export interface CommentCreationPayload {
    id?: number;
    comments: string;
}

export type PaginationType = {
    limit?: number;
    page?: number;
    total?: number;
};
export type GenericListingType = keyof typeof LISTING_CONTROLLER_ROUTER;

export type SearchQueryType = keyof typeof SPOTLIGHT_QUERY_CONTROLLER_ROUTE;

type RowActionType = 'error' | 'success' | 'warning' | 'info';

export interface GenericTableRowAction {
    name: string;
    defaultName?: string;
    type?: RowActionType;
    url?: string | ((item: any) => string);
    resolveUrl?: boolean;
    action?: string | ((item: any, index: number) => void);
    visible?: boolean | ((item: any, index: number) => boolean);
    icon?: string | (() => {});
    isSvg?: boolean;
    outline?: boolean;
}

export interface BasicFilterItem {
    label: string | any;
    key: string | number;
    leftIcon?: string | (() => any);
    leftIconClass?: string;
    visible?: boolean;
}

export interface TitleRoutePayload {
    name: string;
    link?: string;
    className?: string;
}

export interface RelayWebhook {
    headers?: Record<string, string>[];
    auth?: BasicAuthDto;
    url?: string;
    include_pg_data?: boolean;
    enabled_events?: Record<string, boolean>;
}

export interface CommonIntegrationPayload {
    id?: number;
    api_credential?: ApiSecretPayloadDto;
    webhook_url?: string;
    relay_url?: RelayWebhook;
    start_date?: string;
    bank_account_id?: number;
    attributes?: any;
}

export interface SourceDetailObj {
    name: string;
    key?: string;
    identifier?: string;
    path?: string;
    publicPath?: string;
    action?: (..._: any) => void;
    navigationFn?: (..._: any) => void;
    defaultActiveTab?: ObjectDto;
}

export interface FileData extends Partial<File> {
    serverUrl?: string;
}

export interface DisputeStateType {
    amount: number;
    settled_amount: number;
    state_id: number;
}

export interface RangeProps {
    name?: string;
    startDate: Date;
    endDate: Date;
}
export type ChatSendFunctionType = (
    value: { message?: string; attachments?: FileData[] },
    callback: () => void
) => void;

export interface ChatDataPayload {
    id?: number;
    isSentByMe?: boolean;
    title?: string;
    message?: any;
    attachments?: FileData[];
    date?: Date;
    context?: any;
    email?: string;
    image_url?: string;
    sameSide?: boolean;
    platform_id?: number;
    isSystemGenerated?: boolean;
}

export interface ProductPayload {
    id: PRODUCT_IDENTIFIER;
    name?: string;
    attributes?: any;
}
