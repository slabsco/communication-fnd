import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AddAssigneePayloadDto {
    @Expose()
    @IsNotEmpty()
    assignee_id: number;
}
