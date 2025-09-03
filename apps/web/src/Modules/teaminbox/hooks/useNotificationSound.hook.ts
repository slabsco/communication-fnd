import { useEffect, useRef } from 'react';

export function playNotificationSound() {
    const audio = new Audio(
        'https://sl-communications.s3.ap-south-1.amazonaws.com/new-notification-3-323602.mp3'
    );
    audio.preload = 'auto';
    audio.currentTime = 0;
    audio.play().catch((error) => {
        console.error('Error playing notification sound:', error);
    });
}
