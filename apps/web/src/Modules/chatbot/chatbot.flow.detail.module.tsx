import { useEffect } from 'react';

import { Navigation, useChatbotFlow, useFetchParams } from '@finnoto/core';
import { PageLoader } from '@finnoto/core/src/Utils/ui.utils';
import { ConfirmUtil } from '@finnoto/design-system';

import FlowBuilderModule from '../flowbuilder/flowbuilder.module';
import { addChatbotFormUtil } from './add.chatbot.modal.form.utl';

const ChatbotFlowDetailModule = () => {
    const { id } = useFetchParams();

    const { deleteAction, isLoading, data, updateRawJson, refetch } =
        useChatbotFlow(id);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    if (isLoading) return <PageLoader />;

    return (
        <FlowBuilderModule
            extraActions={[
                {
                    name: 'Edit',
                    action: () => {
                        addChatbotFormUtil(() => {
                            refetch();
                        }, id);
                    },
                },
                {
                    name: 'Delete',
                    isCancel: true,
                    action: () => {
                        ConfirmUtil({
                            isArc: true,
                            appearance: 'error',
                            title: 'Delete Flow',
                            message:
                                'Are you sure you want to delete this flow? This action cannot be undone and will permanently remove the flow.',
                            isReverseAction: true,
                            onConfirmPress: async () => {
                                await deleteAction(id);
                                Navigation.back();
                            },
                        });
                    },
                },
            ]}
            rawJsonData={data?.raw_react_flow}
            name={data?.name}
            onSave={async (rawData: any) => {
                return updateRawJson(rawData);
            }}
        />
    );
};

export default ChatbotFlowDetailModule;
