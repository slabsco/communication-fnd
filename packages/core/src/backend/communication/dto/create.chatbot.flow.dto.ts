import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IdPayloadDto } from '../../common/dtos/id.payload.dto';

export class CreateChatbotFlowDto extends IdPayloadDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsString()
    description?: string;
}

export class ChatbotFlowRawJson {
    @Expose()
    @IsNotEmpty()
    data: any;
}

export class CreateChatbotVersionDto extends IdPayloadDto {
    @Expose()
    @IsString()
    @IsOptional()
    name: string;

    @Expose()
    @IsNotEmpty()
    raw_react_flow: any;
}
