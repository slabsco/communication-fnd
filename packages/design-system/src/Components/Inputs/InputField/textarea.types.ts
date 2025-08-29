/**
 * Interface representing the props for an textarea component.
 */
import { cva, type VariantProps } from 'class-variance-authority';
import { InputHTMLAttributes } from 'react';

export const textAreaVariants = cva('textarea textarea-bordered', {
    variants: {
        size: {
            xs: 'textarea-xs',
            sm: 'textarea-sm',
            md: 'textarea-md',
            lg: 'textarea-lg',
        },
        isError: {
            true: 'textarea-error',
            false: 'textarea-default',
        },
    },
});

export const textAreaGroupVariants = cva('', {
    variants: {
        InputGroupSizes: {
            xs: 'input-group-xs',
            sm: 'input-group-sm',
            md: 'input-group-md',
            lg: 'input-group-lg',
        },
    },
});
export const textAreaConatinerVariants = cva('', {
    variants: {
        containerSize: {
            xs: 'container-textarea-xs',
            sm: 'container-textarea-sm',
            md: 'container-textarea-md',
            lg: 'container-textarea-lg',
        },

        disabled: {
            true: 'input-container-disabled',
        },
        isValidString: {
            true: 'valid-input',
        },
    },
});

export interface TextAreaInterface
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'translate'>,
        VariantProps<typeof textAreaVariants>,
        VariantProps<typeof textAreaConatinerVariants>,
        VariantProps<typeof textAreaGroupVariants> {
    onChange?(value: any): void;
    onDebounceChange?(value: any): void;
    onBlur?(value: any): void;
    onClick?(e: any): void;
    onKeyUp?(e: any): void;
    onKeyDown?(e: any): void;
    onFocus?(e: any): void;
    error?: string;
    loading?: boolean;
    validateMessage?: string;
    disabled?: boolean;
    readOnly?: boolean;
    autoFocus?: boolean;
    bordered?: boolean;
    showLimit?: boolean;
    tabIndex?: number;
    inputClassName?: string;
    labelClassName?: string;
    className?: string;
    label?: React.ReactNode | string;
    defaultLabel?: string;
    name?: string;
    value?: any;
    defaultValue?: any;
    placeholder?: any;
    defaultPlaceholder?: any;
    type?: 'textarea';

    min?: number;
    max?: number;
    maxLength?: number;
    debounceParams?: DebouceParams;
    style?: React.CSSProperties;
    message?: React.ReactNode;
    messageComponent?: React.ReactNode;
    rows?: number;
    integerOnly?: boolean;
    required?: boolean;
    fullWidth?: boolean;
    translate?: boolean;
    enableCount?: boolean;
}

/**
 * Interface representing the debounce parameters.
 */
type DebouceParams = {
    wait?: number;
    immediate?: boolean;
};
