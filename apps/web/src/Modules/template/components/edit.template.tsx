import React from 'react';

import DefaultEditTemplate from '../default.edit.template';
import { useTemplate } from '../template.context';
import TemplateStateBanner from './template.state.banner';

const EditTemplate = () => {
    const { state, activeStep } = useTemplate();
    return (
        <div className='gap-4 w-full col-flex'>
            <TemplateStateBanner />
            {activeStep?.type === 'DEFAULT' && <DefaultEditTemplate />}
        </div>
    );
};

export default EditTemplate;
