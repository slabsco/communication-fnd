import { Expose } from 'class-transformer';
export class IdsPayloadDto {
    @Expose()
    ids?: any[];
}
