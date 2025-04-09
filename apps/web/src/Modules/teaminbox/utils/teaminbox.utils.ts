import { Navigation, TEAM_INBOX_SPLIT_LIST } from '@finnoto/core';

export const getErrorMessageTeamInbox = (message: any) => {
    if (message?.response?.error?.message) {
        return message?.response?.error?.message;
    }
    if (message?.attributes?.errors?.[0]?.error_data?.details) {
        return message.attributes.errors[0].error_data.details;
    }
    return 'An unknown error occurred';
};
export const navigateToTeamInboxDetail = (id: number, query?: any) => {
    Navigation.navigate({
        url: `${TEAM_INBOX_SPLIT_LIST}/${id}`,
        queryParam: query,
    });
};
