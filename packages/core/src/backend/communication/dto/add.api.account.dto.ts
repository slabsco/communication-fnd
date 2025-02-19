import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddApiAccountDto {
    @Expose()
    @IsOptional()
    id?: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;
}
