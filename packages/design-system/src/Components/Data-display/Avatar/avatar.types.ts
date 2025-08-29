export interface AvatarProps {
    // Size of the avatar
    size?:
        | 'xs'
        | 'sm'
        | 'md'
        | 'lg'
        | 'xl'
        | 'polaris-xs'
        | '24'
        | '28'
        | '32'
        | '36'
        | '40'
        | '44';
    // Shape of the avatar
    shape?: 'circle' | 'rounded';
    // Color scheme of the avatar
    color?:
        | 'neutral'
        | 'primary'
        | 'secondary'
        | 'accent'
        | 'info'
        | 'warning'
        | 'error'
        | 'vendor'
        | 'polaris'
        | 'polaris-success'
        | 'polaris-error'
        | 'polaris-secondary'
        | 'polaris-orange'
        | 'orange'
        | 'success';
    // Icon component to be displayed in the avatar
    icon?: any;
    // Image source for the avatar
    source?: string;
    // Initials to be displayed if no image or icon is provided
    initial?: string;
    // CSS class for the icon color
    iconColorClass?: string;
    // Alternate text for the image
    alt?: string;
    // CSS class for the root container of the avatar component
    className?: string;
    // CSS class for the image wrapper element
    imageWrapperClassName?: string;
    // Flag indicating whether to use a random background color
    randomBg?: boolean;
    // Flag indicating whether to optimize the image loading
    unOptimizeImage?: boolean;
    iconSize?: number;

    // Custom size for the avatar
    customSize?: number;
}

export const iconColors = {
    'polaris-secondary': 'text-polaris-icon-secondary',
    'polaris-success': 'text-white',
    'polaris-error': 'text-white',
    'polaris-orange': 'text-polaris-icon-warning',
};
