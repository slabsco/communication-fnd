import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IdPayloadDto } from '../../common/dtos/id.payload.dto';

export class UploadToFacebookDto extends IdPayloadDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    url: string;
}
