import { BaseModel } from '../../../Models/base.models';
import { AddApiAccountDto } from '../dto/add.api.account.dto';

export class ClientConfigController extends BaseModel {
    protected endPoint = 'api/b/client-secret';

    async list() {
        this.api = this.endPoint;
        return this.get();
    }

    async create() {
        this.api = this.endPoint;
        this.bodyDto = AddApiAccountDto;

        return this.post();
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
