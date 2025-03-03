import { BaseModel } from '../../../Models/base.models';
import { AddWebhookDto } from '../dtos/add.webhook.dto';
import { StringSearchDto } from '../dtos/string.search.dto';

export class BusinessWebhookController extends BaseModel {
    protected endPoint = 'api/b/communication-webhook';

    async list() {
        this.api = `${this.endPoint}/list`;
        return this.get();
    }

    async logs() {
        this.api = `${this.endPoint}/logs`;
        return this.get();
    }

    async find() {
        this.api = `${this.endPoint}/find-event`;
        this.bodyDto = StringSearchDto;
        return this.post();
    }

    async detail() {
        this.api = `${this.endPoint}/detail`;
        return this.get();
    }

    async create() {
        this.api = this.endPoint;
        this.bodyDto = AddWebhookDto;
        return this.post();
    }

    async remove(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.delete();
    }

    async activate() {
        this.api = `${this.endPoint}/activate`;
        return this.post();
    }

    async deactivate() {
        this.api = `${this.endPoint}/deactivate`;
        return this.post();
    }
}
