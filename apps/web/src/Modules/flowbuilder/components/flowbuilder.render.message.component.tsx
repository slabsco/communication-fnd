import { ReactNode, useMemo } from 'react';

import { IconButton } from '@finnoto/design-system';

import { DeleteSvgIcon } from 'assets';

interface RenderMessagesComponentProps {
    component: any[];
    type: string;
    removeAt: (index: number) => void;
    element: (index: number, val: any) => ReactNode;
}

export const RenderMessagesComponent = ({
    component,
    type,
    removeAt,
    element,
}: RenderMessagesComponentProps) => {
    const messageComponents = useMemo(() => {
        return component?.filter((val) => val?.type === type);
    }, [component, type]);

    return (
        <>
            {messageComponents?.map((val) => {
                const index = component?.findIndex((com) => com.id === val?.id);
                return (
                    <div className='relative' key={val?.id}>
                        <IconButton
                            size='xs'
                            icon={DeleteSvgIcon}
                            onClick={() => {
                                removeAt(index);
                            }}
                            outline
                            appearance='error'
                            className='absolute -top-2 -right-2'
                        />
                        {element?.(index, val)}
                    </div>
                );
            })}
        </>
    );
};
