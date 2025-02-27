import { useMemo, useState } from 'react';

import { FetchData, IsEmptyArray, toastBackendError } from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import {
    Button,
    ConfirmUtil,
    Loading,
    Modal,
    ModalBody,
    ModalContainer,
    NoDataFound,
    Table,
    Toast,
} from '@finnoto/design-system';

import { useMutation, useQuery } from '@tanstack/react-query';

import { YourTemplatesPreview } from './components/YourTemplatesPriview.component';

import { EyeSvgIcon } from 'assets';

const ImportYourTemplateModal = ({ callback }: { callback: () => {} }) => {
    const [handleSelectedData, setHandleSelectedData] = useState<any>([]);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-business-template'],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: CommunicationTemplateController,
                method: 'getBusinessTemplates',
            });

            if (success) return response;
        },
    });

    const { mutate: importTemplates } = useMutation({
        mutationFn: async (ids: any[]) => {
            const { success, response } = await FetchData({
                className: CommunicationTemplateController,
                method: 'importTemplates',
                classParams: { ids },
            });

            if (!success) return toastBackendError(response);
            Toast.success({
                description:
                    'Your Template fetching process has been initiated, it will be imported in background.',
            });

            callback?.();
        },
    });

    const handleImport = () => {
        ConfirmUtil({
            message:
                'this process will import your other business templates in background, it might take some time to reflect in the system.',
            title: 'Are you sure want to import ?',
            isArc: true,
            onConfirmPress: () => {
                const ids = handleSelectedData.map((sData) => sData?.id);
                importTemplates(ids);
            },
            appearance: 'success',
        });
    };
    return (
        <ModalContainer title='Your Other Template'>
            <ModalBody>
                {!isLoading && IsEmptyArray(data) && <NoDataFound />}
                {!IsEmptyArray(data) && (
                    <div>
                        {!IsEmptyArray(handleSelectedData) && (
                            <div className='flex justify-end items-end mb-3'>
                                <Button outline onClick={handleImport}>
                                    Import Selected
                                </Button>
                            </div>
                        )}
                        <div className='max-h-[500px] overflow-hidden'>
                            <Table
                                loading={isLoading}
                                column={[
                                    { name: 'Identifier', key: 'name' },
                                    { name: 'Category', key: 'category' },
                                    { name: 'Language', key: 'language' },
                                ]}
                                rowAction={{
                                    menuActions: [
                                        {
                                            name: 'View',
                                            icon: EyeSvgIcon,
                                            type: 'outer',
                                            action: (data) => {
                                                Modal.open({
                                                    modalSize: 'auto',
                                                    component:
                                                        ImportTemplatePreview,
                                                    props: { data },
                                                });
                                            },
                                        },
                                    ],
                                }}
                                select={{
                                    type: 'check',
                                    display: true,
                                    handleSelectedData: (data: any) => {
                                        setHandleSelectedData(data);
                                    },
                                }}
                                data={data}
                                pagination={{ display: false }}
                            />
                        </div>
                    </div>
                )}
                {isLoading && (
                    <div className='w-full h-full centralize'>
                        <Loading size='xl' color='primary' />
                    </div>
                )}
            </ModalBody>
        </ModalContainer>
    );
};

export default ImportYourTemplateModal;

export const openImportYourTemplateModal = (options?: { callback: any }) => {
    return Modal.open({
        component: ImportYourTemplateModal,
        modalSize: 'md',
        props: {
            callback: () => {
                Modal.close();
                options.callback?.();
            },
        },
    });
};

const ImportTemplatePreview = (data: any) => {
    const components = data?.data?.components;

    const body = components?.filter((com) => com?.type === 'BODY');
    const title = components?.filter((com) => com?.type === 'HEADER');
    const footer = components?.filter((com) => com?.type === 'FOOTER');
    const button = components?.filter((com) => com?.type === 'BUTTONS');

    const configuration = useMemo(() => {
        const quickReply = button?.[0]?.buttons?.filter(
            (qr) => qr.type === 'QUICK_REPLY'
        );

        const config = {};

        if (!IsEmptyArray(quickReply)) {
            config['QUICK_REPLY'] = quickReply?.map((val) => val?.text);
        }

        return config;
    }, [button]);

    return (
        <YourTemplatesPreview
            sampleContent={{}}
            body={body?.[0]?.text}
            configuration={configuration}
            title={{
                type: title?.[0]?.format,
                value: title?.[0]?.text,
            }}
            footer={footer?.[0]?.text}
        />
    );
};
