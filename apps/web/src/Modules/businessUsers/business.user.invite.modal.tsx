import { useMemo, useState } from 'react';

import {
    IsUndefinedOrNull,
    RefetchGenericListing,
    useBusinessUserHook,
    useGetUserRoles,
} from '@finnoto/core';
import {
    Button,
    Icon,
    InputField,
    Modal,
    ModalBody,
    ModalContainer,
    ModalFooter,
    SelectBox,
} from '@finnoto/design-system';

import { InfoCircleSvgIcon } from 'assets';

const BusinessUserInviteModal = ({
    callback,
}: {
    callback?: (__: any) => void;
}) => {
    const { inviteUser } = useBusinessUserHook({
        refetch: () => {
            RefetchGenericListing();
        },
    });

    const [email, setEmail] = useState<string>('');
    const [roleId, setRoleIds] = useState<number>();

    const { userRolesList } = useGetUserRoles();

    const handleSubmit = async (values: any) => {
        await inviteUser(values);
        return callback?.(values);
    };

    const isButtonDisabled = useMemo(() => {
        if (email.length > 5 && !IsUndefinedOrNull(roleId)) return false;
        return true;
    }, [email, roleId]);

    return (
        <ModalContainer title='Invite User'>
            <ModalBody>
                <div className='flex gap-3 items-center p-3 mb-2 rounded bg-info/40'>
                    <Icon source={InfoCircleSvgIcon} isSvg />
                    <p className='text-sm'>
                        Invite a new business user to access your account. The
                        user will receive an email invitation to join and
                        collaborate on your business account.
                    </p>
                </div>

                <div className='gap-2 col-flex'>
                    <InputField
                        placeholder={'Email'}
                        label='Email'
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e);
                        }}
                    />
                    <SelectBox
                        label='Role'
                        value={roleId}
                        onChange={(role) => {
                            setRoleIds(role?.value);
                        }}
                        isRequired
                        options={userRolesList?.map((val) => ({
                            value: val?.id,
                            label: val?.name,
                            subLabel: val?.description,
                        }))}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='!justify-end py-2'>
                <Button outline onClick={() => Modal.close()}>
                    Close
                </Button>
                <Button
                    disabled={isButtonDisabled}
                    wide
                    appearance='success'
                    onClick={() => handleSubmit({ email, role_id: roleId })}
                >
                    Invite
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};

export default BusinessUserInviteModal;

export const openBusinessUserInviteModal = () => {
    return Modal.open({
        component: BusinessUserInviteModal,
        modalSize: 'sm',
        props: {
            callback: () => {
                Modal.close();
            },
        },
    });
};
export const openBusinessUserReassignRoleModal = (data: any) => {
    return Modal.open({
        component: BusinessUserReassignRoleModal,
        modalSize: 'sm',
        props: {
            data,
            callback: () => {
                Modal.close();
            },
        },
    });
};

export const BusinessUserReassignRoleModal = ({
    callback,
    data,
}: {
    callback?: (__: any) => void;
    data: any;
}) => {
    const { reassignRole } = useBusinessUserHook({
        refetch: () => {
            callback?.({});
            RefetchGenericListing();
        },
    });

    const [roleId, setRoleIds] = useState<number>(data?.role_id);
    const { userRolesList } = useGetUserRoles();

    const isButtonDisabled = useMemo(() => {
        if (!IsUndefinedOrNull(roleId)) return false;
        return true;
    }, [roleId]);

    return (
        <ModalContainer title='Reassign Role'>
            <ModalBody>
                <div className='flex gap-3 items-center p-3 mb-2 rounded bg-info/40'>
                    <Icon source={InfoCircleSvgIcon} isSvg />
                    <p className='text-sm'>
                        Reassign a new role to this business user. The
                        user&apos;s permissions and access will be updated
                        according to the selected role.
                    </p>
                </div>

                <div className='gap-2 col-flex'>
                    <SelectBox
                        label='Role'
                        value={roleId}
                        onChange={(role) => {
                            setRoleIds(role?.value);
                        }}
                        isRequired
                        options={userRolesList?.map((val) => ({
                            value: val?.id,
                            label: val?.name,
                            subLabel: val?.description,
                        }))}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='!justify-end py-2'>
                <Button outline onClick={() => Modal.close()}>
                    Close
                </Button>
                <Button
                    disabled={isButtonDisabled}
                    wide
                    appearance='success'
                    onClick={() =>
                        reassignRole({ role_id: roleId, id: data?.id })
                    }
                >
                    Reassign Role
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};
