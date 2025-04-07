import { useCallback } from 'react';

import {
    CHATBOT_LIST_ROUTE,
    FormatDisplayDate,
    HOME_ROUTE,
    IsFunction,
    Navigation,
} from '@finnoto/core';
import { ChatbotFLowController } from '@finnoto/core/src/backend/communication/controller/chatbot.flow.controller';
import {
    ArcBreadcrumbs,
    Badge,
    Button,
    ConfirmUtil,
    DropdownMenuActionProps,
    ReferenceSelectBox,
} from '@finnoto/design-system';

import { FlowBuilderApiProvider } from './flowbuilder.api.context';
import { FlowBuilderProvider, useFlowBuilder } from './flowbuilder.context';
import FlowBuilderMain from './flowbuilder.main';
import FlowBuilderPanel from './flowbuilder.panel';

const FlowBuilderModule = ({
    versionDetail,
    onSave,
    data,
    extraActions,
}: {
    versionDetail: any;
    data?: any;
    onSave: (data: any) => Promise<void>;
    extraActions?: DropdownMenuActionProps[];
}) => {
    return (
        <FlowBuilderApiProvider>
            <div className='flex overflow-hidden gap-3 items-center p-3 w-full h-content-screen'>
                <FlowBuilderProvider
                    rawJsonData={versionDetail?.raw_react_flow}
                >
                    <div className='overflow-hidden gap-1 w-full h-full col-flex'>
                        <ArcBreadcrumbs
                            mainClassName='rounded py-4 rounded-none pb-2'
                            title={versionDetail?.name}
                            route={[
                                { name: 'Home', link: HOME_ROUTE },
                                {
                                    name: 'Chatbots',
                                    link: CHATBOT_LIST_ROUTE,
                                },
                                { name: versionDetail?.name },
                            ]}
                            rightComponent={
                                <div className='flex gap-3 items-center'>
                                    {data?.version_id === versionDetail?.id && (
                                        <Badge
                                            label={'Active Flow'}
                                            appearance='success'
                                        />
                                    )}
                                    {versionDetail?.published_at && (
                                        <Badge
                                            label={`Published at: ${FormatDisplayDate(
                                                versionDetail?.published_at,
                                                true
                                            )}`}
                                            appearance='info'
                                        />
                                    )}

                                    <ReferenceSelectBox
                                        value={versionDetail?.id}
                                        placeholder='Select version'
                                        autoSelectZeroth
                                        width={200}
                                        size='sm'
                                        onChange={(opt) => {
                                            Navigation.search({
                                                version_id: opt.value,
                                            });
                                        }}
                                        isClearable={false}
                                        controller={ChatbotFLowController}
                                        method='findVersions'
                                        methodParams={data?.id}
                                    />
                                </div>
                            }
                            actions={[
                                // {
                                //     name: 'Export Json',
                                //     action: () => {
                                //         const jsonData = JSON.stringify(
                                //             versionDetail?.raw_react_flow,
                                //             null,
                                //             2
                                //         );
                                //         const blob = new Blob([jsonData], {
                                //             type: 'application/json',
                                //         });
                                //         const url = URL.createObjectURL(blob);
                                //         const a = document.createElement('a');
                                //         a.href = url;
                                //         a.download = 'flow_data.json';
                                //         document.body.appendChild(a);
                                //         a.click();
                                //         document.body.removeChild(a);
                                //         URL.revokeObjectURL(url);
                                //     },
                                // },
                                ...extraActions,
                            ]}
                        />

                        <FlowBuilderMain />
                        <ActionComponent
                            rawJsonData={versionDetail?.raw_react_flow}
                            onSave={
                                !versionDetail?.published_at
                                    ? onSave
                                    : undefined
                            }
                        />
                    </div>
                    <FlowBuilderPanel />
                </FlowBuilderProvider>
            </div>
        </FlowBuilderApiProvider>
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

            {IsFunction(onSave) && (
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
            )}
        </div>
    );
};
