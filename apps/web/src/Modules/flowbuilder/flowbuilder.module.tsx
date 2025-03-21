import { CHATBOT_LIST_ROUTE, HOME_ROUTE, Navigation } from '@finnoto/core';
import {
    ArcBreadcrumbs,
    Button,
    DropdownMenuActionProps,
} from '@finnoto/design-system';

import DropdownActionButton from '../../Components/DropdownButton/dropdown.action.button';
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
                <div className='overflow-hidden gap-3 w-full h-full col-flex'>
                    <ArcBreadcrumbs
                        mainClassName='rounded py-4 rounded-none pb-2'
                        title={'Configure Client'}
                        route={[
                            { name: 'Home', link: HOME_ROUTE },
                            { name: 'Chatbots', link: CHATBOT_LIST_ROUTE },
                            { name: name },
                        ]}
                    />
                    <FlowBuilderMain />
                    <ActionComponent
                        extraActions={extraActions}
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
    extraActions: DropdownMenuActionProps[];
    onSave: (data: any) => Promise<void>;
}> = ({ onSave, extraActions = [] }) => {
    const { getAllData } = useFlowBuilder();

    return (
        <div className='flex gap-3 justify-end p-3 w-full rounded shadow-lg bg-base-100'>
            <Button
                outline
                size='sm'
                defaultMinWidth
                appearance='error'
                onClick={() => {
                    Navigation.back();
                }}
            >
                Back
            </Button>

            <DropdownActionButton
                actions={[
                    {
                        name: 'Export Json',
                        action: () => {
                            const data = getAllData();
                            const jsonData = JSON.stringify(data, null, 2);
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
