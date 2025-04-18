import { useRouter } from 'next/router';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

import {
    ACCESS_TOKEN,
    GetItem,
    Navigation,
    TEAM_INBOX_SPLIT_LIST,
    UserBusiness,
} from '@finnoto/core';
import { Toast } from '@finnoto/design-system';

import { NEW_MESSAGE_RECEIVED_SOCKET_EVENT } from '../../Constants/socket.constant';
import { useNotificationSound } from '../../Modules/teaminbox/hooks/useNotificationSound.hook';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    emitEvent: (event: string, data: any) => void;
    subscribeEvent: (event: string, callback: (...args: any[]) => void) => void;
    unsubscribeEvent: (
        event: string,
        callback: (...args: any[]) => void
    ) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    emitEvent: () => {},
    subscribeEvent: () => {},
    unsubscribeEvent: () => {},
});

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const { playSound } = useNotificationSound();
    const { pathname } = useRouter();

    const SOCKET_SERVER_URL = UserBusiness.getBusinessAPIUrl();

    const authenticateSocket = useCallback(
        async (deviceIdentifier?: string) => {
            if (!socketRef.current) return;

            const USER_TOKEN = GetItem(ACCESS_TOKEN, false);

            return new Promise<void>((resolve, reject) => {
                socketRef.current?.emit(
                    'login',
                    {
                        token: USER_TOKEN,
                        u_device_identifier: deviceIdentifier,
                    },
                    (response: any) => {
                        if (response?.error) {
                            console.error(
                                'Socket authentication failed:',
                                response.error
                            );
                            reject(response.error);
                        } else {
                            console.log('Socket authentication successful');
                            resolve();
                        }
                    }
                );
            });
        },
        []
    );

    const initializeSocket = useCallback(() => {
        socketRef.current = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
            autoConnect: false,
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            authenticateSocket();
            console.log('Socket connected:', socketRef.current?.id);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        socketRef.current.connect();
    }, [SOCKET_SERVER_URL, authenticateSocket]);

    useEffect(() => {
        initializeSocket();
        return () => {
            socketRef.current?.disconnect();
        };
    }, [initializeSocket]);

    const emitEvent = useCallback((event: string, data: any) => {
        socketRef.current?.emit(event, data);
    }, []);

    const subscribeEvent = useCallback(
        (event: string, callback: (...args: any[]) => void) => {
            socketRef.current?.on(event, callback);
        },
        []
    );

    const unsubscribeEvent = useCallback(
        (event: string, callback: (...args: any[]) => void) => {
            socketRef.current?.off(event, callback);
        },
        []
    );

    const showMessageToast = useCallback(
        ({ team_inbox_id, payload }) => {
            playSound();

            Toast.info({
                delay: 5,
                onClick: () => {
                    Navigation.navigate({
                        url: `${TEAM_INBOX_SPLIT_LIST}/${team_inbox_id}`,
                    });
                },
                title: 'New Message Received!',
                description: `${payload?.contact?.name} sent a message!`,
            });
        },
        [playSound]
    );

    useEffect(() => {
        if (pathname.includes('team-inbox')) return;

        subscribeEvent(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, showMessageToast);
        return () => {
            unsubscribeEvent(
                NEW_MESSAGE_RECEIVED_SOCKET_EVENT,
                showMessageToast
            );
        };
    }, [pathname, subscribeEvent, unsubscribeEvent, showMessageToast]);

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                isConnected,
                emitEvent,
                subscribeEvent,
                unsubscribeEvent,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
