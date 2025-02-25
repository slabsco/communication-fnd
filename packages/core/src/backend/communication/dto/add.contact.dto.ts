import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IdPayloadDto } from '../../common/dtos/id.payload.dto';

export class AddContactDto extends IdPayloadDto {
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
