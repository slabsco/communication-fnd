import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { InputField, ReferenceSelectBox } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

const SetTemplateNameLanguage = () => {
    const { dispatch, state } = useTemplate();

    return (
        <div className='gap-2 p-3 pb-5 w-full rounded col-flex bg-base-100'>
            <h3 className='text-lg font-medium'>Template name and language</h3>
            <div className='flex gap-2 items-center mt-2'>
                <InputField
                    label='Name your template'
                    className='w-full'
                    maxLength={512}
                    placeholder='Template name'
                />
                <ReferenceSelectBox
                    controller={CommunicationTemplateController}
                    method='findLanguage'
                    width={300}
                    placeholder='Select language'
                    label='Language'
                    labelKey='name'
                    sublabelKey='code'
                    isDisabled
                    disabled
                    value={1}
                />
            </div>
        </div>
    );
};

export default SetTemplateNameLanguage;
