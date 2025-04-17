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

    const authenticateSocket = async (deviceIdentifier?: string) => {
        if (!socketRef.current) return;

        const USER_TOKEN = GetItem(ACCESS_TOKEN, false);

        try {
            await new Promise<void>((resolve, reject) => {
                socketRef.current?.emit(
                    'login',
                    {
                        token: USER_TOKEN,
                        u_device_identifier: deviceIdentifier,
                    },
                    (response: any) => {
                        if (response.error) {
                            reject(response.error);
                        } else {
                            console.log('Socket authentication successful');
                            resolve();
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Socket authentication failed:', error);
            throw error;
        }
    };

    useEffect(() => {
        const initializeSocket = () => {
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
        };

        initializeSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [SOCKET_SERVER_URL]);

    const emitEvent = (event: string, data: any) => {
        socketRef.current?.emit(event, data);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const subscribeEvent = (
        event: string,
        callback: (...args: any[]) => void
    ) => {
        socketRef.current?.on(event, callback);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const unsubscribeEvent = (
        event: string,
        callback: (...args: any[]) => void
    ) => {
        socketRef.current?.off(event, callback);
    };

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
                title: 'New Message Received !',
                description: `${payload?.contact?.name} sent a message!!`,
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
    }, [
        subscribeEvent,
        unsubscribeEvent,
        pathname,
        playSound,
        showMessageToast,
    ]);

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
