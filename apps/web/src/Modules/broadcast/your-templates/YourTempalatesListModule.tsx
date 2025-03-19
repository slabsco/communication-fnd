import {
    Navigation,
    ObjectDto,
    WHATSAPP_TEMPLATE_CREATION_ROUTE,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import { ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../../Components/GenericDocumentListing/genericDocumentListing.types';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';
import { openImportYourTemplateModal } from './ImportYourTemplateModal';

import { CopySvgIcon, DeleteSvgIcon } from 'assets';

const YourTemplatesListModule = () => {
    const { deleteTemplate } = useHandleTemplate();
    const props: GenericDocumentListingProps = {
        type: 'communication_template',
        name: 'Your Template List',
        actions: [
            {
                name: 'Create Template',
                type: 'create',
                outline: true,
                action: () => {
                    Navigation.navigate({
                        url: WHATSAPP_TEMPLATE_CREATION_ROUTE,
                    });
                },
            },
            {
                name: 'Import Template',
                type: 'action_btn',
                buttonActions: [
                    {
                        name: 'Import Templates',
                        action: openImportYourTemplateModal,
                    },
                ],
            },
        ],
        rowActions: [
            {
                name: 'Duplicate',
                key: 'duplicate',
                icon: CopySvgIcon,
                action: (row: any) => {
                    Navigation.navigate({
                        url: `${WHATSAPP_TEMPLATE_CREATION_ROUTE}?id=${row.id}&is_duplicate=true`,
                    });
                },
            },
            {
                name: 'Delete',
                key: 'delete',
                action: (item: ObjectDto) => {
                    ConfirmUtil({
                        title: 'Do you want to delete?',
                        message:
                            'The action you are about to perform is irreversible.',
                        icon: DeleteSvgIcon,
                        isArc: true,
                        onConfirmPress: () => {
                            deleteTemplate(item?.id);
                        },
                        appearance: 'error',
                    });
                },
                color: 'text-error',
                isCancel: true,
                icon: DeleteSvgIcon,
            },
        ],
        table: [
            {
                name: 'Template Name',
                key: 'name',
                url: (item) => `${WHATSAPP_TEMPLATE_LIST_ROUTE}/${item.id}`,
            },
            {
                name: 'Identifier',
                key: 'identifier',
            },
            {
                name: 'category',
                key: 'category',
            },
            {
                name: 'status',
                key: 'status',
            },
            {
                name: 'Language',
                key: 'language',
            },
            {
                name: 'Last Updated',
                key: 'updated_at',
                type: 'date_time',
            },
        ],
    };
    return <GenericDocumentListingComponent {...props} />;
};

export default YourTemplatesListModule;
