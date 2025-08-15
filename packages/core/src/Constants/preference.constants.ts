export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
export const DISPLAY_DATE_FORMAT = 'dd MMM, yyyy';
export const DISPLAY_DATE_TIME_FORMAT = 'dd MMM, yyyy hh:mm a';
export const API_DATE_FORMAT = 'yyyy-MM-dd';

export const INDIAN_RUPEE_SYMBOL = '\u20B9';
export const DEFAULT_CURRENCY_IDENTIFIER = 'INR';

export const OTP_LENGTH = 6;

export const SQUARE_IMAGE_STYLE = { width: 65, height: 65 };

export const RECTANGLE_IMAGE_STYLE = { width: 100, height: 80 };

export const SQUARE_PHOTO_STYLE = { width: 90, height: 90 };

export const MAX_PAYMENT_IMAGES = 20; // maximum images

export const IndiaFlagUrl = 'https://www.countryflags.io/in/flat/64.png';

export const MAX_OTP_SEND = 2;

export const MAX_STRING_LENGH = 30;

export const DEVELOPER_MODE_KEY = 'enableDeveloperMode';

export const DEFAULT_DIAL_CODE = '91';

export const ELLIPSSIS_LENGTH_16 = 16;
export const ELLIPSSIS_LENGTH_18 = 18;

export const LOCATION_PERMISSION_STATES = {
    GRANTED: 'granted',
    DENIED: 'denied',
    PROMPT: 'prompt',
};

export const DESCRIPTION_LENGTH = 80;

export const CUSTOMER_HEADER_HEIGHT = 80;

export const CUSTOM_FIELD_LEVEL = {
    CUSTOMER: 2070,
    ITEM: 2071,
    BATCH: 2072,
    ITEMIZE: 2073,
};

export const CUSTOM_FIELD_TYPE = {
    TEXT: 2074,
    DATE: 2075,
    DATE_TIME: 2076,
    BOOLEAN: 2077,
};

export const CUSTOM_FIELD_COLUMN_TYPE = {
    DATE: 1040,
    TEXT_AREA: 1039,
    NUMBER: 1043,
    BOOLEAN: 1042,
};

export const GST_STATUS_TYPE = {
    ACTIVE: 1005,
    SUSPENDED: 1006,
    CANCELLED: 1007,
};

export const INVOICE_STATUS_TYPE = {
    OPEN: 1006,
    OVERDUE: 1007,
    PARTIALLY_PAID: 1011,
    DISPUTED: 1008,
    FULLY_PAID: 1009,
    BAD_DEBT: 1010,
};

export const PAYMENT_SOURCE = {
    CASH: 1085,
    BANK: 1086,
    CHEQUE: 1087,
    DD: 1088,
    POS: 2061,
    DMO: 2009,
    CASHFREE: 2008,
    OPENING_BALANCE: 2062,
    ONLINE: 2059,
    TDS: 2060,
    TCS: 2086,
};

export enum INTEGRATION_TYPE {
    JUSPAY = 1,
    RAZORPAY = 2,
    CASHFREE = 3,
    PAYTM = 4,
    PAYU = 5,
    PHONEPAY = 6,
    FRESHDESK = 7,
    ZENDESK = 8,
    ORDER_MANAGEMENT_SYSTEM = 11,
    STRIPE = 12,
    SHOPIFY = 13,
    SHIPROCKET = 14,
    MATRIXIFY = 15,
    UNIWARE = 17,
    CLICKPOST = 16,
}

export const DISPUTE_STATE = {
    OPEN: 1027,
    PENDING: 1028,
    IN_PROGRESS: 1029,
    RESPONSE_AWAITED: 1030,
    RESOLVED: 1031,
};

export enum CustomerStatusTypeEnum {
    PENDING = 1055,
    COMPLETED = 1056,
    CANCELLED = 1057,
}

export enum OrderStatusTypeEnum {
    PENDING = 1054,
    ACTIVE = 1055,
    COMPLETED = 1056,
    CANCELLED = 1057,
}

export const VENDOR_DOCUMENTS = {
    COI: 1,
    GST: 2,
    PAN: 3,
    MSME: 4,
    LOWER_TDS: 5,
    BANK: 7,
    OTHER: 6,
};

export enum VerificationStatusTypeEnum {
    SUBMITTED = 1015,
    PENDING_APPROVAL = 1016,
    APPROVED = 1017,
    REJECTED = 1018,
    ON_HOLD = 1019,
    OPEN = 1020,
}

