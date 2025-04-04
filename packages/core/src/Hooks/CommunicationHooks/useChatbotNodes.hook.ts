import { useQuery } from '@tanstack/react-query';

import { ChatbotNodesController } from '../../backend/communication/controller/chatbot.nodes.controller';
import { FetchData } from '../useFetchData.hook';

export const useChatbotNodes = () => {
    const { data, isLoading, refetch } = useQuery({
        cacheTime: Infinity,
        queryKey: ['chatbot_node'],
        queryFn: async () => {
            const { success, response } = await FetchData({
                className: ChatbotNodesController,
                method: 'list',
                classParams: {
                    limit: 50,
                },
            });

            if (success) return response?.records;
            return [];
        },
    });

    return {
        data,
        isLoading,
        refetch,
    };
};
