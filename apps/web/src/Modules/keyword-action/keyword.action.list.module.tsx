import {
    FetchData,
    KEYWORD_ACTION_CREATION_ROUTE,
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

import { DeleteSvgIcon } from 'assets';

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
                                <span className='px-3 py-2 bg-gray-100 rounded border border-dashed'>
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
                    // return (
                    //     <HoverBox
                    //         id={data?.id}
                    //         controller={KeywordDetailsController}
                    //         method='showAction'
                    //         renderFunction={(data) => {
                    //             return (
                    //                 <div className='z-[9999] bg-primary h-6 w-16'>
                    //                     fdasfdsafdsafdas
                    //                 </div>
                    //             );
                    //         }}
                    //     >
                    //         <Badge appearance='info' label={'See action'} />
                    //     </HoverBox>
                    // );
                },
            },
            { name: 'Created At', key: 'updated_at', type: 'date_time' },
        ],
        rowActions: [
            {
                name: 'Delete',
                type: 'inner',
                icon: DeleteSvgIcon,
                isCancel: true,
                action: (rowData) => {
                    ConfirmUtil({
                        isArc: true,
                        appearance: 'error',
                        title: 'Delete Contact',
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
