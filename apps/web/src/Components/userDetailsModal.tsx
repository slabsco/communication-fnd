import { useCallback } from 'react';

import { useCustomQueryDetail } from '@finnoto/core';
import {
    Avatar,
    InformationCardUpdated,
    ModalBody,
    ModalContainer,
    PageLoader,
} from '@finnoto/design-system';
import { DialogTitle } from '@finnoto/design-system/src/Components/Dialogs/Base/dialog.core';
import { DataInformationObject } from '@finnoto/design-system/src/Components/Surfaces/Cards/informationCard.types';

import { EmployeeIconImage } from './BusinessImage/businessImage.component';
import LineStatusCard from './Cards/lineStatus.card';

const UserDetailsModal = ({ id }: { id: number }) => {
    const { data: detail, isLoading } = useCustomQueryDetail({
        type: 'business_users',
        methodParams: id,
        method: 'info',
    });

    const employeeDetailItems: DataInformationObject[] = [
        {
            label: 'Account Status',
            info: <LineStatusCard data={detail} />,
        },
        {
            label: 'Mobile',
            info: <span>{detail?.user?.mobile}</span>,
        },

        {
            label: 'Email',
            info: <span>{detail?.user?.email}</span>,
            visible: !!detail?.user?.email,
        },
    ];

    const renderUserImage = useCallback(() => {
        const { image_url } = detail?.user || {};
        if (image_url)
            return (
                <Avatar
                    imageWrapperClassName='p-2 border'
                    shape='rounded'
                    size='lg'
                    source={image_url as any}
                />
            );
        return <EmployeeIconImage {...{ size: 24, isSvg: true }} />;
    }, [detail?.user]);

    const modalTitle = useCallback(() => {
        return (
            <div className='flex gap-4 items-center'>
                <DialogTitle className='text-base text-base-content'>
                    User Details
                </DialogTitle>
            </div>
        );
    }, []);

    if (isLoading)
        return <PageLoader screenHeight={false} className='w-full h-[400px]' />;

    return (
        <ModalContainer title={modalTitle()}>
            <ModalBody className='col-flex modal-background'>
                <div className='gap-4 items-center py-4 w-full rounded rounded-br-none rounded-bl-none shadow-sm col-flex bg-base-100'>
                    <div className='relative gap-4 items-center pb-2 w-full border-b border-dashed col-flex border-base-300'>
                        {renderUserImage()}
                        <h3 className='text-base font-semibold capitalize text-color-div primary'>
                            {detail?.user?.name}
                        </h3>
                    </div>
                </div>
                <InformationCardUpdated data={employeeDetailItems} />
            </ModalBody>
        </ModalContainer>
    );
};

export default UserDetailsModal;
