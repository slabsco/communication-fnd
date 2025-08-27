import { ReactNode } from 'react';

import { TabsProps } from '../commonTab.types';

// This interface extends the TabsProps interface and adds an additional property called "appreance"
export interface AnimatedTabsProps extends TabsProps {
    appreance?: keyof typeof aniamtedTabsAppreanceType;
    contentContainerClass?: string; // Custom Content Container class
    containerClassName?: string; // Custom Container class, this is the parent component.
    tabListClassName?: string; // Custom Tab list class.
    middleSeparator?: ReactNode;
    rightComponent?: ReactNode;
    triggerClassName?: string;
    disableSwitch?: boolean;
    onTabClick?: (key: string) => void;
}

// This object defines the possible values for the "appreance" property of AnimatedTabsProps
export const aniamtedTabsAppreanceType = {
    primary: 'bg-primary', // Primary appearance class
    secondary: 'bg-secondary', // Secondary appearance class
    neutral: 'bg-neutral', // Secondary appearance class
    accent: 'bg-accent', // Accent appearance class
    info: 'bg-info', // Info appearance class
    success: 'bg-success', // Success appearance class
    warning: 'bg-warning', // Warning appearance class
    error: 'bg-error', // Error appearance class
};
