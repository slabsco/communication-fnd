'use client';

import { useState } from 'react';

import { cn, IsValidString } from '../../../Utils/common.ui.utils';
import { Icon } from '../../Data-display/Icon/icon.component';
import { Button } from '../../Inputs/Button/button.component';
import { TextareaField } from '../../Inputs/InputField/textarea.component';
import { ModalBody, ModalContainer } from '../Base/modal.container.component';

/**
 * Renders a modal for confirming an action with a message and allows the user to input a comment.
 *
 * @param {string} [title='Confirm'] - The title of the modal.
 * @param {boolean} [noHeader] - Whether or not to show the header.
 * @param {string|any} message - The message to display in the modal.
 * @param {Array} [actions=[]] - An array of objects containing the information for the buttons.
 * @param {boolean} [isReverseAction=false] - Whether or not to reverse the order of the buttons.
 * @param {any} [icon] - The icon to display in the modal.
 * @param {'primary'|'success'|'error'|'warning'} [iconAppearance='primary'] - The appearance of the icon.
 * @param {boolean} [required=true] - Whether or not a comment is required.
 * @return {JSX.Element} - The JSX Element for the modal.
 *
 * @author Rumesh Udash
 */
export const CommentConfirmModal = ({
    title = 'Confirm',
    noHeader,
    message,
    actions = [],
    isReverseAction = false,
    icon,
    iconAppearance = 'primary',
    required = true,
}: {
    title?: string;
    noHeader?: boolean;
    message: string | any;
    icon?: any;
    actions: any[];
    isReverseAction?: boolean;
    iconAppearance?: 'primary' | 'success' | 'error' | 'warning' | 'hold';
    required?: boolean;
}) => {
    const isArc = true;
    const [comments, setComments] = useState('');

    const iconAppearances = {
        primary: 'bg-[#4CC3C71A]/10 text-primary',
        success: 'bg-success/10 text-success',
        error: 'bg-error/10 text-error',
        warning: 'bg-warning/10 text-warning',
        hold: 'bg-party-status-hold/10 text-party-status-hold',
    };

    return (
        <ModalContainer className='modal-title-background arc-confirm-modal'>
            <ModalBody
                className={cn('px-4 mx-auto w-full bg-base-100', {
                    'p-6 w-full': isArc,
                })}
            >
                {!!icon && (
                    <div className='flex justify-center items-center mb-4'>
                        <div
                            className={cn(
                                'flex justify-center items-center w-12 h-12 rounded-full',
                                iconAppearances[iconAppearance]
                            )}
                        >
                            <Icon source={icon} isSvg size={32} />
                        </div>
                    </div>
                )}

                {noHeader ? (
                    <></>
                ) : (
                    <div
                        className={cn('text-xl font-medium text-center', {
                            'font-semibold text-start': isArc,
                        })}
                    >
                        {isArc ? title || 'Sure you want to accept?' : title}
                    </div>
                )}
                {!isArc && (
                    <div
                        className={cn(
                            'mx-auto mt-2 text-sm font-normal text-center text-base-secondary'
                        )}
                    >
                        {message}
                    </div>
                )}
                <div
                    className={cn('flex flex-col gap-2 my-6', {
                        'mt-4 mb-2': isArc,
                    })}
                >
                    <TextareaField
                        value={comments}
                        name='comments'
                        placeholder={'Write a comment...'}
                        onChange={setComments}
                        bordered
                        fullWidth
                    />
                </div>
                <div
                    className={cn('grid grid-cols-2 gap-4 mt-6', {
                        'flex gap-2 justify-end': isArc,
                    })}
                >
                    {actions.map((item, index) => {
                        if (item?.visible === false) return null;
                        let {
                            actionClick = () => {},
                            actionText,
                            appearance,
                            type,
                        } = item || {};

                        if (isArc) {
                            if (type === 'success') actionText = 'Yes, confirm';
                            if (type === 'cancel') actionText = 'No, cancel';
                        }

                        const isOkayAction = (() => {
                            if (
                                (index === 0 && isReverseAction) ||
                                (!isReverseAction && index === 1)
                            )
                                return true;

                            return false;
                        })();

                        const handleAppearance = () => {
                            if (isArc && appearance === 'base')
                                return 'polaris-white';
                            if (appearance) return appearance;
                            if (
                                (index === 0 && isReverseAction) ||
                                (!isReverseAction && index === 1)
                            ) {
                                return 'Success';
                            }
                            return 'base';
                        };

                        return actionText ? (
                            <Button
                                key={index + 23}
                                appearance={handleAppearance()}
                                onClick={() => {
                                    actionClick(comments.trim());
                                }}
                                disabled={
                                    isOkayAction &&
                                    required &&
                                    !IsValidString(comments.trim())
                                }
                                size='md'
                                progress
                                defaultMinWidth={isArc}
                            >
                                <span className='font-medium'>
                                    {actionText}
                                </span>
                            </Button>
                        ) : null;
                    })}
                </div>
            </ModalBody>
        </ModalContainer>
    );
};
