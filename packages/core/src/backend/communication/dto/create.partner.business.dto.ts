import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePartnerBusinessDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    business_name: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    owner_email: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    owner_name: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(64)
    password: string;
}
