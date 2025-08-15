import { BooleanEnum } from '@finnoto/core';

import { BooleanSelectFilter } from '../../../../../../../Components/Inputs/SelectBox/boolean.select.filter';
import { BooleanFilterProps } from '../../list.form.filter.types';
import { useListFormFilterContext } from '../../provider/list.form.filter.provider';

export const BooleanFilterElement = ({
    value,
    filter,
}: {
    filter: BooleanFilterProps;
    value?: any;
}) => {
    const { handleFilterData } = useListFormFilterContext();

    console.log({ value, filter });

    return (
        <BooleanSelectFilter
            value={value}
            onChange={(option) => {
                handleFilterData({
                    [filter?.key]: BooleanEnum.TRUE === option?.value,
                });
            }}
            positiveLabel={filter?.positiveLabel}
            negativeLabel={filter?.negativeLabel}
            placeholder={`Select ${filter?.title} ...`}
            mainClassName='flex-1 single-select-filter '
            size='sm'
        />
    );
};
