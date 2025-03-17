import { useMemo, useState } from 'react';
import { useList } from 'react-use';

import { KeywordMatchingTypeEnum } from '@finnoto/core/src/backend/communication/dto/create.keyword.detail.dto';

export const useKeywordActionUi = (initialData?: any) => {
    const [keywords, { push: setKeyword, removeAt }] = useList(
        (initialData?.keywords as string[]) || []
    );
    const [rageValue, setRageValue] = useState(
        initialData?.matching_type_id || KeywordMatchingTypeEnum.EXACT
    );
    const [fuzzyMatchingRage, setFuzzyMatchingRage] = useState(
        initialData?.attributes?.fuzzy_matching_rage || 80
    );

    const defaultActionIds = useMemo(() => {
        return initialData?.actions?.map((data) => data?.action_id);
    }, [initialData]);

    const [action_ids, setActionId] = useState(defaultActionIds || null);

    return {
        keywords,
        setKeyword,
        removeAt,
        rageValue,
        setRageValue,
        fuzzyMatchingRage,
        setFuzzyMatchingRage,
        action_ids,
        setActionId,
    };
};
