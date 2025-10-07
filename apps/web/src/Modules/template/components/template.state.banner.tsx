import { BellIcon } from 'lucide-react';
import React from 'react';

import { useTemplate } from '../template.context';

const TemplateStateBanner = () => {
    const { state } = useTemplate();

    return (
        <div className='flex gap-4 items-center p-2 bg-base-100'>
            <div className='p-2 rounded bg-success text-success-content'>
                <BellIcon />
            </div>
            <div>
                <p className='flex gap-1 items-center text-lg font-medium'>
                    {state.name || 'your_template_name'}
                    <span className='w-1 h-1 bg-black rounded-full'></span>
                    {state.language || 'English'}
                </p>
                <p className='flex gap-1 items-center text-sm text-base-secondary'>
                    {state.category}
                    <span className='w-1 h-1 bg-gray-500 rounded-full'></span>
                    {state.type}
                </p>
            </div>
        </div>
    );
};

export default TemplateStateBanner;
