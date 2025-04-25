import { BotIcon } from 'lucide-react';
import Image from 'next/image';

import {
    FetchData,
    KEYWORD_ACTION_CREATION_ROUTE,
    KEYWORD_ACTION_LIST_ROUTE,
    Navigation,
    useKeywordAction,
    useQuery,
} from '@finnoto/core';
import {
    ActionTypeEnum,
    KeywordDetailsController,
} from '@finnoto/core/src/backend/communication/controller/keyword.details.controller';
import {
    Button,
    ConfirmUtil,
    Loading,
    Modal,
    ModalContainer,
} from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../Components/GenericDocumentListing/genericDocumentListing.component';
import { GenericDocumentListingProps } from '../../Components/GenericDocumentListing/genericDocumentListing.types';
import { openTemplateViewer } from '../broadcast/your-templates/components/TemplateViewer.component';

import { DeleteSvgIcon, EditSvgIcon } from 'assets';

const KeywordActionListModule = () => {
    const { deleteKeyword } = useKeywordAction();

    const props: GenericDocumentListingProps = {
        name: 'Keyword Actions',
        type: 'keyword_details',
        table: [
            {
                name: 'keywords',
                key: 'keywords',
                renderValue: (data) => {
                    return (
                        <div className='flex gap-2 items-center py-2'>
                            {data?.keywords?.map((words) => (
                                <span
                                    key={words}
                                    className='px-3 py-2 bg-gray-100 rounded border border-dashed'
                                >
                                    {words}
                                </span>
                            ))}
                        </div>
                    );
                },
            },
            {
                name: 'triggered',
                key: 'attributes.triggered',
                type: 'number',
            },
            {
                name: 'Status',
                key: 'active',
                type: 'activate',
            },
            {
                name: 'Matching Method',
                key: 'matching_type',
            },
            {
                name: 'Reply Action',
                key: 'matching_type',
                className: 'relative',
                renderValue: (data) => {
                    return (
                        <Button
                            outline
                            onClick={() => {
                                Modal.open({
                                    component: ActionDetailModals,
                                    props: { id: data?.id },
                                    modalSize: 'sm',
                                });
                            }}
                        >
                            See Actions
                        </Button>
                    );
                },
            },
            { name: 'Created At', key: 'updated_at', type: 'date_time' },
        ],
        rowActions: [
            {
                name: 'Edit',
                type: 'outer',
                icon: EditSvgIcon,
                action: (rowData) => {
                    Navigation.navigate({
                        url: `${KEYWORD_ACTION_LIST_ROUTE}/${rowData?.id}`,
                    });
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
                        title: 'Delete Keyword Action?',
                        message:
                            'Are you sure you want to delete this keywords? This action cannot be undone and will permanently remove the keywords action.',
                        isReverseAction: true,
                        onConfirmPress: () => {
                            deleteKeyword(rowData?.id);
                        },
                    });
                },
            },
        ],

        actions: [
            {
                name: 'Add Keyword Action',
                type: 'create',
                action: () => {
                    Navigation.navigate({ url: KEYWORD_ACTION_CREATION_ROUTE });
                },
            },
        ],
    };
    return <GenericDocumentListingComponent {...props} />;
};

export default KeywordActionListModule;

const ActionDetailModals = ({ id }: { id: number }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['action-list'],
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: KeywordDetailsController,
                method: 'showAction',
                methodParams: id,
            });

            if (success) return response;
            return;
        },
    });
    const renderActions = (detail) => {
        if (detail?.action?.type_id === ActionTypeEnum.ASSIGN_TO_USER)
            return (
                <div className='gap-1 p-2 m-2 bg-gray-100 rounded col-flex'>
                    <p className='font-medium'>Assign to</p>
                    <span>{detail?.action?.parameters?.user_name}</span>
                </div>
            );
        if (detail?.action?.type_id === ActionTypeEnum.SEND_IMAGE)
            return (
                <div className='gap-1 p-2 m-2 bg-gray-100 rounded col-flex'>
                    <p className='font-medium'>Send Image</p>
                    <Image
                        alt={detail?.action?.parameters?.attributes?.name}
                        src={detail?.action?.parameters?.image_url}
                        className='w-full h-[200px]'
                        width={300}
                        height={200}
                    />
                </div>
            );
        if (detail?.action?.type_id === ActionTypeEnum.SEND_TEMPLATE_MESSAGE)
            return (
                <div className='gap-1 p-2 m-2 bg-gray-100 rounded col-flex'>
                    <p className='font-medium'>Send Template message</p>
                    <div className='mt-2 col-flex'>
                        <div className='flex gap-2 items-center'>
                            <p>Template Name: </p>
                            <p className='text-base-secondary'>
                                {detail?.action?.parameters?.name}
                            </p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <p>Category: </p>
                            <p className='text-base-secondary'>
                                {detail?.action?.parameters?.category}
                            </p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <p>Language: </p>
                            <p className='text-base-secondary'>
                                {detail?.action?.parameters?.language}
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                openTemplateViewer(
                                    detail?.action?.parameters?.template_id
                                );
                            }}
                            className='mt-2 w-full'
                            outline
                        >
                            View Template
                        </Button>
                    </div>
                </div>
            );

        if (detail?.action?.type_id === ActionTypeEnum.TEXT)
            return (
                <div className='gap-1 p-2 m-2 bg-gray-100 rounded col-flex'>
                    <p className='font-medium'>Send Normal message</p>
                    <div className='p-2 mt-2 bg-gray-300 rounded col-flex'>
                        {detail?.action?.parameters?.message}
                    </div>
                </div>
            );
        if (detail?.action?.type_id === ActionTypeEnum.CHATBOT)
            return (
                <div className='gap-1 p-2 m-2 bg-gray-100 rounded col-flex'>
                    <div className='flex items-center'>
                        <BotIcon className='mr-2 w-8 h-8 text-success' />
                        <p className='text-lg font-semibold text-gray-800'>
                            Chatbot:
                        </p>
                    </div>
                    <div className='ml-4'>
                        <p className='text-gray-600 text-md'>
                            {detail?.action?.parameters?.name}
                        </p>
                    </div>
                </div>
            );
    };

    return (
        <ModalContainer title='Actions'>
            {isLoading ? (
                <div className='centralize'>
                    <Loading size='lg' color='accent' />
                </div>
            ) : (
                data?.map((val) => {
                    return renderActions(val);
                })
            )}
        </ModalContainer>
    );
};
