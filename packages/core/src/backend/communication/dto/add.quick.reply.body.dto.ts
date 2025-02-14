import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddQuickReplyBodyDto {
    @Expose()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    shortcut: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    message: string;

    @Expose()
    @IsOptional()
    document?: any;
}
