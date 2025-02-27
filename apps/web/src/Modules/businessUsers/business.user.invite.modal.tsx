import { RefetchGenericListing, useBusinessUserHook } from '@finnoto/core';
import {
    FormBuilder,
    Icon,
    Modal,
    ModalBody,
    ModalContainer,
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

    const schema = {
        email: {
            type: 'text',
            placeholder: 'Enter the email of the user here',
            required: true,
        },
    };

    const handleSubmit = async (values: any) => {
        await inviteUser(values);
        return callback?.(values);
    };

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

                <FormBuilder
                    formSchema={schema}
                    onSubmit={handleSubmit}
                    buttonLabel='Send Invitation'
                />
            </ModalBody>
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
