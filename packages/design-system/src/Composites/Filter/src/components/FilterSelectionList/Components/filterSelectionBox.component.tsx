import { ChevronDown, X } from 'lucide-react';

import { IsArray, IsEmptyArray, IsFunction, IsUndefined } from '@finnoto/core';

import { Button, Popover } from '../../../../../../Components';
import { cn } from '../../../../../../Utils/common.ui.utils';
import { renderFilterDisplay } from '../../filterListDisplay/arcFilterList.display.component';
import { ListFormFilterProps } from '../../list-filter-form';
import { BooleanFilterElement } from '../../list-filter-form/components/filterListFormElement/boolean.filter.element';
import { AmountSelectionList } from './FilterSelectionFields/amount.selection.list.component';
import { CommonValueSelectionList } from './FilterSelectionFields/common.value.selection.list.component';
import { DateSelectionList } from './FilterSelectionFields/date.selection.list.component';
import { ReferenceMultiFilterSelectionList } from './FilterSelectionFields/reference.multiFilter.selection.list.component';

interface FilterSelectionBoxProps {
    value?: any;
    config: ListFormFilterProps;
    defaultOpen?: boolean;
    onChange?: (value: any, operator?: string) => void;
    onDelete?: () => void;
    onClose?: () => void;
}

const FilterSelectionBox = ({
    value,
    config,
    defaultOpen,
    onChange,
    onDelete,
    onClose,
}: FilterSelectionBoxProps) => {
    return (
        <div>
            <Popover
                element={
                    <FilterSelectionValueRenderer
                        value={value}
                        config={config}
                        onDelete={onDelete}
                        onChange={onChange}
                    />
                }
                align='start'
                defaultVisible={defaultOpen}
                onVisibleChange={(visible) => {
                    if (visible) return;
                    onClose?.();

                    if (IsArray(value) && IsEmptyArray(value))
                        return onDelete?.();
                    if (!IsUndefined(value)) return;

                    onDelete?.();
                }}
                noAutofocus
            >
                <Button
                    appearance='ghost'
                    size='xs'
                    className={cn(
                        'border-solid hover:bg-base-200 border-base-tertiary hover:border-solid font-normal gap-0 !px-0 text-left !h-auto',
                        { 'border-dashed': IsUndefined(value) }
                    )}
                    autoFocus
                >
                    {IsUndefined(value) && <FilterTitle config={config} />}

                    {!IsUndefined(value) && (
                        <div>
                            {renderFilterDisplay(
                                { [config.key]: value },
                                { ...config, disableClear: true }
                            )}
                        </div>
                    )}
                    {!IsUndefined(value) && IsFunction(onDelete) && (
                        <button
                            className='pr-2'
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.();
                            }}
                        >
                            <X className='w-4 h-4 text-base-tertiary' />
                        </button>
                    )}
                </Button>
            </Popover>
        </div>
    );
};

const FilterTitle = ({ config }: { config: ListFormFilterProps }) => {
    return (
        <div className='flex gap-1 items-center px-2'>
            {config.title}
            <ChevronDown className='w-4 h-4 text-base-tertiary' />
        </div>
    );
};

const FilterSelectionValueRenderer = ({
    value,
    config,
    onDelete,
    onChange,
}: {
    value: any;
    config: ListFormFilterProps;
    onDelete?: () => void;
    onChange?: (value: any, operator?: string) => void;
}) => {
    return (
        <div className='col-flex'>
            {getFormElement(value, config, onChange)}

            {!IsUndefined(value) && (
                <div className='px-2 pb-2'>
                    <Button
                        appearance='link'
                        size='sm'
                        onClick={() => onDelete?.()}
                    >
                        Clear all
                    </Button>
                </div>
            )}
        </div>
    );
};

const getFormElement = (
    value: any,
    filter: ListFormFilterProps,
    onChange: (value: any, operator?: string) => void
) => {
    switch (filter?.type as string) {
        case 'amount_range':
        case 'currency':
            return (
                <AmountSelectionList
                    value={value}
                    onChange={onChange}
                    {...filter}
                    key={filter.key}
                />
            );

        case 'date_range':
        case 'date':
            return (
                <DateSelectionList
                    value={value}
                    onChange={onChange}
                    {...filter}
                    key={filter.key}
                />
            );
        case 'multi_select':
            return (
                <ReferenceMultiFilterSelectionList
                    labelClassName={'text-sm w-full h-[32px]'}
                    value={!value || IsArray(value) ? value : [value]}
                    onChangeFilter={onChange}
                    selectedSuffix='Selected'
                    {...(filter as any)}
                    placeholder={`Select ${filter?.title} ...`}
                />
            );
        // case 'multi_select_object':
        //     return (
        //         <MultiFilterSelectionList
        //             {...{ filter }}
        //             key={filter.key}
        //         />
        //     );
        // case 'select':
        //     return (
        //         <SingleSelectFilterFormElement
        //             {...{ filter }}
        //             key={filter.key}
        //         />
        //     );
        // case 'boolean':
        //     return (
        //         <BooleanFilterElement
        //             value={!value || IsArray(value) ? value : [value]}
        //             {...(filter as any)}
        //             key={filter.key}
        //         />
        //     );
        // case 'month_filter':
        //     return <MonthYearSelectFilter {...{ filter }} key={filter?.key} />;

        default:
            return (
                <CommonValueSelectionList
                    value={value}
                    onChange={onChange}
                    {...filter}
                    field={filter.key}
                />
            );
    }
};

export default FilterSelectionBox;
