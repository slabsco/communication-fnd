import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class AddAssigneePayloadDto {
    @Expose()
    @IsNotEmpty()
    assignee_id: number;
}

export class TeamInboxUpdateStatusDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    status_id: number;
}
