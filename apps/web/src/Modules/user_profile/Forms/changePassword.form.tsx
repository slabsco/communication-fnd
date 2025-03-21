import {
    FetchData,
    FormBuilderFormSchema,
    FormBuilderSubmitType,
    toastBackendError,
} from '@finnoto/core';
import { UserProfileController } from '@finnoto/core/src/backend/communication/controller/user.profile.controller';
import {
    ConfirmAsyncUtil,
    FormBuilder,
    ModalBody,
    ModalContainer,
    Toast,
} from '@finnoto/design-system';

const ChangePasswordForm = ({ item, callback, isEdit }) => {
    const formSchema: FormBuilderFormSchema = {
        old_password: {
            type: 'password',
            placeholder: 'Enter old password',
            name: 'old_password',
            label: 'Old Password',
            required: true,
        },
        password: {
            type: 'password',
            placeholder: 'Enter new password',
            name: 'password',
            label: 'New Password',
            required: true,
            notValidRefKey: 'old_password',
            customErrorMessage: `Your old password can't be same as your New password`,
        },
        confirm_password: {
            type: 'password',
            refKey: 'password',
            placeholder: 'Re-Enter New Password',
            name: 'confirm_password',
            label: 'Confirm New Password',
            required: true,
        },
    };

    const onSubmit: FormBuilderSubmitType = async (values, { setError }) => {
        const confirm = await ConfirmAsyncUtil({
            title: `Confirm Password Change`,
            message: `Are you sure you want to reset your password?`,
            confirmAppearance: 'success',
        });

        if (!confirm) return;

        const { success, response } = await FetchData({
            className: UserProfileController,
            method: 'changePassword',
            classParams: {
                ...values,
            },
        });
        if (!success) {
            if (response.columns) setError(response.columns);
            toastBackendError(response);
            return;
        }
        callback(response);
        Toast.success({
            description: 'Successfully changed password',
        });
    };

    return (
        <ModalContainer title='Change Password'>
            <ModalBody className='pb-0'>
                <FormBuilder
                    formSchema={formSchema}
                    className='relative flex-1'
                    onSubmit={onSubmit}
                    buttonAppearance='primary'
                    buttonLabel='Save'
                />
            </ModalBody>
        </ModalContainer>
    );
};

export default ChangePasswordForm;
