import { Expose } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class AddWebhookDto {
    @Expose()
    @IsOptional()
    @IsNumber()
    id?: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    url?: string;

    @Expose()
    @IsNotEmpty()
    @IsArray()
    events: string[];
}
