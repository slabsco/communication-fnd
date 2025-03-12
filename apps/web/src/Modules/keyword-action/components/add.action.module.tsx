import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useList, useUpdateEffect } from 'react-use';

import { IsEmptyArray } from '@finnoto/core';
import { BusinessUserController } from '@finnoto/core/src/backend/common/controllers/business.user.controller';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { ActionTypeEnum } from '@finnoto/core/src/backend/communication/controller/keyword.details.controller';
import { Button, cn, IconButton } from '@finnoto/design-system';

import { openTemplateViewer } from '../../broadcast/your-templates/components/TemplateViewer.component';
import GenericActionComponent from './generic.action.component';

import { DeleteSvgIcon } from 'assets';

const AddActionsModule = ({
    initialData,
    setActionId,
}: {
    setActionId: (_id: any) => void;
    initialData: any[];
}) => {
    const [active, setActive] = useState(ActionTypeEnum?.ASSIGN_TO_USER);

    const [actionDetails, { push, removeAt, updateAt }] = useList(
        initialData || []
    );

    const handleSetAction = (
        actionDetail: any,
        allowMultiple: boolean = false
    ) => {
        const hasAlready = actionDetails?.some(
            (_act) => _act?.id === actionDetail?.id
        );
        if (hasAlready) return;

        if (allowMultiple) return push(actionDetail);

        const existingIndex = actionDetails?.findIndex(
            (data) => data?.type_id === actionDetail?.type_id
        );

        if (existingIndex >= 0) return updateAt(existingIndex, actionDetail);
        push(actionDetail);
    };

    const handleRemove = (action: any) => {
        const existingIndex = actionDetails?.findIndex(
            (data) => data?.id === action?.id
        );
        if (existingIndex >= 0) return removeAt(existingIndex);
    };

    const getActionDetail = (type_id) => {
        return actionDetails?.filter((actD) => actD?.type_id === type_id);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = [
        {
            name: 'Assign To user',
            key: ActionTypeEnum?.ASSIGN_TO_USER,
            components: (
                <GenericActionComponent
                    actionName='Assign To user'
                    type_id={ActionTypeEnum?.ASSIGN_TO_USER}
                    selectedActions={getActionDetail(
                        ActionTypeEnum?.ASSIGN_TO_USER
                    )}
                    setSelectedActions={(action, remove) => {
                        if (remove) handleRemove(action);
                        handleSetAction(action);
                    }}
                    renderDetailComponent={(data: any) => {
                        return <div>{data?.parameters?.user_email}</div>;
                    }}
                    schema={{
                        user_id: {
                            type: 'reference_select',
                            controller: BusinessUserController,
                            label: 'Assignee',
                            placeholder: 'Select Assignee',
                            required: true,
                            labelKey: 'name',
                            sublabelKey: 'email',
                        },
                    }}
                    sanitizeInitialData={(actions) => {
                        return {
                            ...actions,
                            user_id: actions?.parameters?.id,
                        };
                    }}
                    sanitizeParameter={(data) => {
                        return {
                            user_id: data?.user_id,
                        };
                    }}
                />
            ),
        },
        {
            name: 'Send Template Message',
            key: ActionTypeEnum?.SEND_TEMPLATE_MESSAGE,
            components: (
                <GenericActionComponent
                    actionName='Send Template Message'
                    type_id={ActionTypeEnum?.SEND_TEMPLATE_MESSAGE}
                    selectedActions={getActionDetail(
                        ActionTypeEnum?.SEND_TEMPLATE_MESSAGE
                    )}
                    setSelectedActions={(action, remove) => {
                        if (remove) handleRemove(action);
                        handleSetAction(action, true);
                    }}
                    renderDetailComponent={(data: any) => {
                        return (
                            <div className='mt-2 col-flex'>
                                <div className='flex gap-2 items-center'>
                                    <p>Template Name: </p>
                                    <p className='text-base-secondary'>
                                        {data?.parameters?.name}
                                    </p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <p>Category: </p>
                                    <p className='text-base-secondary'>
                                        {data?.parameters?.category}
                                    </p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <p>Language: </p>
                                    <p className='text-base-secondary'>
                                        {data?.parameters?.language}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => {
                                        openTemplateViewer(
                                            data?.parameters?.template_id
                                        );
                                    }}
                                    className='mt-2 w-full'
                                    outline
                                >
                                    View Template
                                </Button>
                            </div>
                        );
                    }}
                    schema={{
                        template_id: {
                            type: 'reference_select',
                            controller: CommunicationTemplateController,
                            label: 'Template',
                            placeholder: 'Select Template',
                            required: true,
                            autoSelectZeroth: true,
                            // filterClassParams: {
                            //     status_id: WhatsappTemplateStatusEnum.APPROVED,
                            // },
                            messageComponent: (data) => {
                                if (!data) return <></>;

                                return (
                                    <Button
                                        className='mt-2 w-full'
                                        outline
                                        onClick={() => {
                                            openTemplateViewer(data);
                                        }}
                                    >
                                        View Template
                                    </Button>
                                );
                            },
                        },
                    }}
                    sanitizeInitialData={(actions) => {
                        return {
                            ...actions,
                            template_id: actions?.parameters?.template_id,
                        };
                    }}
                    sanitizeParameter={(data) => {
                        return {
                            template_id: data?.template_id,
                        };
                    }}
                />
            ),
        },
        {
            name: 'Send Image',
            key: ActionTypeEnum?.SEND_IMAGE,
            components: (
                <GenericActionComponent
                    actionName='Send Image Message'
                    type_id={ActionTypeEnum?.SEND_IMAGE}
                    selectedActions={getActionDetail(
                        ActionTypeEnum?.SEND_IMAGE
                    )}
                    setSelectedActions={(action, remove) => {
                        if (remove) handleRemove(action);
                        handleSetAction(action, true);
                    }}
                    renderDetailComponent={(data: any) => {
                        const props = data?.parameters;
                        return (
                            <div className='mt-2 col-flex'>
                                <Image
                                    alt={props?.attributes?.name}
                                    src={props?.image_url}
                                    className='w-full h-[200px]'
                                    width={300}
                                    height={200}
                                />
                            </div>
                        );
                    }}
                    schema={{
                        image_url: {
                            type: 'single_file_upload',
                            title: 'Upload Image',
                            placeholder: 'Upload your Image',
                            label: 'Image',
                            fileSupportText: 'jpg/jpeg/png',
                            required: true,
                            colSpan: 2,
                            accept: { 'image/jpeg': [], 'image/png': [] },
                        },
                    }}
                    sanitizeInitialData={(actions) => {
                        return {
                            ...actions,
                            image_url: [
                                {
                                    attributes: actions?.parameters?.attributes,
                                    document_url:
                                        actions?.parameters?.attributes,
                                },
                            ],
                        };
                    }}
                    sanitizeParameter={(data) => {
                        return {
                            attributes: data?.image_url?.[0]?.attributes,
                            image_url: data?.image_url?.[0]?.document_url,
                        };
                    }}
                />
            ),
        },
        {
            name: 'Send Text',
            key: ActionTypeEnum?.TEXT,
            components: (
                <GenericActionComponent
                    actionName='Send Text Message'
                    type_id={ActionTypeEnum?.TEXT}
                    selectedActions={getActionDetail(ActionTypeEnum?.TEXT)}
                    setSelectedActions={(action, remove) => {
                        if (remove) handleRemove(action);
                        handleSetAction(action, true);
                    }}
                    renderDetailComponent={(data: any) => {
                        const props = data?.parameters;
                        return (
                            <div className='p-2 mt-2 bg-gray-300 rounded col-flex'>
                                {props?.message}
                            </div>
                        );
                    }}
                    schema={{
                        message: {
                            type: 'textarea',
                            title: 'Message',
                            placeholder: 'Add Message here',
                            label: 'Message',
                            required: true,
                        },
                    }}
                    sanitizeInitialData={(actions) => {
                        return {
                            ...actions,
                            message: actions?.parameters?.message,
                        };
                    }}
                    sanitizeParameter={(data) => {
                        return {
                            message: data?.message,
                        };
                    }}
                />
            ),
        },
    ];

    useUpdateEffect(() => {
        if (IsEmptyArray(actionDetails)) return;
        const ids = actionDetails?.map((action) => action?.id);
        setActionId(ids);
    }, [actionDetails]);

    const activeColumn = useMemo(() => {
        return columns?.find((val) => val?.key === active);
    }, [active, columns]);

    return (
        <div className='grid overflow-hidden flex-1 grid-cols-7 gap-3'>
            <div className='col-span-1 p-2 h-full bg-gray-100 rounded col-flex'>
                {columns?.map((col) => {
                    const isActive = col?.key === active;
                    return (
                        <div
                            key={col?.key}
                            onClick={() => {
                                if (isActive) return;
                                setActive(col?.key);
                            }}
                            className={cn(
                                'py-3 text-base border-b transition-all cursor-pointer',
                                {
                                    'text-success': isActive,
                                }
                            )}
                        >
                            {col?.name}
                        </div>
                    );
                })}
            </div>
            <div className='overflow-hidden col-span-6 h-full col-flex'>
                <div className='flex gap-3 items-center my-2'>
                    <span className='font-medium'> Selected Actions:</span>
                    {actionDetails?.map((data, index) => {
                        return (
                            <div
                                key={data?.id}
                                className='flex gap-3 items-center px-2 py-1 rounded border border-dashed border-info'
                            >
                                {data?.name}

                                <IconButton
                                    icon={DeleteSvgIcon}
                                    size='xs'
                                    outline
                                    appearance='error'
                                    onClick={() => {
                                        removeAt(index);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className='overflow-hidden flex-1 px-2 h-full bg-gray-100 col-flex'>
                    {activeColumn?.components}
                </div>
            </div>
        </div>
    );
};

export default AddActionsModule;
