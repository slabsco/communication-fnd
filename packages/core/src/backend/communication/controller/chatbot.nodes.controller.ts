import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';

export class ChatbotNodesController extends BaseModel {
    protected endPoint = 'api/b/chatbot-nodes';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }
}
