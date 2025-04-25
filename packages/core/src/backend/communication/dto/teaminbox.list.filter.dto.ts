import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';

export class TeamInboxListFilterDto extends CommonListFilterDto {
    @IsOptional()
    @IsBoolean()
    @Expose()
    assign_me?: boolean;

    @Expose()
    @IsOptional()
    @IsNumber()
    status_id?: number;
}
