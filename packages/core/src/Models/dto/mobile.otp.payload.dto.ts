import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MobileOtpPayloadDto {
    @IsNotEmpty()
    @Expose()
    mobile: number;
}

export class ChangeUserMobileDto {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    dialing_code: number;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    mobile: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    otp: number;
}
