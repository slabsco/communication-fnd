'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { IsValidString, useApp } from '@finnoto/core';

import { cn } from '../../../Utils/common.ui.utils';
import { Icon } from '../Icon/icon.component';
import { AvatarProps, iconColors } from './avatar.types';
import { GetInitials } from './avatar.utils';

export const arcBgList = [
    'bg-polaris-avatar-one-bg-fill text-polaris-avatar-one-text-on-bg-fill',
    'bg-polaris-avatar-three-bg-fill text-polaris-avatar-three-text-on-bg-fill',
    'bg-polaris-avatar-four-bg-fill text-polaris-avatar-four-text-on-bg-fill',
];

// Avatar component
export const Avatar = ({
    size = 'md', // Default value for the size prop is 'md'
    shape = 'rounded', // Default value for the shape prop is 'rounded'
    color = 'primary', // Default value for the color prop is 'primary'
    alt = 's', // Default value for the alt prop is 's'
    initial, // Initials for the avatar
    icon, // Icon for the avatar
    source, // Image source for the avatar
    iconColorClass, // CSS class for the icon color
    className = '', // Additional CSS class for the avatar component
    imageWrapperClassName = '', // Additional CSS class for the image wrapper
    randomBg, // Flag to indicate whether to use a random background color
    unOptimizeImage = false, // Flag to indicate whether to optimize the image
    iconSize: propsIconSize, // Size of the icon
    customSize, // Custom size for the avatar
}: AvatarProps) => {
    const [imageLoaded, setImageLoaded] = useState(!source ? false : true); // State to track if the image has loaded

    const { isArc } = useApp();

    useEffect(() => {
        setImageLoaded(!source ? false : true); // Update the imageLoaded state when the source prop changes
    }, [source]);

    // List of background colors for the avatar
    const bgList = useMemo(
        () => [
            'bg-primary/60 text-primary-content',
            'bg-secondary/60 text-secondary-content',
            'bg-accent/60 text-accent-content',
            'bg-success/60 text-primary-content',
            'bg-error/60 text-primary-content',
            'bg-warning/60 text-primary-content',
            'bg-info/60 text-primary-content',
        ],
        []
    );

    // CSS classes for the avatar component
    const avatarClass = cn({
        placeholder: !source, // Add 'placeholder' class if no image source is provided
    });

    // CSS classes for the placeholder text
    const placeHolderClass = cn('uppercase font-semibold', {
        'text-3xl': size === 'xl',
        'text-xl': size === 'lg',
        'text-base': size === 'md',
        'text-sm': size === 'sm',
        'text-xs': size === 'xs',
    });

    // CSS classes for the image wrapper
    let imageWrapper = cn(
        {
            // Background colors based on the color prop and image load status
            'bg-neutral text-neutral-content':
                color === 'neutral' && !randomBg && !imageLoaded,
            'bg-primary text-primary-content':
                color === 'primary' && !randomBg && !imageLoaded,
            'bg-secondary text-secondary-content':
                color === 'secondary' && !randomBg && !imageLoaded,
            'bg-accent text-accent-content':
                color === 'accent' && !randomBg && !imageLoaded,
            'bg-[#A767061A] text-[#A76706] dark:text-[#ff9a00]':
                color === 'vendor' && !randomBg && !imageLoaded,
            'bg-info text-info-content':
                color === 'info' && !randomBg && !imageLoaded,
            'bg-warning text-warning-content':
                color === 'warning' && !randomBg && !imageLoaded,
            'bg-success text-success-content':
                color === 'success' && !randomBg && !imageLoaded,
            'bg-error text-error-content':
                color === 'error' && !randomBg && !imageLoaded,
            'bg-polaris-avatar-one-bg-fill text-polaris-avatar-one-text-on-bg-fill':
                color === 'polaris' && !randomBg && !imageLoaded,
            'bg-polaris-bg-fill-success text-polaris-text-success-on-bg-fill':
                color === 'polaris-success' && !randomBg && !imageLoaded,
            'bg-polaris-bg-fill-critical text-polaris-text-critical-on-bg-fill':
                color === 'polaris-error' && !randomBg && !imageLoaded,
            'bg-polaris-bg-fill-secondary text-polaris-text':
                color === 'polaris-secondary' && !randomBg && !imageLoaded,
            'bg-polaris-bg-fill-warning text-polaris-text-warning-on-bg-fill':
                color === 'polaris-orange' && !randomBg && !imageLoaded,

            // Default background color and text color when image is loaded
            'bg-base-300/40 text-primary': !randomBg && imageLoaded,
            // Size classes based on the size prop
            'h-32 w-32': size === 'xl',
            'h-[64px] w-[64px]': size === 'lg',
            'h-[49px] w-[49px]': size === 'md',
            'h-10 w-10': size === 'sm',
            'h-7 w-7': size === 'xs',
            'w-5 h-5 text-[11px]': size === 'polaris-xs',
            'w-6 h-6 text-[11px]': size === '24',
            'w-7 h-7': size === '28',
            'w-8 h-8': size === '32',
            'w-9 h-9': size === '36',
            'w-10 h-10': size === '40',
            'w-11 h-11': size === '44',
            // Shape classes based on the shape prop
            'rounded-full': shape && shape === 'circle',
            'rounded-btn': shape && shape === 'rounded',
        },
        imageWrapperClassName
    );

    // Add a random background color class if randomBg prop is true
    if (randomBg && !isArc) {
        imageWrapper +=
            ' ' + bgList[Math.floor(Math.random() * (bgList.length - 1))];
    }

    if (isArc && randomBg) {
        imageWrapper +=
            ' ' + arcBgList[Math.floor(Math.random() * (arcBgList.length - 1))];
    }

    // Image size based on the size prop
    const imageSize = useMemo(() => {
        switch (size) {
            case 'xs':
                return 14;
            case 'sm':
                return 24;
            case 'lg':
                return 50;
            default:
                return 96;
        }
    }, [size]);

    // Icon size based on the size prop
    const iconSize = useMemo(() => {
        switch (size) {
            case 'xs':
                return 12;
            case 'sm':
                return 22;
            case 'md':
                return 24;
            case 'lg':
                return 32;
            default:
                return 24;
        }
    }, [size]);

    const altName = useMemo(() => {
        if (initial) return initial;

        if (size === 'xs' || size === 'polaris-xs')
            return GetInitials(alt).charAt(0);

        const name = GetInitials(alt);
        if (!name && IsValidString(alt)) {
            return alt.substring(0, 2);
        }
        return name;
    }, [alt, initial, size]);

    return (
        <div className={cn('avatar', avatarClass, className)}>
            <div className={imageWrapper}>
                {imageLoaded && source ? (
                    <Image
                        src={source}
                        onError={() => setImageLoaded(false)}
                        alt={alt || 'avatar'}
                        width={customSize ?? imageSize}
                        height={customSize ?? imageSize}
                        unoptimized={unOptimizeImage}
                    />
                ) : (
                    <span className={placeHolderClass}>
                        {icon ? (
                            <Icon
                                iconColor={cn(
                                    iconColors[color],
                                    iconColorClass
                                )}
                                source={icon}
                                size={propsIconSize || iconSize}
                                isSvg
                            />
                        ) : (
                            <>{altName}</>
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};
