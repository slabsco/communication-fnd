import { Expose, Type } from 'class-transformer';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';
import 'reflect-metadata';
import { DateFilterDto } from '../../../Models/dto/date.filter.dto';
import { ListResponseFormatDto } from '../../../Models/dto/list.response.format.dto';
import { NumberRangeFilterDto } from '../../../Models/dto/number.range.filter.dto';

export class CommonListFilterDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @Expose()
    search?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @Expose()
    document_identifier?: string;

    @IsOptional()
    @Expose()
    id?: number;

    @IsOptional()
    @IsNumber()
    @Expose()
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Expose()
    page?: number;

    @IsOptional()
    @Expose()
    order?: any;

    @IsOptional()
    @Expose()
    filter_query?: any;

    @IsOptional()
    @Expose()
    filter_json?: any;

    @IsOptional()
    @IsBoolean()
    @Expose()
    stats?: boolean;

    @IsOptional()
    @IsBoolean()
    @Expose()
    no_metrics?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => DateFilterDto)
    @Expose()
    date?: DateFilterDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => NumberRangeFilterDto)
    @Expose()
    amount?: NumberRangeFilterDto;

    @IsOptional()
    @ValidateNested()
    @Expose()
    @Type(() => ListResponseFormatDto)
    format?: ListResponseFormatDto;

    @IsOptional()
    @Expose()
    aggregate?: Record<string, string>;

    @IsOptional()
    @Expose()
    listing_slug?: string;

    @IsOptional()
    @IsBoolean()
    @Expose()
    active?: boolean;

    @IsOptional()
    @IsBoolean()
    @Expose()
    assign_me?: boolean;
}
