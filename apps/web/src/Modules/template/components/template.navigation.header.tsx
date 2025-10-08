import { CheckCheck, Pencil, Settings2 } from 'lucide-react';

import { cn } from '@finnoto/design-system';

import { HeaderNavigationButton } from '../constants/template.format';
import { templateNavigationGuard } from '../constants/template.reducer';
import { useTemplate } from '../template.context';

const TemplateNavigationHeader = () => {
    const { activeStep, handleChangeStep } = useTemplate();

    const actions: HeaderNavigationButton[] = [
        {
            name: 'Setup Template',
            key: 'setup_template',
            icon: <Settings2 size={16} />,
        },
        {
            name: 'Edit Template',
            key: 'edit_template',
            icon: <Pencil size={16} />,
        },
    ];

    return (
        <div className='flex static gap-3 items-center p-1 rounded bg-base-100'>
            {actions?.map((_action) => {
                return (
                    <NavigationActionButton
                        {..._action}
                        key={_action?.key}
                        active={_action?.key === activeStep?.step}
                        onClick={() => {
                            templateNavigationGuard(() => {
                                handleChangeStep(_action?.key);
                            }, _action?.key === 'setup_template');
                        }}
                    />
                );
            })}
        </div>
    );
};
export default TemplateNavigationHeader;

const NavigationActionButton = (props: HeaderNavigationButton) => {
    const { icon, active, name, hasComplete, onClick } = props;
    return (
        <div
            onClick={onClick}
            className={cn(
                'flex gap-1 items-center p-2 text-sm rounded transition-all cursor-pointer hover:bg-info/10 hover:text-info',
                {
                    'bg-info/10 text-info': active,
                }
            )}
        >
            {hasComplete ? <CheckCheck className='text-success' /> : icon}
            <span>{name}</span>
        </div>
    );
};
