import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { ObjectDto } from '../../Dtos';

export class SetBusinessSettingsDto {
    @Expose()
    @IsBoolean()
    @IsOptional()
    is_private_number?: boolean;

    @Expose()
    @ValidateNested()
    @IsOptional()
    user_reminder_preference?: ObjectDto;
}
