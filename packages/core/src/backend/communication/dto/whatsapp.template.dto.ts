import { Expose } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    Length,
    IsEnum,
    IsOptional,
    IsNumber,
    IsBoolean,
} from 'class-validator';
import { IdPayloadDto } from '../../common/dtos/id.payload.dto';

export class WhatsappTemplateCreationDto extends IdPayloadDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    category_id: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    language_id: number;

    @Expose()
    @IsNotEmpty()
    raw_json: any;

    @Expose()
    @IsOptional()
    header_media_detail: any;

    @Expose()
    @IsOptional()
    active_step: any;

    @Expose()
    @IsOptional()
    @IsBoolean()
    is_unsubscribe_template?: boolean;
}
