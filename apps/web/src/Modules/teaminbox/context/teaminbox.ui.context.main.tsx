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
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
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
