import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectDto } from '../../Dtos';

export class SendTeamInboxMessagePayloadDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    template_id: number;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    contact_id: string;

    @Expose()
    @IsNotEmpty()
    custom_attributes: ObjectDto;
}

export class SendTeamInboxSimpleMessagePayloadDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    data: string;
}
