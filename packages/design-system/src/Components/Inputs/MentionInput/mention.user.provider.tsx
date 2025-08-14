import { createContext, useMemo } from 'react';

import { ObjectDto, PRODUCT_IDENTIFIER, useApp } from '@finnoto/core';
import useUsersContext from '@finnoto/core/src/Hooks/ChatHook/getMentionContext';

export interface MentionUserData {
    mentionUserContext?: ObjectDto[] | null;
}

export const MentionUserContext = createContext<MentionUserData>({
    mentionUserContext: [],
});

export const MentionUserContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { data: mentionUser = [] } = useUsersContext({
        method: 'getUsers',
        type: 'business_users',
    });

    const value = useMemo(() => {
        return { mentionUserContext: mentionUser };
    }, [mentionUser]);

    return (
        <MentionUserContext.Provider value={value}>
            {children}
        </MentionUserContext.Provider>
    );
};
