import { IsEmptyArray, RefetchGenericListing } from '@finnoto/core';
import { openResourceViewerModal, UplodedFile } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { addQuickReplyFormUtil } from './add.quick.reply.form.util';
import { useQuickReplyHook } from './useQuickReply.hook';

import { DeleteSvgIcon, EditSvgIcon } from 'assets';

const QuickReplyListModule = () => {
    const { deleteQuickReply } = useQuickReplyHook({
        baseRefetchFn: RefetchGenericListing,
    });

    const props: GenericDocumentListingProps = {
        name: 'Quick Reply',
        type: 'quickReply',
        table: [
            { name: 'Name', key: 'name' },
            { name: 'Message', key: 'message' },
            { name: 'shortcut', key: 'shortcut' },
            {
                name: 'document',
                key: 'document',
                renderValue: (val) => {
                    if (IsEmptyArray(val?.document)) return '-';
                    return (
                        <UplodedFile
                            file={val?.document[0]}
                            handleRemoveFile={() => {}}
                            hideDelete
                            imageViwer={() =>
                                openResourceViewerModal(
                                    val?.document,
                                    val?.document[0]
                                )
                            }
                        />
                    );
                },
            },
            { name: 'active', key: 'active', type: 'activate' },
            { name: 'Creator', key: 'creator' },
        ],
        rowActions: [
            {
                name: 'Edit',
                icon: EditSvgIcon,
                type: 'inner',
                action: (data) => {
                    addQuickReplyFormUtil(data);
                },
            },
            {
                name: 'Delete',
                isCancel: true,
                icon: DeleteSvgIcon,
                type: 'inner',
                action: (data) => {
                    deleteQuickReply(data?.id);
                },
            },
        ],

        actions: [
            {
                name: 'Add Quick Reply',
                type: 'create',
                action: addQuickReplyFormUtil,
            },
        ],
    };
    return <GenericDocumentListingComponent {...props} />;
};

export default QuickReplyListModule;
