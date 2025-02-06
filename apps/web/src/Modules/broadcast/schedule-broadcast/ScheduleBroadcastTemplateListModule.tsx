import Link from 'next/link';

import { SCHEDULE_BROADCAST_LIST_ROUTE } from '@finnoto/core';
import { Modal } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../../Components/GenericDocumentListing/genericDocumentListing.types';
import { openTemplateViewer } from '../your-templates/components/TemplateViewer.component';
import ScheduleBroadcastForm from './components/schedule.broadcast.form';

const ScheduleBroadcastTemplateListModule = () => {
    const props: GenericDocumentListingProps = {
        name: 'Broadcast Messages',
        type: 'schedule_broadcast',
        // rowActions: [
        //     {
        //         name: 'Edit',
        //         key: 'edit',
        //         visible: (row) => IsUndefinedOrNull(row?.initiated_at),
        //         action: (row: any) => {
        //             openScheduleBroadcast(row);
        //         },
        //     },
        // ],
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
            // {
            //     name: 'Scheduled At',
            //     key: 'scheduled_at',
            //     type: 'date_time',
            // },
            // {
            //     name: 'Completed At',
            //     key: 'completed_at',
            //     type: 'date_time',
            // },
        ],
        actions: [
            {
                name: 'Broadcast Message',
                type: 'create',
                action: openScheduleBroadcast,
            },
        ],
    };

    return <GenericDocumentListingComponent {...props} />;
};

export default ScheduleBroadcastTemplateListModule;

export const openScheduleBroadcast = (data?: any) => {
    Modal.open({
        component: ScheduleBroadcastForm,
        props: { initialData: data },
    });
};
