import { useCallback } from 'react';

import { CHATBOT_LIST_ROUTE, HOME_ROUTE, Navigation } from '@finnoto/core';
import {
    ArcBreadcrumbs,
    Button,
    ConfirmUtil,
    DropdownMenuActionProps,
} from '@finnoto/design-system';

import { FlowBuilderProvider, useFlowBuilder } from './flowbuilder.context';
import FlowBuilderMain from './flowbuilder.main';
import FlowBuilderPanel from './flowbuilder.panel';

const FlowBuilderModule = ({
    rawJsonData,
    name,
    onSave,
    extraActions,
}: {
    rawJsonData: any;
    name: string;
    onSave: (data: any) => Promise<void>;
    extraActions?: DropdownMenuActionProps[];
}) => {
    return (
        <div className='flex overflow-hidden gap-3 items-center p-3 w-full h-content-screen'>
            <FlowBuilderProvider rawJsonData={rawJsonData}>
                <div className='overflow-hidden gap-1 w-full h-full col-flex'>
                    <ArcBreadcrumbs
                        mainClassName='rounded py-4 rounded-none pb-2'
                        title={'Configure Client'}
                        route={[
                            { name: 'Home', link: HOME_ROUTE },
                            { name: 'Chatbots', link: CHATBOT_LIST_ROUTE },
                            { name: name },
                        ]}
                        actions={[
                            {
                                name: 'Export Json',
                                action: () => {
                                    const data = rawJsonData;

                                    const jsonData = JSON.stringify(
                                        data,
                                        null,
                                        2
                                    );
                                    const blob = new Blob([jsonData], {
                                        type: 'application/json',
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'flow_data.json';
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                },
                            },
                            ...extraActions,
                        ]}
                    />
                    <FlowBuilderMain />
                    <ActionComponent
                        rawJsonData={rawJsonData}
                        onSave={onSave}
                    />
                </div>
                <FlowBuilderPanel />
            </FlowBuilderProvider>
        </div>
    );
};

export default FlowBuilderModule;

const ActionComponent: React.FC<{
    onSave: (data: any) => Promise<void>;
    rawJsonData: any;
}> = ({ onSave, rawJsonData }) => {
    const { getAllData } = useFlowBuilder();

    const hasNodeChanged = useCallback(
        (updatedJson: any) => {
            return JSON.stringify(rawJsonData) !== JSON.stringify(updatedJson);
        },
        [rawJsonData]
    );

    return (
        <div className='flex gap-3 justify-end p-3 w-full rounded shadow-lg bg-base-100'>
            <Button
                outline
                size='sm'
                defaultMinWidth
                onClick={() => {
                    const data = getAllData();
                    const hasChanged = hasNodeChanged(data);

                    if (!hasChanged) return Navigation.back();

                    ConfirmUtil({
                        isArc: true,
                        appearance: 'warning',
                        title: 'Go Back?',
                        message:
                            'Are you sure you want to go back? Any unsaved changes will be lost.',
                        isReverseAction: true,
                        onConfirmPress: async () => {
                            Navigation.back();
                        },
                        confirmText: 'Go Anyway',
                    });
                }}
            >
                Back
            </Button>

            <Button
                defaultMinWidth
                size='sm'
                progress
                appearance='success'
                onClick={async (next) => {
                    const data = getAllData();
                    await onSave?.(data);
                    next();
                }}
            >
                Save
            </Button>
        </div>
    );
};
