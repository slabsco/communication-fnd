import { createContext, ReactNode, useContext, useState } from 'react';

export type panelType = 'left' | 'right';

export interface TeamInboxUiContextType {
    isLeftPanelOpen?: boolean;
    isRightPanelOpen?: boolean;
    handleSwitchPanel?: (panel: panelType, value?: boolean) => void;
    toggleInboxPanel?: (panel: panelType) => void;
}

const TeamInboxUiContext = createContext<TeamInboxUiContextType>({});

export const TeamInboxUiProvider = ({ children }: { children: ReactNode }) => {
    // Detect if device is a tablet (width between 641px and 1024px, assume landscape and portrait)
    const isTablet =
        typeof window !== 'undefined'
            ? window.matchMedia('(min-width: 641px) and (max-width: 1124px)')
                  .matches
            : false;

    // On tablets, left panel starts closed. Otherwise, open.
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(() => !isTablet);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

    const handleSwitchPanel = (panel: panelType, value?: boolean) => {
        if (panel === 'left' && typeof value === 'boolean')
            setIsLeftPanelOpen(value);
        if (panel === 'right' && typeof value === 'boolean')
            setIsRightPanelOpen(value);
    };

    const toggleInboxPanel = (panel: panelType) => {
        if (panel === 'left') return setIsLeftPanelOpen((prev) => !prev);
        if (panel === 'right') return setIsRightPanelOpen((prev) => !prev);
    };

    return (
        <TeamInboxUiContext.Provider
            value={{
                isLeftPanelOpen,
                isRightPanelOpen,
                handleSwitchPanel,
                toggleInboxPanel,
            }}
        >
            {children}
        </TeamInboxUiContext.Provider>
    );
};

export const useTeamInboxUi = () => {
    const context = useContext(TeamInboxUiContext);
    if (context === undefined) {
        throw new Error(
            'useTeamInboxUi must be used within a TeamInboxUiProvider'
        );
    }
    return context;
};