export enum WorkflowTypeEnum {
    VENDOR_EXPENSE = 3050,
    REIMBURSEMENT = 3051,
    ADVANCE = 3052,
    PURCHASE_REQUEST = 3053,
    PURCHASE_ORDER = 3054,
}

export enum FinopsStatusTypeEnum {
    SUBMITTED = 1020,
    PENDING_APPROVAL = 1021,
    APPROVED = 1022,
    REJECTED = 1023,
    ON_HOLD = 1024,
}
export enum PaymentStatusTypeEnum {
    // SUBMITTED = 1025,
    // PENDING_APPROVAL = 1026,
    APPROVED = 1017,
    REJECTED = 1018,
    // ON_HOLD = 1029,
    // PAYMENT_PROCESSING = 1030,
    // PAYMENT_FAILED = 1031,
    // DONE = 1032,
}

export enum VerificationLimitTypeEnum {
    USER = 1058,
    HEAD_USER = 1062,
    DESIGNATION = 1059,
    DEPARTMENT_DESIGNATION = 1060,
    HEAD_DESIGNATION = 1061,
    HEAD_DEPARTMENT_DESIGNATION = 1063,
    DEPARTMENT_HEAD = 1082,
    DEPARTMENT = 1084,
    DEPARTMENT_USER_HEAD = 1083,
}

export enum LookupTypeEnum {
    PARTY_STATUS = 105,
    BUSINESS_TYPE = 101,
}
export enum FinopsLimitTypeEnum {
    GROUP = 1064,
    HEAD_GROUP = 1066,
    DEPARTMENT_GROUP = 1065,
    HEAD_DEPARTMENT_GROUP = 1067,
}

export enum PaymentLimitTypeEnum {
    GROUP = 1068,
    HEAD_GROUP = 1070,
    DEPARTMENT_GROUP = 1069,
    HEAD_DEPARTMENT_GROUP = 1071,
}

export enum ApprovalStatusTypeEnum {
    PENDING = 1033,
    ONHOLD = 1034,
    APPROVED = 1035,
    REJECTED = 1036,
}
export const ApprovalStatusType = {
    PENDING: 1033,
    ONHOLD: 1034,
    APPROVED: 1035,
    REJECTED: 1036,
};

export enum ApprovalTypeEnum {
    VERIFICATION = 1054,
    FINOPS = 1055,
    PAYMENT = 1056,
    ADVANCE = 1057,
}

export enum RecurringPeriodEnum {
    DAILY = 1091,
    WEEKLY = 1092,
    MONTHLY = 1093,
    QUARTERLY = 1094,
    YEARLY = 1095,
}

export enum ApprovalStepTypeEnum {
    INDIVIDUAL = 1075,
    USER_GROUP = 1076,
    DEPARTMENT_HEAD = 1078,
    MANAGERIAL = 1077,
    REPORTING_MANAGER = 2046,
    APPROVAL_MANAGER = 2052,
    DEPARTMENT_MANAGER = 2047,
    EXPENSE_HEAD_MANAGER = 2048,
    EXPENSE_HEAD_HEAD = 2049,
    CATEGORY_MANAGER = 2050,
    CATEGORY_HEAD = 2051,
}

export enum PaymentModeTypeEnum {
    CASH = 1085,
    CHEQUE = 1086,
    DD = 1087,
    LEDGER = 1088,
    OFFLINE_BANK = 1089,
    BANK = 1090,
    OFFLINE_BANK_PAYOUT = 2063,
    ADVANCE_ADJUSTMENT = 2071,
    CC_ADJUSTMENT = 2088,
    SHORT_AND_EXCESS = 2084,
}

export const APPROVAL_STEP_LOOKUP_ID = 116;

export enum ApprovalActivityTypeEnum {
    APPROVE = 1072,
    REJECT = 1073,
    WORKFLOW = 1074,
}

export const VendorInvitationTypeEnum = {
    CONNECTION_REQUEST: 2082,
    KYC_REQUEST: 2083,
};
export enum FinopsCustomFieldType {
    DEPARTMENT = 1047,
    DESIGNATION = 1048,
    EMPLOYEE = 1049,
    EXPENSE = 1050,
    EXPENSE_HEAD = 1051,
    BUSINESS = 1045,
    VENDOR_INVITATION = 1053,
    VENDOR = 1046,
    EMPLOYEE_ADVANCE = 2005,
    ADVANCE_CATEGORY = 2008,
    PURCHASE_REQUEST = 3085,
    PURCHASE_ORDER = 3086,
}

