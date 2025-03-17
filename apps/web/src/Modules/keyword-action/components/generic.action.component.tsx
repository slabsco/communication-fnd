import {
    FormBuilderFormSchema,
    IsEmptyArray,
    useActionDetail,
} from '@finnoto/core';
import { ActionTypeEnum } from '@finnoto/core/src/backend/communication/controller/keyword.details.controller';
import {
    Button,
    CheckBox,
    cn,
    ConfirmUtil,
    IconButton,
    Loading,
    NoDataFound,
} from '@finnoto/design-system';

import { genericSetActionForm } from '../forms/generic.set.action.form.utils';

import { DeleteSvgIcon, EditSvgIcon } from 'assets';

const GenericActionComponent = ({
    actionName,
    type_id,
    renderDetailComponent,
    selectedActions,
    setSelectedActions,
    schema,
    sanitizeParameter,
    sanitizeInitialData,
}: {
    type_id: ActionTypeEnum;
    actionName: string;
    renderDetailComponent: any;
    selectedActions: any[];
    setSelectedActions: (data: any, remove: boolean) => void;
    schema: FormBuilderFormSchema;
    sanitizeParameter: (__: any) => {};
    sanitizeInitialData: (__: any) => {};
}) => {
    const { actions, isActionsLoading, refetchActions, deleteAction } =
        useActionDetail(type_id);

    return (
        <div className='flex-1 gap-3 p-4 h-full col-flex'>
            <div className='flex justify-end'>
                <Button
                    appearance='primary'
                    onClick={() => {
                        genericSetActionForm(undefined, {
                            otherFormSchema: schema,
                            type_id,
                            callback: () => {
                                refetchActions();
                            },
                            sanitizeParameter,
                        });
                    }}
                >
                    + Add {actionName} Action
                </Button>
            </div>

            {IsEmptyArray(actions) && (
                <NoDataFound
                    title='No  action'
                    description='Please create the action, to add the actions.'
                    button={{
                        name: 'Add Action',
                        onClick: () => {
                            genericSetActionForm(undefined, {
                                otherFormSchema: schema,
                                type_id,
                                callback: () => {
                                    refetchActions();
                                },
                                sanitizeParameter,
                            });
                        },
                    }}
                />
            )}
            {isActionsLoading ? (
                <div className='w-full h-full centralize'>
                    <Loading color='primary' size='xl' />
                </div>
            ) : (
                <div className='grid grid-cols-3 gap-4'>
                    {actions?.map((action) => {
                        const currentActions = selectedActions || [];
                        const isActive = currentActions?.some(
                            (insideAction) => action?.id === insideAction?.id
                        );
                        return (
                            <div
                                key={action.id}
                                className={cn(
                                    'flex gap-3 p-3 rounded-lg transition duration-200 cursor-pointer bg-base-100 hover:shadow-sm'
                                )}
                            >
                                <div className='flex-1 gap-2 col-flex'>
                                    <p className='flex gap-2 items-center font-semibold'>
                                        <CheckBox
                                            checked={isActive}
                                            onChange={(value) => {
                                                setSelectedActions(
                                                    action,
                                                    !value
                                                );
                                            }}
                                        />
                                        <div className='flex-1'>
                                            {action?.name}
                                        </div>
                                        <div className='flex gap-3 items-center'>
                                            <IconButton
                                                icon={EditSvgIcon}
                                                appearance='errorHover'
                                                onClick={() => {
                                                    genericSetActionForm(
                                                        sanitizeInitialData?.(
                                                            action
                                                        ),
                                                        {
                                                            otherFormSchema:
                                                                schema,
                                                            type_id,
                                                            callback: () => {
                                                                refetchActions();
                                                            },
                                                            sanitizeParameter,
                                                        }
                                                    );
                                                }}
                                                size='xs'
                                            />
                                            <IconButton
                                                icon={DeleteSvgIcon}
                                                appearance='errorHover'
                                                size='xs'
                                                onClick={() => {
                                                    ConfirmUtil({
                                                        isArc: true,
                                                        appearance: 'error',
                                                        title: 'Delete Actions',
                                                        message:
                                                            'Are you sure you want to delete this action? This action cannot be undone and will permanently remove the action.',
                                                        isReverseAction: true,
                                                        onConfirmPress: () =>
                                                            deleteAction(
                                                                action?.id
                                                            ),
                                                    });
                                                }}
                                            />
                                        </div>
                                    </p>
                                    {renderDetailComponent?.(action)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GenericActionComponent;
