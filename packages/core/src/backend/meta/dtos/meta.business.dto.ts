import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class MetaBusinessDto {
    @Expose()
    @IsNotEmpty()
    data?: any;
}
