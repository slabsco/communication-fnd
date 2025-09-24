import { Expose } from 'class-transformer';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ScheduleBroadcastListFilterDto extends CommonListFilterDto {
    @Expose()
    @IsString()
    @IsOptional()
    status?: string;

    @Expose()
    @IsBoolean()
    @IsOptional()
    is_error?: boolean;
}
