import * as ICONS from 'lucide-react';
import { createContext, useContext, useMemo } from 'react';

import { useChatbotNodes } from '@finnoto/core';
import { PageLoader } from '@finnoto/design-system';

interface FlowBuilderApiContextType {
    availableNodes: any;
}

const FlowBuilderApiContext = createContext<FlowBuilderApiContextType>({
    availableNodes: [],
});

export const FlowBuilderApiProvider = ({ children }) => {
    const { data, isLoading } = useChatbotNodes();

    const availableNodes = useMemo(() => {
        if (!data) return {};

        return Object?.fromEntries(
            data?.map((val) => {
                const IconComponent = ICONS[val?.icon];

                return [
                    [val?.identifier],
                    {
                        title: val?.title,
                        sub_title: val?.sub_title,
                        type: val?.type,
                        style: val?.style,
                        identifier: val?.identifier,
                        description: val?.description,
                        attributes: val?.attributes,
                        icon: IconComponent ? (
                            <IconComponent size={16} />
                        ) : null,
                    },
                ];
            })
        );
    }, [data]);

    const values = {
        availableNodes,
    };
    return (
        <FlowBuilderApiContext.Provider value={values}>
            {isLoading ? <PageLoader /> : children}
        </FlowBuilderApiContext.Provider>
    );
};

export const useFlowBuilderApi = () => {
    return useContext(FlowBuilderApiContext);
};
