import { Expose } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsNumber,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { IdPayloadDto } from '../../common/dtos/id.payload.dto';

export enum KeywordMatchingTypeEnum {
    FUZZY = 1110,
    EXACT = 1111,
    CONTAIN = 1112,
}

export class CreateKeywordDetailDto extends IdPayloadDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsArray()
    @IsNotEmpty()
    keywords: string[];

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    @IsEnum(KeywordMatchingTypeEnum)
    matching_type_id: KeywordMatchingTypeEnum;

    @Expose()
    @IsOptional()
    @IsNumber()
    fuzzy_matching_rage?: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    action_id?: number;
}
