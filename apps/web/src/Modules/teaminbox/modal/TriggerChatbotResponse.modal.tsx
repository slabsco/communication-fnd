import { BotIcon } from 'lucide-react';
import React from 'react';

import { IsUndefinedOrNull } from '@finnoto/core';
import { ChatbotFLowController } from '@finnoto/core/src/backend/communication/controller/chatbot.flow.controller';
import {
    Button,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    ReferenceSelectBox,
} from '@finnoto/design-system';

const TriggerChatbotResponse = ({
    onTrigger,
}: {
    onTrigger: (id: number) => {};
}) => {
    const [selectedChatbotId, setSelectedChatbotId] = React.useState<
        number | null
    >(null);

    return (
        <ModalContainer>
            <ModalBody className='min-h-[200px]'>
                <div className='flex flex-col justify-center items-center mb-4 text-center'>
                    <BotIcon />
                    <h2 className='mt-2 text-lg font-semibold'>
                        Select a Chatbot
                    </h2>
                    <p className='mt-1 text-sm text-gray-600'>
                        Please choose a chatbot from the list below to trigger a
                        response.
                    </p>
                </div>
                <ReferenceSelectBox
                    controller={ChatbotFLowController}
                    method='find'
                    size='sm'
                    autoSelectZeroth
                    sublabelKey={'version_name'}
                    onChange={(option) => {
                        setSelectedChatbotId(option?.value);
                    }}
                />
            </ModalBody>
            <ModalFooter>
                <Button
                    disabled={IsUndefinedOrNull(selectedChatbotId)}
                    onClick={() => {
                        if (selectedChatbotId !== null) {
                            onTrigger(selectedChatbotId);
                        }
                    }}
                    defaultMinWidth
                >
                    Trigger
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};

export default TriggerChatbotResponse;

export const openTriggerChatbotResponse = ({
    onTrigger,
}: {
    onTrigger: (id: number) => void;
}) => {
    Modal.open({
        component: TriggerChatbotResponse,
        props: {
            onTrigger: (id) => {
                onTrigger?.(id);
                Modal.close();
            },
        },
        modalSize: 'sm',
    });
};
