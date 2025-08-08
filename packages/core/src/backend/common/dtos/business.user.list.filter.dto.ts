import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonListFilterDto } from './common.list.filter.dto';

export class BusinessUserListFilterDto extends CommonListFilterDto {
    @Expose()
    @IsNumber()
    @IsOptional()
    product_id?: number;

    @IsOptional()
    @Expose()
    @IsBoolean()
    active: boolean;

    @IsOptional()
    @Expose()
    @IsString()
    role: string;
}
