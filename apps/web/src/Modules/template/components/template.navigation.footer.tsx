import { Button } from '@finnoto/design-system';

import { useTemplate } from '../template.context';

const TemplateNavigationFooter = () => {
    const { state, prev, next } = useTemplate();
    return (
        <div className='flex static gap-3 justify-between items-center p-4 rounded bg-base-100'>
            <Button outline disabled={!state.canGoPrev} onClick={prev}>
                Back
            </Button>
            <Button
                appearance='primary'
                defaultMinWidth
                disabled={!state.canGoNext}
                onClick={next}
            >
                {state.activeStep === 'submit_review' ? 'Submit' : 'Next'}
            </Button>
        </div>
    );
};