export enum RecurringStatusTypeEnum {
    ACTIVE = 2062,
    STOPPED = 2063,
    EXPIRED = 2064,
}

export enum BankTransferModeEnum {
    IMPS = 2058,
    NEFT = 2059,
    RTGS = 2060,
    UPI = 2061,
}

export enum VendorTypeStatusEnum {
    VENDOR_MANAGED = 1003,
    BUSINESS_MANAGED = 1004,
}

export const VENDOR_DOCUMENTS_ID = 103;
export const BUSINESS_TYPE_ID = 101;

export const BusinessType = {
    // Proprietorship
    PROPRIETORSHIP: {
        value: 1001,
        label: 'Proprietorship',
    },
    PARTNERSHIP_FIRM: {
        value: 1002,
        label: 'Partnership Firm',
    },
    LLP: {
        value: 1003,
        label: 'LLP',
    },
    PRIVATE_LIMITED: {
        value: 1004,
        label: 'Private Limited',
    },
    INDIVIDUAL_PREFERENCE: {
        value: 1005,
        label: 'Individual',
    },
    INTERNATIONAL: {
        value: 2068,
        label: 'International',
    },
};

export const GST_TYPES = {
    CGST: 'cgst',
    SGST: 'sgst',
    IGST: 'igst',
};

export const TAX_PERCENTAGE_SLABS = [5, 8, 12, 18, 28];

export enum ExpenseCategoryTypeEnum {
    VENDOR = 1013,
    EMPLOYEE_REIMBURSEMENTS = 1014,
}

export enum WorkflowLimitTypeEnum {
    EXPENSE = 2040,
    ADVANCE = 2041,
}

export enum ColumnDefinitionColumnType {
    STRING = 1,
    NUMBER = 2,
    DATE = 3,
    DATE_TIME = 4,
    BOOLEAN = 5,
    REFERENCE = 6,
    TEXT = 16,
    CURRENCY = 24,
    ACTIVATE_BADGE = 25,
    ACTIVATE = 26,
    DUALISTIC = 27, // yes/no
    DATE_LATERAL = 28,
}

export enum BulkUploadTypeEnum {
    CONTACT = 1,
}

export enum ArcBulkUploadTypeEnum {
    INVOICE = 1,
    EMPLOYEE = 3,
    CUSTOMER = 2,
    INVOICE_PAYMENT = 4,
    DEBIT_NOTE = 11,
    CREDIT_NOTE = 14,
}

export const FinopsQuickStartPreference = {
    Business: 'business_account',
    VendorInvitation: 'vendor_invitation',
    Department: 'department',
    Designation: 'designation',
    EmployeeGrade: 'employee_grade',
    Employee: 'employee',
    ExpenseHead: 'expense_head',
};
export const EmployeeQuickStartPreference = {
    bank_account: 'self_bank_account',
    // raise_advances: 'raise_advances',
    // raise_reimbursement: 'raise_reimbursement',
    profile_picture: 'profile_picture',
};
export const VendorQuickStartPreference = {
    vendor_bussines_account: 'business',
    bussines_client: 'client',
};

export const docIdentifierRegexps = [
    '(?:EXPVN)\\d+',
    '(?:EXPRB)\\d+',
    '(?:ADV)\\d+',
];
export const emailHighlightWords = [
    'approved',
    'rejected',
    ...docIdentifierRegexps,
];

export enum PaymentStatusEnum {
    PAYMENT_CONFIRMED = 2053,
    PENDING_SUBMISSION = 2054,
    PENDING_CONFIRMATION = 2055,
    PAYMENT_FAILED = 2056,
}

export const currentDate = 'currentDate';

export enum PlatformTypeEnum {
    ANDROID_APP = 1,
    IOS_APP = 2,
    PWA = 3,
    DESKTOP = 4,
    EXTENSION = 5,
    WHATSAPP = 6,
    SLACK = 7,
}

export enum ArPaymentModesTypeEnum {
    CC = 1008,
    DC = 1009,
    NB = 1010,
    WALLET = 1011,
    UPI = 1012,
    CASH = 1013,
    PREPAID_CARD = 1014,
}

