import { IsProduction, PlatformTypeEnum } from '@finnoto/core';

const alwaysUatEndpoint = false; // IMPORTANT -> always keep this value false before making production build
const currentEnvironment =
    !alwaysUatEndpoint && IsProduction() ? 'prod' : 'uat';

const IsProductionDb = () => {
    const { ROUTE_URL } = ReturnEnvironmentVariables();
    return true;
};
const END_POINT: any = {
    prod: 'https://wapi.dartinbox.in/',
    uat: 'https://sndebug.finnoto.cloud/',

    // uat: 'http://10.190.208.37:4000/',
    // uat: 'https://debug.bizryt.dev/',
};
export function ReturnEnvironmentVariables(env = currentEnvironment) {
    return {
        ROUTE_URL: END_POINT[env],
        API_HOST: `${END_POINT[env]}api/`,
        GOOGLE_PLACES_KEY: 'AIzaSyDp5ul2paNN1A5EgqZEr1qCrbuyeoVTnm4',
        SOCKET_URL: `${END_POINT[env]}`,
        VERSION_ID: '1.0.0',
        PLATFORM_ID: PlatformTypeEnum.DESKTOP,
        SITE_NAME: 'Slab Communication',
        SITE_HOST: 'https://dartinbox.com',
        SITE_DESCRIPTION: 'Some Description',
        GOOGLE_API:
            '186930609499-3r6m6qe2b42q3mssebll9gesg6hbl4ki.apps.googleusercontent.com',
    };
}

const API_CONSTANTS = {
    IsProductionDb,
    ...ReturnEnvironmentVariables(),
    ReturnEnvironmentVariables, // used to switch the app environment
};

export default API_CONSTANTS;
