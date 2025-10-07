import React from 'react';

import SetTemplateButton from './components/set.template.buttons';
import SetTemplateContent from './components/set.template.content';
import SetTemplateNameLanguage from './components/set.template.name.language';

const DefaultEditTemplate = () => {
    return (
        <>
            <SetTemplateNameLanguage />
            <SetTemplateContent />
            <SetTemplateButton />
        </>
    );
};

export default DefaultEditTemplate;
