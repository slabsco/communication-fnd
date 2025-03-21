import { useMemo, useState } from 'react';

import {
    FormBuilderSubmitType,
    useFormBuilder,
    useUserHook,
    useUserProfileHook,
} from '@finnoto/core';
import {
    Button,
    Modal,
    ModalBody,
    ModalContainer,
} from '@finnoto/design-system';

import VerifyMobileOtp from '@Components/VerifyEmailMobileOtp/verifyMobileOtp.component';

const AddEditProfileMobile = ({ dialing_code, mobile }: any) => {
    const { changeMobile } = useUserProfileHook();
    const [otpSent, setOtpSent] = useState(false);

    const schema = {
        dialing_code: {
            type: 'number',
            placeholder: 'Enter Dial Code',
            label: 'Dialling Code',
            prefix: <div>+</div>,
            required: true,
            maxLength: 3,
        },
        mobile: {
            type: 'number',
            placeholder: 'Enter Mobile',
            label: 'Mobile Number',
            required: true,
            maxLength: 10,
        },
        otp: {
            type: 'text',
            label: 'Otp',
            required: false,
            maxLength: 6,
        },
    };

    const onSubmit: FormBuilderSubmitType = async (
        values: any,
        { setError, reset }
    ) => {
        const response: any = await changeMobile({ ...values });
        if (response?.sent_otp) setOtpSent(true);

        Modal.close();
    };

    const { getValues, renderFormFields, handleSubmit, watch, handleFormData } =
        useFormBuilder({
            formSchema: schema,
            onSubmit,
            initValues: { dialing_code, mobile },
        });

    return (
        <ModalContainer title={`Change  Mobile Number`} className='relative'>
            <ModalBody className='gap-4 col-flex'>
                {renderFormFields('dialing_code')}
                {renderFormFields('mobile')}

                {getValues('mobile') &&
                    getValues('dialing_code') &&
                    !otpSent && (
                        <Button onClick={() => handleSubmit()}>Send Otp</Button>
                    )}

                {otpSent && (
                    <VerifyMobileOtp
                        onEnterKeyPress={() => handleSubmit()}
                        onCountdownComplete={() => {
                            setOtpSent(false);
                            handleFormData('otp', undefined);
                        }}
                        otp={watch('otp')}
                        setOtp={(value) => handleFormData('otp', value)}
                    />
                )}

                {watch('otp')?.length === 4 && (
                    <Button onClick={handleSubmit}>Submit</Button>
                )}
            </ModalBody>
        </ModalContainer>
    );
};

export default AddEditProfileMobile;
