import Head from 'next/head';

import { PageTitleProps } from './pageTitle.types';

/**
 *
 * @param loading It show ths loading in the title
 * @param prefix It is the initial text thats shows after the children.
 * @param title It is the last text thats shows after the children.
 *
 *
 * @description this component shows the title of the page in the tab of the web browser.
 *
 * @returns Title of the page
 */
export const PageTitle = ({
    loading,
    title,
    prefix = 'Dart Inbox',
}: PageTitleProps) => {
    return (
        <Head>
            {loading ? (
                <title>Loading...</title>
            ) : (
                <title>{`${prefix}${title ? ' - ' + title : ''}`}</title>
            )}
        </Head>
    );
};
