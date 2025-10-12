import Link from 'next/link';

import {
    FetchData,
    IsUndefinedOrNull,
    Navigation,
    RefetchGenericListing,
    SCHEDULE_BROADCAST_CREATION_ROUTE,
    SCHEDULE_BROADCAST_LIST_ROUTE,
    toastBackendError,
} from '@finnoto/core';
import { ScheduleBroadcastController } from '@finnoto/core/src/backend/communication/controller/schedule.broadcast.controller';
import { ConfirmUtil, Modal } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../../Components/GenericDocumentListing/genericDocumentListing.types';
import { MultiColorBroadcastComponent } from '../../template/components/multi.color.broadcast.component';
import { openTemplateViewer } from '../../template/components/TemplateViewer.component';

import { DeleteSvgIcon } from 'assets';

const deleteScheduleMessages = async (
    id: number,
    options?: { callback?: (__: any) => void }
) => {
    const deleteData = async () => {
        const { success, response } = await FetchData({
            className: ScheduleBroadcastController,
            method: 'remove',
            methodParams: id,
        });

        Modal.close();
        if (!success) return toastBackendError(response);
        return options.callback?.(response);
    };
    return ConfirmUtil({
        message: 'Are you sure want to delete this',
        title: 'Delete !',
        isArc: true,
        icon: DeleteSvgIcon,
        onConfirmPress: deleteData,
        appearance: 'error',
    });
};

const ScheduleBroadcastTemplateListModule = () => {
    const props: GenericDocumentListingProps = {
        name: 'Broadcast Messages',
        type: 'schedule_broadcast',
        rowActions: [
            {
                name: 'Edit',
                key: 'edit',
                visible: (row) => IsUndefinedOrNull(row?.initiated_at),
                action: (row: any) => {
                    Navigation.navigate({
                        url: `${SCHEDULE_BROADCAST_CREATION_ROUTE}?id=${row.id}`,
                    });
                },
            },
            {
                name: 'Delete',
                key: 'delete',
                isCancel: true,
                visible: (row) => IsUndefinedOrNull(row?.initiated_at),
                action: (row: any) => {
                    deleteScheduleMessages(row.id, {
                        callback: RefetchGenericListing,
                    });
                },
            },
        ],
        table: [
            {
                name: 'Broadcast Name',
                key: 'name',
                url: (row: any) => `${SCHEDULE_BROADCAST_LIST_ROUTE}/${row.id}`,
            },
            {
                name: 'Description',
                key: 'description',
            },
            {
                name: 'Stats',
                key: 'stats',
                renderValue: (item) => {
                    return <MultiColorBroadcastComponent data={item} />;
                },
            },
            {
                name: 'Template',
                key: 'template',
                renderValue: (col) => {
                    return (
                        <div
                            className='text-info hover:underline'
                            onClick={() => {
                                openTemplateViewer(col?.template_id);
                            }}
                        >
                            {col?.template_name}
                        </div>
                    );
                },
            },
            {
                name: 'File',
                key: 'csv',
                renderValue: (col) => {
                    return (
                        <Link
                            className='text-info hover:underline'
                            href={col?.csv}
                        >
                            File
                        </Link>
                    );
                },
            },
            {
                name: 'Scheduled At',
                key: 'scheduled_at',
                type: 'date_time',
            },
            {
                name: 'Completed At',
                key: 'completed_at',
                type: 'date_time',
            },
        ],
        actions: [
            {
                name: 'Send Broadcast',
                type: 'create',
                action: () => {
                    Navigation.navigate({
                        url: SCHEDULE_BROADCAST_CREATION_ROUTE,
                    });
                },
            },
        ],
        customNoData: {
            enableAddNew: true,
            title: 'No Broadcast Campaigns',
            description:
                'To send a new broadcast campaign, click the button below',
            button: {
                name: 'Send Broadcast',
                appearance: 'primary',
                onClick: () => {
                    Navigation.navigate({
                        url: SCHEDULE_BROADCAST_CREATION_ROUTE,
                    });
                },
            },
        },
    };

    return <GenericDocumentListingComponent {...props} />;
};

export default ScheduleBroadcastTemplateListModule;
