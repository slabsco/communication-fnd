import { useEffect, useRef } from 'react';

export const useNotificationSound = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio element
        audioRef.current = new Audio(
            'https://sl-communications.s3.ap-south-1.amazonaws.com/new-notification-3-323602.mp3'
        );
        audioRef.current.preload = 'auto';
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Reset audio to start
            audioRef.current.play().catch((error) => {
                console.error('Error playing notification sound:', error);
            });
        }
    };

    return { playSound };
};
