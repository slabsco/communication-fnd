import { Expose } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    Length,
    IsEnum,
    IsOptional,
    IsNumber,
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
    @IsOptional()
    title?: {
        type: 'text' | 'image' | 'video' | 'document';
        value: string;
    };

    @Expose()
    @IsOptional()
    @IsString()
    body: string;

    @Expose()
    @IsOptional()
    @IsString()
    footer: string;

    @Expose()
    @IsOptional()
    button_configurations: { [key: string]: any };

    @Expose()
    @IsOptional()
    sample_contents: { [key: string]: string | number };

    @Expose()
    @IsOptional()
    authConfig?: any;
}
