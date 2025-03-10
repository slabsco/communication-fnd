import { useMemo } from 'react';

import {
    HOME_ROUTE,
    KEYWORD_ACTION_LIST_ROUTE,
    Navigation,
    toastBackendError,
    useKeywordAction,
} from '@finnoto/core';
import {
    ArcBreadcrumbs,
    Button,
    Container,
    Wizard,
} from '@finnoto/design-system';

import AddActionsModule from './components/add.action.module';
import AddKeywordModule from './components/add.keyword.module';
import { useKeywordActionUi } from './hook/useKeywordActionUi.hook';

const KeywordActionCreationModule = () => {
    const {
        keywords,
        removeAt,
        setKeyword,
        rageValue,
        setRageValue,
        fuzzyMatchingRage,
        setFuzzyMatchingRage,
        action_id,
        setActionId,
    } = useKeywordActionUi();

    const { addKeyword } = useKeywordAction();

    const handleAddKeyWord = async () => {
        if (!action_id)
            toastBackendError(undefined, 'Please select the actions');

        await addKeyword({
            keywords,
            matching_type_id: rageValue,
            name: 'Action',
            action_id,
            fuzzy_matching_rage: fuzzyMatchingRage,
        });

        Navigation.navigate({ url: KEYWORD_ACTION_LIST_ROUTE });
    };

    const isNextDisabled = useMemo(() => {
        if (keywords?.length <= 0) return true;
        return false;
    }, [keywords?.length]);

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

            <Wizard
                className='overflow-hidden flex-1 rounded'
                stepWizardClassName='flex-1 overflow-hidden'
                renderCustomFooter={({ activeStep, handleJumpStep }) => {
                    return (
                        <div className='flex gap-2 justify-end'>
                            {activeStep != 1 && (
                                <Button
                                    onClick={() =>
                                        handleJumpStep(activeStep - 1)
                                    }
                                    defaultMinWidth
                                    outline
                                >
                                    Previous
                                </Button>
                            )}
                            {activeStep === 1 && (
                                <Button
                                    onClick={() => handleJumpStep(2)}
                                    defaultMinWidth
                                    disabled={isNextDisabled}
                                >
                                    Next
                                </Button>
                            )}
                            {activeStep === 2 && (
                                <Button
                                    onClick={handleAddKeyWord}
                                    defaultMinWidth
                                >
                                    Submit
                                </Button>
                            )}
                        </div>
                    );
                }}
                footerActionClassName='hidden'
                steps={[
                    {
                        title: 'Add Keyword',
                        key: 'add-keyword',
                        props: {
                            ...{
                                keywords,
                                setKeyword,
                                removeKeywordAt: removeAt,
                                rageValue,
                                setRageValue,
                                fuzzyMatchingRage,
                                setFuzzyMatchingRage,
                            },
                        },
                        component: AddKeywordModule,
                    },
                    {
                        title: 'Add Actions',
                        key: 'add-actions',
                        props: { setActionId },
                        component: AddActionsModule,
                    },
                ]}
            />
        </Container>
    );
};

export default KeywordActionCreationModule;
