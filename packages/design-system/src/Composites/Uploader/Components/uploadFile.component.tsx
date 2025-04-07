'use client';

import { Video } from 'lucide-react';
import { useMemo } from 'react';

import { AccessManager, UserBusiness } from '@finnoto/core';

import { Icon } from '../../../Components/Data-display/Icon/icon.component';
import { Typography } from '../../../Components/Data-display/Typography/typography.component';
import { DropdownMenu } from '../../../Components/Inputs/DropdownMenu/dropdownMenu.component';
import { UplodedFileProps } from '../uploader.types';
import { handleDocumentIcon } from '../uploader.utils';

import { MoreIcon } from 'assets';

export const UplodedFile = ({
    file,
    handleRemoveFile,
    imageViwer,
    hideDelete,
}: UplodedFileProps) => {
    const isDeleteOptionShow = useMemo(() => {
        if (hideDelete) return false;
        if (AccessManager.hasRoleIdentifier('ua_document_manager')) return true;
        let activeFile: any = file;
        if (activeFile?.attributes?.no_edit) return false;
        if (!activeFile?.created_by) return true;
        const business = UserBusiness.getCurrentBusiness();
        const loggedUserObj: any = UserBusiness.getIdObject();

        if (!business?.owner_id || !loggedUserObj?.user_id) return true; //business information initially not set
        return (
            AccessManager.isAuthUser(activeFile?.created_by) ||
            AccessManager.isBusinessOwner(activeFile?.created_by)
        );
    }, [file, hideDelete]);
    const actions = [
        { name: 'View', action: imageViwer },
        {
            name: 'delete',
            action: handleRemoveFile,
            isCancel: true,
            visible: isDeleteOptionShow,
        },
    ];

    return (
        <div className='flex overflow-hidden gap-4 justify-between items-center px-4 py-2 text-xs rounded border bg-base-100 border-base-300'>
            <div className='flex overflow-hidden gap-3 items-center'>
                {(file?.document_url || file?.serverUrl).includes('mp4') ? (
                    <Video className='-mt-1 text-base-tertiary' />
                ) : (
                    <Icon
                        source={handleDocumentIcon(
                            file?.document_url || file?.serverUrl
                        )}
                        isSvg
                        size={20}
                        iconColor='text-base-tertiary -mt-1'
                    />
                )}

                <div className='overflow-hidden font-medium text-left col-flex text-base-primary'>
                    <Typography className='overflow-hidden w-full text-xs truncate text-ellipsis'>
                        {file?.attributes?.name}
                    </Typography>

                    <Typography className='text-[10px] font-normal uppercase text-base-tertiary '>
                        {Math.round(file?.attributes?.size / 1024)}KB
                    </Typography>
                </div>
            </div>

            <DropdownMenu hideOnNoAction={false} actions={actions}>
                <div className='btn btn-square btn-ghost btn-xs hover:bg-primary/10 hover:text-primary'>
                    <Icon
                        source={MoreIcon}
                        size={22}
                        isSvg
                        iconClass='rotate-90'
                    />
                </div>
            </DropdownMenu>
        </div>
    );
};
