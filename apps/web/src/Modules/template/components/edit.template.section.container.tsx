import Link from 'next/link';
import React, { ReactNode } from 'react';

type EditTemplateSectionContainerProps = {
    title: string;
    description: string;
    link?: {
        link: string;
        text: string;
    };
    children: ReactNode;
};

const EditTemplateSectionContainer = ({
    title,
    description,
    link,
    children,
}: EditTemplateSectionContainerProps) => {
    return (
        <div className='p-3 pb-5 w-full rounded col-flex bg-base-100'>
            <h3 className='text-lg font-medium'>{title}</h3>
            <h5 className='text-sm text-base-secondary'>
                {description}{' '}
                {link && (
                    <Link
                        href={link?.link}
                        target='_blank'
                        className='link link-hover'
                    >
                        {link?.text}
                    </Link>
                )}
            </h5>
            <div className='gap-3 col-flex'>{children}</div>
        </div>
    );
};

export default EditTemplateSectionContainer;
