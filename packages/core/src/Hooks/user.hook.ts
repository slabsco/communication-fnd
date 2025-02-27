'use client';

import { useEffect, useState } from 'react';

import { USER } from '../Constants';
import { USER_DATA } from '../Models';
import {
    SubscribeToEvent,
    UnsubscribeEvent,
} from '../Utils/stateManager.utils';

interface ParamsDto {
    delay?: number; // delay is introduced in order to prevent weird behavior such as flash of login screen immediately and then redirect to desired page
}

export const useUserHook = ({ delay }: ParamsDto = {}) => {
    const [user, setUser] = useState<USER_DATA>({} as USER_DATA);

    const isOwner = (user_id: number) => {
        return user_id === user.business?.owner_id;
    };

    useEffect(() => {
        SubscribeToEvent({ eventName: USER, callback: setUserData });
        return () =>
            UnsubscribeEvent({ eventName: USER, callback: setUserData });
    }, []);

    const setUserData = (updateUser: any) => {
        if (user.loginCheckDone && !user.id && !updateUser.id) {
            return;
        }

        if (delay) {
            setTimeout(() => {
                setUser(updateUser);
            }, delay);
        } else {
            setUser(updateUser);
        }
    };

    return { user, isOwner };
};
