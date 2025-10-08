import { useTemplate } from '../template.context';
import EditTemplate from './edit.template';
import SetupTemplate from './setup.template';

const TemplateLayout = () => {
    const { state, activeStep } = useTemplate();

    return (
        <div className='flex overflow-hidden overflow-y-auto flex-1 gap-3 rounded scrollbar-xs'>
            {activeStep?.step === 'setup_template' && <SetupTemplate />}
            {activeStep?.step === 'edit_template' && <EditTemplate />}
        </div>
    );
};

export default TemplateLayout;
