import React from 'react';

import DefaultEditTemplate from '../default.edit.template';
import { useTemplate } from '../template.context';
import OneTimePasswordTemplate from './one.time.password.template';
import TemplateStateBanner from './template.state.banner';

const EditTemplate = () => {
    const { activeStep } = useTemplate();

    return (
        <div className='gap-4 w-full col-flex'>
            <TemplateStateBanner />
            {activeStep?.type === 'DEFAULT' && <DefaultEditTemplate />}
            {activeStep?.type === 'ONE_TIME_PASSWORD' && (
                <OneTimePasswordTemplate />
            )}
        </div>
    );
};

export default EditTemplate;
