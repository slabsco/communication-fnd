import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MetaBusinessDto {
    @Expose()
    code: string;

    @Expose()
    product_id?: number;
}
