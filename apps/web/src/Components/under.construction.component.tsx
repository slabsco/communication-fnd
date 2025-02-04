import React from 'react';

import { UnderConstructionSvg } from 'assets';

const UnderConstructionComponent = () => {
    return (
        <div className='flex justify-center items-center h-content-screen'>
            <div className=''>
                <p className='mb-4 text-2xl font-bold text-center'>
                    Under Construction
                </p>
                <p className='text-center text-gray-600'>
                    {"We're"} working hard to bring you an amazing experience.
                    Please check back soon!
                </p>
                <UnderConstructionSvg />
            </div>
        </div>
    );
};

export default UnderConstructionComponent;
