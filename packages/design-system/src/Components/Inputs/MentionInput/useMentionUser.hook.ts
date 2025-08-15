import { useContext } from 'react';

import { MentionUserContext } from './mention.user.provider';

export const useMentionUsersApp = () => {
    const app = useContext(MentionUserContext);
    return app;
};
