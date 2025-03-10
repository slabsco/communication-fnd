'use client';

import { useEffect, useState } from 'react';

import { SubscribeToEvent, UnsubscribeEvent } from '@finnoto/core';

export const useWizardFooter = ({ activeWizardKey, onNext }) => {
    const [data, setData] = useState<any>();

    useEffect(() => {
        const handleFormState = ({
            isSubmitting,
            handleSubmit,
            disableSubmit,
        }) => {
            setData({ isSubmitting, handleSubmit, disableSubmit });
        };
        SubscribeToEvent({
            eventName: activeWizardKey,
            callback: handleFormState,
        });

        return () =>
            UnsubscribeEvent({
                eventName: activeWizardKey,
                callback: handleFormState,
            });
    }, [activeWizardKey]);

    const { isSubmitting, handleSubmit, disableSubmit } = data || {};

    const handleNext = (_, e) => {
        if (handleSubmit) {
            handleSubmit(e);
            return;
        }
        onNext();
    };

    return {
        isSubmitting,
        handleSubmit,
        disableSubmit,
        handleNext,
    };
};
