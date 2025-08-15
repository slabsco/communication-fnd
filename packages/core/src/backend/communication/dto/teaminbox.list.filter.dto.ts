import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';

export class TeamInboxListFilterDto extends CommonListFilterDto {
    @IsOptional()
    @IsBoolean()
    @Expose()
    assign_me?: boolean;

    @IsOptional()
    @IsBoolean()
    @Expose()
    is_assigned_to_bot?: boolean;

    @IsOptional()
    @IsArray()
    @Expose()
    assignee_ids?: number[];

    @Expose()
    @IsOptional()
    @IsArray()
    status_ids?: number[];
}
