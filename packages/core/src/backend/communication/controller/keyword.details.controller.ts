import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { CreateKeywordDetailDto } from '../dto/create.keyword.detail.dto';

export class KeywordDetailsController extends BaseModel {
    protected endPoint = 'api/b/keyword-details';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }

    async showAction(id: number) {
        this.api = `${this.endPoint}/${id}/get-actions`;
        return this.get();
    }

    async create() {
        this.api = `${this.endPoint}`;
        this.bodyDto = CreateKeywordDetailDto;

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

export enum ActionTypeEnum {
    TEXT = 1120,
    ASSIGN_TO_USER = 1121,
    SEND_TEMPLATE_MESSAGE = 1122,
    SEND_DOCUMENT = 1123,
    SEND_IMAGE = 1124,
    CHATBOT = 1125,
}
