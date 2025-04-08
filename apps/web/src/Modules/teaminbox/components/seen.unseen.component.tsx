import { Check, CheckCheck, Clock1, Info } from 'lucide-react';
import { useMemo } from 'react';

import { AccessManager, UserBusiness } from '@finnoto/core';
import {
    DropdownMenu,
    FormatDisplayDateStyled,
    handleDocumentIcon,
    Icon,
    Tooltip,
    Typography,
} from '@finnoto/design-system';

import { getErrorMessageTeamInbox } from '../utils/teaminbox.utils';

import { MoreIcon } from 'assets';

export const RenderSeenUnseen = ({ message }: any) => {
    return message?.is_error ? (
        <Tooltip
            messageClassName='max-w-[400px]'
            message={getErrorMessageTeamInbox(message)}
        >
            <Info size={14} color='red' />
        </Tooltip>
    ) : (
        <div className='flex items-center'>
            {message?.read_at ? (
                <CheckCheck size={10} color='green' />
            ) : message?.delivered_at ? (
                <CheckCheck size={10} />
            ) : message?.sent_at ? (
                <Check size={10} />
            ) : (
                <Clock1 size={10} />
            )}
        </div>
    );
};

export const MessageBubbleTimePopper = ({ message }: { message: any }) => {
    return (
        <div className='flex gap-1'>
            <div>
                <span className='text-base-secondary text-[10px]'>
                    {message?.creator || 'Bot'}
                </span>
                {FormatDisplayDateStyled({
                    value: message?.created_at,
                    size: 'xs',
                    className: 'text-base-secondary',
                    containerClass: 'text-[10px]',
                })}
            </div>
        </div>
    );
};

export const UploadedFileCard = ({
    file,
    handleRemoveFile,
    imageViwer,
    hideDelete,
}: any) => {
    const isDeleteOptionShow = useMemo(() => {
        if (hideDelete && file?.id) return false;
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
                <Icon
                    source={handleDocumentIcon(
                        file?.document_url || file?.serverUrl
                    )}
                    isSvg
                    size={20}
                    iconColor='text-base-tertiary -mt-1'
                />
                <div className='overflow-hidden font-medium text-left col-flex text-base-primary'>
                    <Typography className='overflow-hidden w-full text-xs truncate text-ellipsis'>
                        {file?.name}
                    </Typography>

                    <Typography className='text-[10px] font-normal uppercase text-base-tertiary '>
                        {Math.round(file?.size / 1024)}KB
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
