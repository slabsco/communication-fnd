import { useMemo, useState } from 'react';

import { ActionTypeEnum } from '@finnoto/core/src/backend/communication/controller/keyword.details.controller';
import { cn } from '@finnoto/design-system';

import AssignToUserComponent from './assign.to.user.component';

const AddActionsModule = ({ setActionId }: { setActionId: () => void }) => {
    const [active, setActive] = useState(ActionTypeEnum?.ASSIGN_TO_USER);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const columns = [
        {
            name: 'Assign To user',
            key: ActionTypeEnum?.ASSIGN_TO_USER,
            components: <AssignToUserComponent setActionId={setActionId} />,
        },
        // {
        //     name: 'Send Template Message',
        //     key: ActionTypeEnum?.TEXT,
        //     components: 'Send text',
        // },
    ];

    const activeColumn = useMemo(() => {
        return columns?.find((val) => val?.key === active);
    }, [active, columns]);

    return (
        <div className='grid overflow-hidden flex-1 grid-cols-7 gap-3 p-3 h-full max-h-[70vh]'>
            <div className='col-span-1 p-2 h-full bg-gray-100 rounded col-flex'>
                {columns?.map((col) => {
                    const isActive = col?.key === active;

                    return (
                        <div
                            key={col?.key}
                            onClick={() => {
                                if (isActive) return;
                                setActive(col?.key);
                            }}
                            className={cn(
                                'py-3 text-lg border-b transition-all cursor-pointer',
                                {
                                    'text-success': isActive,
                                }
                            )}
                        >
                            {col?.name}
                        </div>
                    );
                })}
            </div>
            <div className='overflow-hidden col-span-6 h-full bg-gray-100 col-flex'>
                {activeColumn?.components}
            </div>
        </div>
    );
};

export default AddActionsModule;
