import Link from 'next/link';

import SetTemplateBodyContent from './set.template.body.content';
import SetTemplateFooter from './set.template.footer';
import SetTemplateMedia from './set.template.media';
import SetVariableSample from './set.variable.sample';

const SetTemplateContent = () => {
    return (
        <div className='p-3 pb-5 w-full rounded col-flex bg-base-100'>
            <h3 className='text-lg font-medium'>Content</h3>
            <h5 className='text-sm text-base-secondary'>
                Add a header, body and footer for your template. Cloud API
                hosted by Meta will review the template variables and content to
                protect the security and integrity of our services.{' '}
                <Link
                    href='https://www.meta.com/learn/meta-cloud-api'
                    target='_blank'
                    className='link link-hover'
                >
                    Learn More
                </Link>
            </h5>
            <div className='gap-3 col-flex'>
                <SetTemplateMedia />
                <SetTemplateBodyContent />
                <div className='p-3 text-xs text-blue-500 bg-blue-500/10'>
                    <strong>Note:</strong> Only named parameters are supported
                    for template variables. Please use the format{' '}
                    <code>{'{{your_variable_name}}'}</code> to define variables.
                </div>
                <SetVariableSample />
                <SetTemplateFooter />
            </div>
        </div>
    );
};

export default SetTemplateContent;
