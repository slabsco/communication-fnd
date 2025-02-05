import { BusinessReportController } from '../backend/ap/business/controllers/business.report.controller';
import { ListingPreferenceController } from '../backend/ap/business/controllers/listing.preference.controller';
import { LoggedUtilityController } from '../backend/ap/utility/controllers/logged.utility.controller';
import { ViolationDefinitionController } from '../backend/ap/utility/controllers/violation.definition.controller';
import { EmailMessageController } from '../backend/common/controllers/email.message.controller';
import JournalEntryController from '../backend/common/controllers/journal.entry.controller';
import { LookupController } from '../backend/common/controllers/lookup.controller';
import { SourceMapController } from '../backend/common/controllers/source.map.controller';
import TallyGroupController from '../backend/common/controllers/tally.group.controller';
import UserNotificationController from '../backend/common/controllers/user.notification.controller';
import { CommunicationTemplateController } from '../backend/communication/controller/commuinication.templates.controller';
import { ContactController } from '../backend/communication/controller/contact.controller';
import { ScheduleBroadcastController } from '../backend/communication/controller/schedule.broadcast.controller';
import { TeamInboxController } from '../backend/communication/controller/team.inbox.controller';
import { MetaVendorOwnershipTransferController } from '../backend/meta/controllers/meta.vendor.ownership.transfer.controller';
import { SlabsController } from '../backend/meta/controllers/slabs.controller';
import { UpiPaymentController } from '../backend/payment/accounts/controllers/upi.payment.controller';
import { UpiRefundController } from '../backend/payment/accounts/controllers/upi.refund.controller';
import { UpiRequestController } from '../backend/payment/accounts/controllers/upi.request.controller';
import { Integrations } from '../Models/Integrations';

export const EMAIL_CONTROLER_ROUTER = {
    emailmessage: EmailMessageController,
};

export const OTHERS_CONTROLLER_ROUTE = {
    ...EMAIL_CONTROLER_ROUTER,
};

export const FINOPS_CONTROLLER_ROUTE = {
    user_notification: UserNotificationController,
};
export const VENDOR_CONTROLLER_ROUTE = {
    meta_vendor_ownership_transfer: MetaVendorOwnershipTransferController,
};

export const FINNOTO_PAYMENT_ROUTER = {
    upi_payment: UpiPaymentController,
    upi_refunds: UpiRefundController,
    upi_payment_request: UpiRequestController,
};

export const VIOLATIONS_CONTROLLER_ROUTER = {
    violation_definition: ViolationDefinitionController,
};

export const LISTING_CONTROLLER_ROUTER = {
    ...EMAIL_CONTROLER_ROUTER,
    ...FINNOTO_PAYMENT_ROUTER,
    ...VIOLATIONS_CONTROLLER_ROUTER,

    integrations: Integrations,
    ...EMAIL_CONTROLER_ROUTER,
    ...FINOPS_CONTROLLER_ROUTE,
    ...VENDOR_CONTROLLER_ROUTE,
    lookup: LookupController,
    lookup_utility: LoggedUtilityController,
    source_map: SourceMapController,
    tally_groups: TallyGroupController,
    journal_tally: JournalEntryController,
    fetch_report: BusinessReportController,
    listing_preference: ListingPreferenceController,
    communication_template: CommunicationTemplateController,
    schedule_broadcast: ScheduleBroadcastController,
    contact: ContactController,
    teamInbox: TeamInboxController,
} as const;

export const SPOTLIGHT_QUERY_CONTROLLER_ROUTE = {
    gstin: SlabsController,
};
