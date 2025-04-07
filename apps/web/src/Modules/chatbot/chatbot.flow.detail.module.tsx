import { useEffect, useMemo, useState } from 'react';

import {
    CHATBOT_LIST_ROUTE,
    IsUndefinedOrNull,
    Navigation,
    useChatbotFlow,
    useFetchParams,
} from '@finnoto/core';
import { PageLoader } from '@finnoto/core/src/Utils/ui.utils';
import {
    Button,
    ConfirmUtil,
    InputField,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
} from '@finnoto/design-system';

import FlowBuilderModule from '../flowbuilder/flowbuilder.module';

const ChatbotFlowDetailModule = () => {
    const { id, version_id } = useFetchParams();

    const {
        deleteVersion,
        refetch,
        addVersion,
        data,
        versionDetail,
        versionIsLoading,
        assignPublishedVersion,
        publishVersion,
    } = useChatbotFlow(id);

    const isPublishedVersion = useMemo(() => {
        return !IsUndefinedOrNull(versionDetail?.published_at);
    }, [versionDetail?.published_at]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    if (version_id && versionIsLoading) return <PageLoader />;

    return (
        <FlowBuilderModule
            extraActions={[
                {
                    name: 'Publish Version',
                    isSuccess: true,
                    action: () => {
                        ConfirmUtil({
                            isArc: true,
                            appearance: 'success',
                            title: `Publish ${versionDetail?.name} Version`,
                            message:
                                'Are you sure you want to publish this version?. Once the version is published you cannot delete the version',
                            isReverseAction: true,
                            onConfirmPress: async () => {
                                publishVersion(versionDetail.id);
                            },
                        });
                    },
                    visible: !isPublishedVersion,
                },
                {
                    name: 'Set as active flow',
                    isSuccess: true,
                    action: () => {
                        ConfirmUtil({
                            isArc: true,
                            appearance: 'success',
                            title: `Set ${versionDetail?.name}  as the active flow ?`,
                            message:
                                'Are you sure you want to set this version as the active flow?. this will change the active state of the flow.',
                            isReverseAction: true,
                            onConfirmPress: async () => {
                                assignPublishedVersion(versionDetail.id);
                            },
                        });
                    },
                    visible:
                        isPublishedVersion &&
                        data?.version_id !== versionDetail.id,
                },
                {
                    name: 'Duplicate',
                    action: () => {
                        return showVersionNameModal({
                            onSave: async (name: string) => {
                                const version = await addVersion({
                                    name,
                                    raw_react_flow:
                                        versionDetail?.raw_react_flow,
                                });
                                Navigation.search({ version_id: version?.id });
                            },
                        });
                    },
                },
                {
                    name: 'Delete',
                    isCancel: true,
                    visible:
                        !IsUndefinedOrNull(versionDetail?.id) &&
                        !isPublishedVersion,
                    action: () => {
                        ConfirmUtil({
                            isArc: true,
                            appearance: 'error',
                            title: `Delete ${versionDetail?.name} Version`,
                            message:
                                'Are you sure you want to delete this version? This action cannot be undone and will permanently remove the flow.',
                            isReverseAction: true,
                            onConfirmPress: async () => {
                                await deleteVersion(versionDetail?.id);
                                Navigation.navigate({
                                    url: CHATBOT_LIST_ROUTE,
                                });
                            },
                        });
                    },
                },
            ]}
            data={data}
            versionDetail={versionDetail}
            onSave={async (rawData: any) => {
                if (!version_id) {
                    return showVersionNameModal({
                        onSave: async (name: string) => {
                            const version = await addVersion({
                                name,
                                raw_react_flow: rawData,
                            });
                            refetch();
                            Navigation.search({ version_id: version?.id });
                        },
                    });
                }
                return addVersion({
                    id: versionDetail?.id,
                    name: versionDetail?.name,
                    raw_react_flow: rawData,
                });
            }}
        />
    );
};

export default ChatbotFlowDetailModule;

const showVersionNameModal = (props) => {
    Modal.open({ component: VersionNameModal, modalSize: 'xs', props });
};

const VersionNameModal = ({
    name,
    onSave,
}: {
    name: string;
    onSave: (name: string) => void;
}) => {
    const [versionName, setVersionName] = useState<string>(name);
    return (
        <ModalContainer title='Version Name'>
            <ModalBody className=''>
                <p className='mb-4 text-sm text-gray-600'>
                    Please enter a descriptive name for this version. This will
                    help you identify and manage different versions of your
                    chatbot flow.
                </p>
                <InputField
                    value={versionName}
                    onChange={setVersionName}
                    placeholder={'Add Version Name'}
                    label='Version name'
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    defaultMinWidth
                    onClick={() => {
                        onSave(versionName);
                    }}
                >
                    Save
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};
