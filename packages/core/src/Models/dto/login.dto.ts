import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @Expose()
    username: string;

    @IsNotEmpty()
    @IsString()
    @Expose()
    password: string;
}

export class ForgetPasswordPayloadDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    email: string;
}

export class ForgetPasswordValidationPayloadDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    email: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    token: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    password: string;
}
