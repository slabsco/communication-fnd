import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';

import { ACCESS_TOKEN, GetItem, UserBusiness } from '@finnoto/core';

import { NEW_MESSAGE_RECEIVED_SOCKET_EVENT } from '../../Constants/socket.constant';
import { RefetchTeamInboxListing } from '../../Modules/teaminbox/hooks/useTeamInboxMessageListing.hook';

interface SocketContextType {
    subscribeEvent: (event: string, callback: (...args: any[]) => void) => void;
    unsubscribeEvent: (event: string) => any;
}

const SocketContext = createContext<SocketContextType>({
    subscribeEvent: () => {},
    unsubscribeEvent: () => {},
});

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const socketRef = useRef<Socket | null>(null);

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
            authenticateSocket();
            console.log('Socket connected:', socketRef.current?.id);
        });

        socketRef.current.on('disconnect', () => {
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
            socketRef.current?.removeAllListeners();
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [initializeSocket]);

    const unsubscribeEvent = (event: string) => {
        socketRef.current?.off(event);
    };

    useEffect(() => {
        const handler = (...args: any[]) => {
            console.log(
                `[Socket Event Received]: ${NEW_MESSAGE_RECEIVED_SOCKET_EVENT}`,
                ...args
            );
            RefetchTeamInboxListing();
        };

        socketRef.current?.on(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, handler);

        return () => {
            socketRef.current?.off(NEW_MESSAGE_RECEIVED_SOCKET_EVENT, handler);
        };
    }, []);

    const subscribeEvent = useCallback(
        (event: string, callback: (...args: any[]) => void) => {
            return socketRef.current?.on(event, callback);
        },
        []
    );

    return (
        <SocketContext.Provider
            value={{
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
