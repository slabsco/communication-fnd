import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddContactDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    mobile: string;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    dialing_code: number;

    @Expose()
    @IsOptional()
    custom_attributes: { [key: string]: string }[];
}
