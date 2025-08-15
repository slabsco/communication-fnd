import { Expose } from 'class-transformer';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class AddUserPreferenceDto {
    @Expose()
    @IsNotEmpty()
    @IsJSON()
    preference: any;
}
export class AddBusinessPreferenceDto {
    @Expose()
    @IsNotEmpty()
    preference: any;
}
