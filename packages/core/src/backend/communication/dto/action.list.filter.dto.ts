import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { ActionTypeEnum } from '../controller/keyword.details.controller';

export class ActionListFilterDto extends CommonListFilterDto {
    @Expose()
    @IsOptional()
    @IsEnum(ActionTypeEnum)
    type_id?: ActionTypeEnum;
}
