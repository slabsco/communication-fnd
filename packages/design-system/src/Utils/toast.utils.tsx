import {
    IconProps,
    toast,
    ToastClassName,
    ToastContentProps,
    ToastOptions,
} from 'react-toastify';

import {
    IsFunction,
    SHOW_TOAST,
    SubscribeToEvent,
    UnsubscribeEvent,
} from '@finnoto/core';

import { Icon } from '../Components/Data-display/Icon/icon.component';
import { Loading } from '../Components/Data-display/Loading/loading.component';
import { cn } from './common.ui.utils';

import {
    ErrorToastIcon,
    InfoToastIcon,
    SuccessToastIcon,
    WarningToastIcon,
} from 'assets';

interface ToastDataProps {
    title?: string;
    description:
        | React.ReactNode
        | ((props: ToastContentProps['toastProps']) => React.ReactNode);
    templateClassName?: string;
}

interface ToastParams extends ToastDataProps, ToastOptions<ToastDataProps> {
    /**
     * Flag indicating if a progress indicator should be displayed within the toast.
     * `Default: false`
     */
    withProgress?: boolean;

    /**
     * Flag indicating if the toast should have a border.
     * `Default: false`
     */
    withBorder?: boolean;

    /**
     * Set the delay in seconds to close the toast automatically.
     * Use `false` to prevent the toast from closing.
     * `Default: 5`
     */
    autoClose?: number | false;
}

/**
 * `Toast` is a utility class for showing toast notifications.
 *
 * It provides a static `show` method to display toast notifications and a static
 * `register` method to register the event listener for showing toast messages.
 */
export class Toast {
    /**
     * Register the event listener for showing toast messages.
     */
    static register() {
        SubscribeToEvent({
            eventName: SHOW_TOAST,
            callback: this.handleToastBroadcast.bind(this),
        });
    }

    /**
     * Unregister the event listener for showing toast
     */
    static unregister() {
        UnsubscribeEvent({
            eventName: SHOW_TOAST,
            callback: this.handleToastBroadcast.bind(this),
        });
    }

    /**
     * A function to handle broadcasted toast notifications.
     *
     * @param {object} options.type - The type of the notification
     * @param {string} options.description - The description of the notification
     * @param {number} options.delay - The delay for auto closing the notification
     * @param {object} options.props - Additional properties for the notification
     */
    static handleToastBroadcast({ type, description, delay, ...props }) {
        this.notification({
            type: type,
            description: description,
            autoClose: delay,
            ...props,
        });
    }

    private static notification = (
        params: ToastParams & {
            type: 'success' | 'error' | 'warn' | 'info' | 'loading';
        }
    ) => {
        Toast[params.type](params);
    };

    /**
     * Displays a success toast message with the provided parameters.
     *
     * @param {ToastParams} options.title - Title of the toast message
     * @param {ToastParams} options.description - Description of the toast message
     * @param {ToastParams} options.templateClassName - CSS class name for the toast template
     * @param {ToastParams} options.autoClose - Duration in seconds before the toast message automatically closes
     * @param {ToastParams} options.withProgress - Flag indicating whether to show progress bar
     * @param {ToastParams} options.withBorder - Flag indicating whether to show border
     * @param {ToastParams} options.position - Position on the screen where the toast message should appear
     */
    static success({
        title,
        description,
        templateClassName,
        autoClose,
        withProgress = false,
        withBorder = false,
        ...rest
    }: ToastParams) {
        const autoCloseInMs = autoClose ? autoClose * 1000 : autoClose;

        toast.success(template, {
            ...getDefaultToastOptions({ withBorder }),
            ...rest,
            autoClose: autoCloseInMs,
            hideProgressBar: !withProgress,
            icon: getIcons,
            data: {
                title,
                description,
                templateClassName,
            },
        });
    }

    /**
     * Displays an error toast message with the provided parameters.
     *
     * @param {ToastParams} options.title - Title of the toast message
     * @param {ToastParams} options.description - Description of the toast message
     * @param {ToastParams} options.templateClassName - CSS class name for the toast template
     * @param {ToastParams} options.autoClose - Duration in seconds before the toast message automatically closes
     * @param {ToastParams} options.withProgress - Flag indicating whether to show progress bar
     * @param {ToastParams} options.withBorder - Flag indicating whether to show border
     * @param {ToastParams} options.position - Position on the screen where the toast message should appear
     */
    static error({
        title,
        description,
        templateClassName,
        autoClose,
        withProgress = false,
        withBorder = false,
        ...rest
    }: ToastParams) {
        const autoCloseInMs = autoClose ? autoClose * 1000 : autoClose;

        toast.error(template, {
            ...getDefaultToastOptions({ withBorder }),
            ...rest,
            autoClose: autoCloseInMs,
            hideProgressBar: !withProgress,
            icon: getIcons,
            data: {
                title,
                description,
                templateClassName,
            },
        });
    }

