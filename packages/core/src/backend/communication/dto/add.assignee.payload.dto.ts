import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddAssigneePayloadDto {
    @Expose()
    @IsOptional()
    assignee_id?: number;
}

export class TeamInboxUpdateStatusDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    status_id: number;
}
