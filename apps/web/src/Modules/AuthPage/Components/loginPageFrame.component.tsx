import Link from 'next/link';
import { ReactNode } from 'react';

import { useTheme } from '@finnoto/core';
import { cn, PageTitle, Typography } from '@finnoto/design-system';

const LoginPageFrame = ({
    children,
    className,
    frameClassName,
}: {
    children: ReactNode;
    className?: string;
    frameClassName?: string;
}) => {
    return (
        <div
            className={cn(
                'py-10 h-full min-h-screen 2xl:h-screen centralize bg-base-200 bg-login-background',
                frameClassName
            )}
        >
            <div
                className={cn(
                    'overflow-hidden rounded shadow-lg bg-base-100 col-flex min-w-[470px] dark:shadow-none dark:border',
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
};

export const AuthenticationUIWrapper = ({
    children,
    pageTitle,
    title,
    subTitle,
    containerClassName,
    headerClassName,
}: {
    children: ReactNode;
    pageTitle?: string;
    title?: string;
    subTitle?: string | ReactNode;
    containerClassName?: string;
    headerClassName?: string;
}) => {
    const pageTitleText = pageTitle || title;
    const { isDarkMode } = useTheme();

    return (
        <div className='flex-1 px-8 py-6 h-full col-flex'>
            <PageTitle title={pageTitleText} />
            <div className='mb-6 centralize'>
                {/* {process.env['SMALL_LOGO'] ? (
                    <Image
                        src={process.env['SMALL_LOGO']}
                        alt='Brand Logo'
                        height={48}
                        width={48}
                        style={{
                            maxHeight: 48,
                            maxWidth: 48,
                            objectFit: 'contain',
                            objectPosition: 'center',
                        }}
                        unoptimized
                        priority
                    />
                ) : (
                    <Icon
                        source={isDarkMode ? SmallLogoSvgIcon : DarkLogoSvgIcon}
                        isSvg
                        size={48}
                    />
                )} */}
            </div>
            <div
                className={cn(
                    'gap-2 text-center col-flex max-w-[500px]',
                    headerClassName
                )}
            >
                <Typography variant='h1' size='2xl' weight='bold'>
                    {title}
                </Typography>
                <Typography size='large'>{subTitle}</Typography>
            </div>
            <div
                className={cn(
                    'overflow-hidden flex-1 mt-6 h-full col-flex',
                    containerClassName
                )}
            >
                {children}
            </div>
            <div className='mt-1 centralize'>
                <Link
                    className='link link-hover'
                    href={'https://dartinbox.com'}
                >
                    Go To Website
                </Link>
            </div>
        </div>
    );
};

export const AuthenticationUIFooter = ({
    route,
    text,
    link,
}: {
    route?: string;
    text?: string;
    link?: string;
}) => {
    return (
        <div className='gap-2 justify-center items-center text-center row-flex'>
            <Typography variant='span'>{text}</Typography>{' '}
            <Link className='link link-hover' href={route}>
                {link}
            </Link>
        </div>
    );
};

export default LoginPageFrame;
