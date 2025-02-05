import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SendTeamInboxMessagePayloadDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    template_id: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    mobile: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    dialing_code: number;

    @Expose()
    @IsOptional()
    custom_attributes: { key: string; value: string }[];
}
