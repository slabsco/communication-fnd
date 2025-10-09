import { useEffectOnce } from 'react-use';

import {
    Navigation,
    ObjectDto,
    RefetchGenericListing,
    useRecursiveFetch,
    WHATSAPP_TEMPLATE_CREATION_ROUTE,
    WHATSAPP_TEMPLATE_LIST_ROUTE,
} from '@finnoto/core';
import { Badge, ConfirmUtil } from '@finnoto/design-system';
import { BadgeInterface } from '@finnoto/design-system/src/Components/Data-display/Badge/badge.types';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { openImportYourTemplateModal } from './components/ImportYourTemplateModal';
import {
    WhatsappTemplateCategoryEnum,
    WhatsappTemplateStatusEnum,
} from './constants/whatsapp.template.category.enum';
import { useHandleTemplate } from './hooks/useHandleTemplate.hook';

import { CopySvgIcon, DeleteSvgIcon, EditSvgIcon } from 'assets';

const YourTemplatesListModule = () => {
    const { deleteTemplate } = useHandleTemplate();

    const [trigger] = useRecursiveFetch(RefetchGenericListing, {
        delay: 1000,
        repeat: Infinity,
    });

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
                renderValue: (temp) => {
                    const { appearance } = GetTemplateStatusAppearance(
                        temp.status_id
                    );
                    return (
                        <Badge label={temp.status} appearance={appearance} />
                    );
                },
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

    useEffectOnce(() => {
        trigger();
    });
    return <GenericDocumentListingComponent {...props} />;
};

export default YourTemplatesListModule;

export const GetTemplateStatusAppearance = (
    status_id: number
): { appearance: BadgeInterface['appearance'] } => {
    switch (status_id) {
        case WhatsappTemplateStatusEnum.APPROVED:
            return {
                appearance: 'success',
            };
        case WhatsappTemplateStatusEnum.REJECTED:
            return {
                appearance: 'error',
            };
        case WhatsappTemplateStatusEnum.PENDING:
            return {
                appearance: 'info',
            };
        default:
            return {
                appearance: 'base',
            };
    }
};
