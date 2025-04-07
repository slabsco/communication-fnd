import { CHATBOT_LIST_ROUTE, Navigation, useChatbotFlow } from '@finnoto/core';
import { ConfirmUtil } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { addChatbotFormUtil } from './add.chatbot.modal.form.utl';

import { DeleteSvgIcon, EditSvgIcon } from 'assets';

const ChatbotListModule = () => {
    const { deleteAction } = useChatbotFlow();
    const props: GenericDocumentListingProps = {
        name: 'Chatbot',
        type: 'chat_bot_flow',
        table: [
            {
                name: 'Name',
                key: 'name',
                url: (item) => {
                    const version_id =
                        item?.version_id || item?.attributes?.last_update_id;
                    if (version_id)
                        return `${CHATBOT_LIST_ROUTE}/${item.id}?version_id=${version_id}`;
                    return `${CHATBOT_LIST_ROUTE}/${item.id}`;
                },
            },
            { name: 'Description', key: 'description' },
            { name: 'active', key: 'active', type: 'activate' },
            { name: 'Version Name', key: 'version_name' },
            { name: 'Published At', key: 'published_at', type: 'date_time' },
            { name: 'Managed By', key: 'creator' },
        ],
        rowActions: [
            {
                name: 'Edit',
                icon: EditSvgIcon,
                type: 'outer',
                action: (data) => {
                    addChatbotFormUtil(undefined, data?.id);
                },
            },
            {
                name: 'Delete',
                type: 'inner',
                icon: DeleteSvgIcon,
                isCancel: true,
                action: (rowData) => {
                    ConfirmUtil({
                        isArc: true,
                        appearance: 'error',
                        title: 'Delete Flow',
                        message:
                            'Are you sure you want to delete this flow? This action cannot be undone and will permanently remove the flow.',
                        isReverseAction: true,
                        onConfirmPress: () => deleteAction(rowData?.id),
                    });
                },
            },
        ],

        actions: [
            {
                name: 'Add Chatbot',
                type: 'create',
                action: () =>
                    addChatbotFormUtil((res) => {
                        Navigation.navigate({
                            url: `${CHATBOT_LIST_ROUTE}/${res.id}`,
                        });
                    }),
            },
        ],
    };
    return <GenericDocumentListingComponent {...props} />;
};

export default ChatbotListModule;
