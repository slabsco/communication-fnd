import React, { useState } from 'react';
import { useList } from 'react-use';

import { KeywordMatchingTypeEnum } from '@finnoto/core/src/backend/communication/dto/create.keyword.detail.dto';

export const useKeywordActionUi = () => {
    const [keywords, { push: setKeyword, removeAt }] = useList([]);
    const [rageValue, setRageValue] = useState(KeywordMatchingTypeEnum.EXACT);
    const [fuzzyMatchingRage, setFuzzyMatchingRage] = useState(80);

    const [action_id, setActionId] = useState(null);

    return {
        keywords,
        setKeyword,
        removeAt,
        rageValue,
        setRageValue,
        fuzzyMatchingRage,
        setFuzzyMatchingRage,
        action_id,
        setActionId,
    };
};
