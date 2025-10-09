import { useUpdateEffect } from 'react-use';

import { FetchData, IsFunction, IsUndefinedOrNull } from '@finnoto/core';
import { CommunicationTemplateController } from '@finnoto/core/src/backend/communication/controller/commuinication.templates.controller';
import { Loading, Modal } from '@finnoto/design-system';

import { useQuery } from '@tanstack/react-query';

import { initializeVariablesInState } from '../constants/template.format';
import { TemplatePreviewer } from './template.preview.component';

export const AsyncTemplateViewer = ({
    id,
    sample_contents,
    getData,
}: {
    id: number;
    sample_contents?: any;
    getData?: Function;
}) => {
    const { data, isFetching: isLoading } = useQuery({
        queryKey: ['template_detail', id],
        enabled: !IsUndefinedOrNull(id),
        queryFn: async () => {
            const { response, success } = await FetchData({
                className: CommunicationTemplateController,
                method: 'show',
                methodParams: id,
            });

            if (success) return response; // Ensure to return the response for further use
            return Promise.reject();
        },
    });

    useUpdateEffect(() => {
        if (!IsFunction(getData)) return;
        getData?.(data);
    }, [data]);

    if (!isLoading && IsUndefinedOrNull(id)) {
        return <div className='text-base-100'>No Template is selected</div>;
    }

    return isLoading ? (
        <div className='w-11 h-10 centralize'>
            <Loading size='xl' color='primary' />
        </div>
    ) : (
        <>
            <TemplatePreviewer
                state={initializeVariablesInState(
                    data?.template_config,
                    sample_contents
                )}
            />
        </>
    );
};

export const openTemplateViewer = (
    id: number,
    options?: { sample_contents?: any }
) => {
    Modal.open({
        component: AsyncTemplateViewer,
        modalSize: 'auto',
        props: { id, sample_contents: options?.sample_contents },
        containerStyle: { zIndex: 999999 },
    });
};