    /**
     * Displays a warning toast message with the provided parameters.
     *
     * @param {ToastParams} options.title - Title of the toast message
     * @param {ToastParams} options.description - Description of the toast message
     * @param {ToastParams} options.templateClassName - CSS class name for the toast template
     * @param {ToastParams} options.autoClose - Duration in seconds before the toast message automatically closes
     * @param {ToastParams} options.withProgress - Flag indicating whether to show progress bar
     * @param {ToastParams} options.withBorder - Flag indicating whether to show border
     * @param {ToastParams} options.position - Position on the screen where the toast message should appear
     */
    static warn({
        title,
        description,
        templateClassName,
        autoClose,
        withProgress = false,
        withBorder = false,
        ...rest
    }: ToastParams) {
        const autoCloseInMs = autoClose ? autoClose * 1000 : autoClose;

        toast.warning(template, {
            type: 'warning',
            ...getDefaultToastOptions({
                withBorder,
                className: withBorder ? 'border-warning' : '',
            }),
            ...rest,
            autoClose: autoCloseInMs,
            hideProgressBar: !withProgress,
            icon: getIcons,
            data: {
                title,
                description,
                templateClassName,
            },
        });
    }

    /**
     * Displays an info toast message with the provided parameters.
     *
     * @param {ToastParams} options.title - Title of the toast message
     * @param {ToastParams} options.description - Description of the toast message
     * @param {ToastParams} options.templateClassName - CSS class name for the toast template
     * @param {ToastParams} options.autoClose - Duration in seconds before the toast message automatically closes
     * @param {ToastParams} options.withProgress - Flag indicating whether to show progress bar
     * @param {ToastParams} options.withBorder - Flag indicating whether to show border
     * @param {ToastParams} options.position - Position on the screen where the toast message should appear
     */
    static info(params: ToastParams) {
        const {
            title,
            description,
            templateClassName,
            autoClose,
            withProgress = false,
            withBorder = false,
            ...rest
        } = params;
        const autoCloseInMs = autoClose ? autoClose * 1000 : autoClose;

        toast.info(template, {
            ...getDefaultToastOptions({ withBorder }),
            ...rest,
            autoClose: autoCloseInMs,
            hideProgressBar: !withProgress,
            icon: getIcons,
            data: {
                title,
                description,
                templateClassName,
            },
        });
    }

    /**
     * Creates a loading toast with the provided parameters.
     *
     * @param {ToastParams} options.title - Title of the toast message
     * @param {ToastParams} options.description - Description of the toast message
     * @param {ToastParams} options.templateClassName - CSS class name for the toast template
     * @param {ToastParams} options.withProgress - Flag indicating whether to show progress bar
     * @param {ToastParams} options.withBorder - Flag indicating whether to show border
     * @param {ToastParams} options.position - Position on the screen where the toast message should appear
     */
    static loading({
        title,
        description,
        templateClassName,
        withProgress = false,
        withBorder = false,
        ...rest
    }: Omit<ToastParams, 'autoClose'>) {
        const toastId = toast(template, {
            ...getDefaultToastOptions({ withBorder }),
            ...rest,
            autoClose: false,
            hideProgressBar: !withProgress,
            icon: getIcons,
            isLoading: true,
            draggable: false,
            closeOnClick: false,
            data: {
                title,
                description,
                templateClassName,
            },
        });
        return {
            hide: () => toast.dismiss(toastId),
            toastId,
        };
    }

    static dismiss = (id: string) => {
        toast.dismiss(id);
    };

    static dismissAll = () => {
        toast.dismiss();
    };
}

/**
 * Renders a template for a toast content with optional title and description.
 *
 * @param {ToastContentProps<ToastDataProps>} data - The data object containing the title, description, and template class name.
 * @param {ToastProps} toastProps - The props object for the toast component.
 */
const template = ({ data, toastProps }: ToastContentProps<ToastDataProps>) => {
    const { title, description, templateClassName } = data;

    return (
        <div
            className={cn(
                'flex flex-col gap-2 text-sm toast-content text-base-primary font-rubik',
                templateClassName
            )}
        >
            {title ? <div className='font-medium'>{title}</div> : null}
            <span>
                {IsFunction(description)
                    ? description(toastProps)
                    : description}
            </span>
        </div>
    );
};

/**
 * Function to get the appropriate icon based on the type of toast message.
 *
 * @param {IconProps} props - the properties of the icon
 * @return {ReactNode} the appropriate icon component
 */
const getIcons = ({ type, isLoading }: IconProps) => {
    switch (type as any) {
        case 'success':
            return <Icon source={SuccessToastIcon} isSvg />;
        case 'error':
            return <Icon source={ErrorToastIcon} isSvg />;
        case 'warn':
            return <Icon source={WarningToastIcon} isSvg />;
        case 'info':
            return <Icon source={InfoToastIcon} isSvg />;
        default:
            if (isLoading) {
                return <Loading color='primary' />;
            }
            return false;
    }
};

/**
 * Generates default options for a toast.
 *
 * @param {{ withBorder?: boolean; className?: ToastClassName; }} options - Options for customizing the toast.
 * @return {ToastOptions<ToastDataProps>} The default toast options.
 */
const getDefaultToastOptions = ({
    withBorder,
    className,
}: {
    withBorder?: boolean;
    className?: ToastClassName;
}): ToastOptions<ToastDataProps> => {
    return {
        draggable: true,
        closeButton: false,
        closeOnClick: true,
        bodyClassName: 'my-0',
        position: 'bottom-left',
        pauseOnFocusLoss: false,
        className: (context) => {
            const propsClassName = IsFunction(className)
                ? className?.(context)
                : className;

            return cn(context.defaultClassName, propsClassName, 'min-h-0', {
                'border-l-4': withBorder,
            });
        },
        // progressClassName: 'bg-secondary',
    };
};
