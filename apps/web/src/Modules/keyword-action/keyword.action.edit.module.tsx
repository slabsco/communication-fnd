import { useFetchParams, useKeywordAction } from '@finnoto/core';
import { PageLoader } from '@finnoto/design-system';

import KeywordActionCreationModule from './keyword.action.creation.module';

const KeywordActionEditModule = () => {
    const { id } = useFetchParams();
    const { keywordActions, isKeywordActionLoading } = useKeywordAction(id);

    if (isKeywordActionLoading) return <PageLoader />;

    return <KeywordActionCreationModule initialData={keywordActions} />;
};

export default KeywordActionEditModule;
