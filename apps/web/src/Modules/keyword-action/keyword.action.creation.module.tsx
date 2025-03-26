import { useMemo } from 'react';

import {
    HOME_ROUTE,
    KEYWORD_ACTION_LIST_ROUTE,
    Navigation,
    toastBackendError,
    useKeywordAction,
} from '@finnoto/core';
import { ArcBreadcrumbs, Button, Container } from '@finnoto/design-system';

import AddActionsModule from './components/add.action.module';
import AddKeywordModule from './components/add.keyword.module';
import { useKeywordActionUi } from './hook/useKeywordActionUi.hook';

const KeywordActionCreationModule = ({
    initialData,
}: {
    initialData?: any;
}) => {
    const {
        keywords,
        removeAt,
        setKeyword,
        rageValue,
        setRageValue,
        fuzzyMatchingRage,
        setFuzzyMatchingRage,
        action_ids,
        setActionId,
    } = useKeywordActionUi(initialData);

    const { addKeyword } = useKeywordAction();

    const handleAddKeyWord = async () => {
        if (!action_ids?.length)
            return toastBackendError(undefined, 'Please select the actions');

        const data = await addKeyword({
            id: initialData?.id,
            keywords,
            matching_type_id: rageValue,
            name: 'Action',
            action_ids,
            fuzzy_matching_rage: fuzzyMatchingRage,
        });

        if (data) Navigation.navigate({ url: KEYWORD_ACTION_LIST_ROUTE });
    };

    const isSubmitDisabled = useMemo(() => {
        if (keywords?.length && action_ids?.length) return false;
        return true;
    }, [action_ids, keywords?.length]);

    const defaultActions = useMemo(() => {
        return initialData?.actions.map((act) => {
            return act?.action;
        });
    }, [initialData?.actions]);

    return (
        <Container className='overflow-hidden py-4 col-flex h-content-screen'>
            <ArcBreadcrumbs
                mainClassName='rounded py-4 rounded-none pb-2'
                title={'Keyword Actions'}
                route={[
                    { name: 'Home', link: HOME_ROUTE },
                    { name: 'keyword Action' },
                ]}
            />

            <div className='overflow-hidden flex-1 gap-2 p-2 col-flex bg-base-100'>
                <div className='gap-2 col-flex'>
                    <h3 className='px-2 text-lg font-medium'>Step 1</h3>
                    <div className='bg-gray-100 rounded'>
                        <AddKeywordModule
                            {...{
                                keywords,
                                setKeyword,
                                removeKeywordAt: removeAt,
                                rageValue,
                                setRageValue,
                                fuzzyMatchingRage,
                                setFuzzyMatchingRage,
                            }}
                        />
                    </div>
                </div>
                <div className='overflow-hidden flex-1 pt-2 border-t col-flex'>
                    <h3 className='px-2 text-lg font-medium'>Step 2</h3>
                    <AddActionsModule
                        initialData={defaultActions}
                        setActionId={(action_ids) => setActionId(action_ids)}
                    />
                </div>
            </div>

            <div className='flex gap-2 justify-end p-3 bg-base-100'>
                <Button
                    onClick={() => {
                        Navigation.back();
                    }}
                    outline
                    disabled={isSubmitDisabled}
                    defaultMinWidth
                >
                    Back
                </Button>
                <Button
                    onClick={handleAddKeyWord}
                    disabled={isSubmitDisabled}
                    defaultMinWidth
                >
                    Submit
                </Button>
            </div>
        </Container>
    );
};

export default KeywordActionCreationModule;
