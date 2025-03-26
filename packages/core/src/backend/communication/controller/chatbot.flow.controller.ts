import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { StringSearchDto } from '../../common/dtos/string.search.dto';
import {
    ChatbotFlowRawJson,
    CreateChatbotFlowDto,
} from '../dto/create.chatbot.flow.dto';

export class ChatbotFLowController extends BaseModel {
    protected endPoint = 'api/b/chatbot-flow';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }

    async create() {
        this.api = `${this.endPoint}`;
        this.bodyDto = CreateChatbotFlowDto;

        return this.post();
    }

    async find() {
        this.api = `${this.endPoint}/find`;
        this.bodyDto = StringSearchDto;

        return this.post();
    }

    async updateFlow(id: number) {
        this.api = `${this.endPoint}/${id}/update-flow`;
        this.bodyDto = ChatbotFlowRawJson;

        return this.post();
    }

    async remove(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.delete();
    }

    async activate(id: number) {
        this.api = `${this.endPoint}/${id}/activate`;
        return this.post();
    }

    async deactivate(id: number) {
        this.api = `${this.endPoint}/${id}/deactivate`;
        return this.post();
    }
}
