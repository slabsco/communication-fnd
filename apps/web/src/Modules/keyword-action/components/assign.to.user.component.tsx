import { type } from 'os';

import { RefetchGenericListing, useActionDetail } from '@finnoto/core';
import { ActionTypeEnum } from '@finnoto/core/src/backend/communication/controller/keyword.details.controller';
import { Button } from '@finnoto/design-system';

import GenericDocumentListingComponent from '../../../Components/GenericDocumentListing/genericDocumentListing.component';
import { assignToUserFormUtil } from '../forms/assig.to.user.form.utils';

import { EditSvgIcon } from 'assets';

const AssignToUserComponent = ({ setActionId }: { setActionId: any }) => {
    return (
        <div className='flex-1 p-2 h-full col-flex'>
            <GenericDocumentListingComponent
                renderRightFilterComponent={
                    <Button
                        onClick={() => {
                            assignToUserFormUtil(undefined, {
                                callback: () => {
                                    RefetchGenericListing();
                                },
                            });
                        }}
                    >
                        Add User Assignee
                    </Button>
                }
                defaultClassParams={{ type_id: ActionTypeEnum.ASSIGN_TO_USER }}
                name='Assign To user'
                type='action_details'
                asInnerTable
                table={[
                    { key: 'name', type: 'text', name: 'Name' },
                    {
                        name: 'Assigned To',
                        key: 'parameters.user_name',
                        type: 'text',
                    },
                ]}
                handleSelectedData={(data) => {
                    setActionId(data[data?.length - 1]?.id);
                }}
                preferences={{ selectable: true }}
                rowActions={[
                    {
                        action: (data) => {
                            assignToUserFormUtil(data, {
                                callback: () => {
                                    RefetchGenericListing();
                                },
                            });
                        },
                        name: 'Edit',
                        type: 'outer',
                        icon: EditSvgIcon,
                    },
                ]}
            />
        </div>
    );
};

export default AssignToUserComponent;