export enum ArDisputeStatusTypeEnum {
    DRAFT = 1027,
    IN_PROGRESS = 1028,
    AWAITING_RESPONSE = 1029,
    PENDING_RESOLUTION = 1030,
    DONE = 1031,
}

export const CURRENT_USER = 'current_user';
export const CURRENT_EMPLOYEE = 'current_employee';
export enum VendorBusinessKycStatusEnum {
    PENDING = 2074,
    SUBMITTED = 2075,
    COMPLETED = 2076,
}
export enum ExpenseTypeEnum {
    VENDOR_EXPENSE = 3050,
    REIMBURSEMENT = 3051,
    ADVANCE = 3052,
}
export enum OverallExpenseStatusTypeEnum {
    VERIFICATION_PENDING = 3060,
    FINOPS_PENDING = 3061,
    PAYABLE_PENDING = 3062,
    PAYABLE_APPROVED = 3063,
    DRAFT = 3064,
    COMPLETED = 3065,
}

export enum PurchaseRequestStatusEnum {
    Raised = 3070,
    PendingApproval = 3071,
    Rejected = 3072,
    PendingQuote = 3073,
    PoPending = 3074,
    PendingDelivery = 3075,
    Completed = 3076,
}

export enum PurchaseQuoteStatusEnum {
    Requested = 3077,
    Submitted = 3078,
    Approved = 3079,
    Rejected = 3080,
}

export enum PurchaseOrderStatusEnum {
    Raised = 3070,
    PendingApproval = 3071,
    Rejected = 3072,
    PendingAcknowledgement = 3089,
    PendingDelivery = 3075,
    Completed = 3076,
}

export enum ItemAssignmentStatusEnum {
    Requested = 2053,
    Rejected = 2054,
    PartiallyFulfilled = 2055,
    Fulfilled = 2056,
}

export const OrderPaymentTypeEnum = {
    PREPAID: 1,
    POSTPAID: 2,
};
export const RESTRICTED_FILTERS = 'restricted_filters';

export enum DepositionTypeEnum {
    OrderLessPayment = 1,
    OrderExcessPayment = 2,
    PGDiscountAdjustment = 11,
    NoPaymentAttached = 12,
    ShipmentNotConfirmed = 13,
    ShipmentNotCreated = 14,

    PaymentOrderMismatch = 5,
    PaymentSettlementMismatch = 8,
    PaymentNotConfirmed = 3,

    RefundOrderMismatch = 7,
    RefundSettlementMismatch = 9,
}
export enum BusinessVendorConnectionMethodEnum {
    MANUAL = 3066,
    INVITATION = 3067,
    DIRECT = 3068,
}
export enum BooleanEnum {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export enum JournalEntryTypeEnum {
    Journal = 3087,
    Payment = 3088,
}

export enum Gstr2bReconIssueTypeEnum {
    AMOUNT = 2012,
    IDENTIFIER = 2014,
    GST_AMOUNT = 2013,
    DATE = 2015,
    PARTY_GST = 2016,
    BUSINESS_GST = 2017,
    NOT_FOUND = 3018,
    CESS_AMOUNT = 3019,
    TAXABLE_AMOUNT = 3020,
}

export enum ViolationTypeEnum {
    INFO = 4024,
    WARNING = 4025,
    ERROR = 4026,
    BLOCKER = 4027,
}

export enum ViolationColumnTypeEnum {
    TEXT = 1038,
    DATE = 1040,
    BOOLEAN = 1042,
    NUMBER = 1043,
    CHOICELIST = 1044,
}

export enum DataViolationStatusTypeEnum {
    PENDING = 4028,
    APPROVED = 4029,
    REJECTED = 4030,
}

export const HTML_REGEX = /<\/?[a-z][\s\S]*>/i;

export enum UserNotificationSourceTypeEnum {
    VENDOR_EXPENSE = 4018,
    REIMBURSEMENT = 4019,
    EMPLOYEE_ADVANCE = 4020,
    PURCHASE_REQUEST = 4021,
    PURCHASE_QUOTE = 4022,
    PURCHASE_ORDER = 4023,
}

export enum ArTicketStatusEnum {
    Open = 2004,
    Close = 2005,
    Hold = 2006,
}

export const SignedTokenActivityConstants = {
    APPROVAL: 'approval',
    CREATE: 'create',
    EDIT: 'edit',
    CONVERSATION: 'conversation',
};

export enum CommentTypeEnum {
    VENDOR = 2006,
    BUSINESS = 2007,
}
