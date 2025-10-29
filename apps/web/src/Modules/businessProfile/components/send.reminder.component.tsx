import { EyeIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ObjectDto } from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import {
    BasicFilterButton,
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    ReferenceSelectBox,
    SelectBox,
    TextareaField,
} from '@finnoto/design-system';

import NoteComponent from '../../../Components/NoteComponent';
import { openTemplateViewer } from '../../template/components/TemplateViewer.component';

interface SendReminderComponentProps {
    preference: ObjectDto;
    setPreference: (preference: ObjectDto) => void;
}

const ViewModal = ({
    preference = {},
    setPreference,
}: SendReminderComponentProps) => {
    const [reminder, setReminder] = useState(preference);

    const active = useMemo(() => {
        if (!reminder) return 'none';

        const keys = Object?.keys?.(reminder)?.filter(
            (_key) => _key !== 'time'
        );
        return keys?.[0] || 'none';
    }, [reminder]);

    const isSaveDisabled = useMemo(() => {
        if (active === 'none') return false;

        if (reminder?.message) return false;
        if (reminder?.template_id) return false;

        return true;
    }, [active, reminder]);

    const updateReminder = (key: string, value: string | number) => {
        setReminder((prev) => ({
            time: prev?.time,
            [key]: value,
        }));
    };

    return (
        <ModalContainer>
            <ModalBody className='gap-3 col-flex'>
                <div className='gap-1 text-center col-flex'>
                    <h3 className='text-lg font-medium'>
                        Reminder before chat expires
                    </h3>
                    <p className='text-base-secondary'>
                        Before a chat expires, we will send a reminder
                        notification to users.
                    </p>
                </div>
                <SelectBox
                    isClearable
                    label='Before'
                    value={reminder?.time}
                    onChange={(val) => {
                        updateReminder('time', val?.value);
                    }}
                    options={[
                        { label: '15 mins', value: 15 },
                        { label: '30 mins', value: 30 },
                        { label: '45 mins', value: 45 },
                        { label: '60 mins', value: 60 },
                    ]}
                />
                <BasicFilterButton
                    size='sm'
                    disableNav
                    active={active}
                    onFilterChange={(_data: any) => {
                        updateReminder(_data, preference?.[_data]);
                    }}
                    filters={[
                        {
                            label: 'Do not send',
                            key: 'none',
                        },
                        {
                            label: 'Send Template message',
                            key: 'template_id',
                        },
                        {
                            label: 'Send Normal Message',
                            key: 'message',
                        },
                    ]}
                />
                {reminder && Object?.hasOwn?.(reminder, 'message') && (
                    <TextareaField
                        showLimit
                        inputClassName='leading-5 py-2 h-full text-sm'
                        rows={4}
                        value={reminder?.message}
                        onChange={(v) => {
                            updateReminder('message', v);
                        }}
                        placeholder={'Type your message here '}
                        className='mb-1 w-full h-full'
                        size='lg'
                        max={1024}
                    />
                )}
                {reminder && Object.hasOwn(reminder, 'template_id') && (
                    <>
                        <div className='flex gap-2 items-center'>
                            <div className='flex-1'>
                                <ReferenceSelectBox
                                    {...{
                                        size: 'sm',
                                        type: 'reference_select',
                                        controller:
                                            CommunicationTemplateController,
                                        placeholder: 'Select Template',
                                        required: true,
                                        autoSelectZeroth: false,
                                        isClearable: false,
                                        sublabelKey: 'identifier',
                                        value: reminder?.template_id,
                                        onChange: (val: any) => {
                                            updateReminder(
                                                'template_id',
                                                val?.value
                                            );
                                        },
                                    }}
                                />
                            </div>
                            <IconButton
                                outline
                                icon={EyeIcon}
                                onClick={() => {
                                    openTemplateViewer(reminder?.template_id);
                                }}
                            />
                        </div>
                        <NoteComponent message='Please select only templates that do not contain variables. Using templates without variables ensures quicker and more reliable delivery of reminder messages to your customers.' />
                    </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button
                    appearance='success'
                    disabled={isSaveDisabled}
                    defaultMinWidth
                    onClick={() => {
                        setPreference(reminder);
                    }}
                >
                    Save
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};

export const openSetReminderViewModal = (props: SendReminderComponentProps) => {
    return Modal.open({ modalSize: 'sm', component: ViewModal, props });
};
