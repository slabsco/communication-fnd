import { BaseModel } from '../../../../Models/base.models';
import { AddBusinessPreferenceDto } from '../dtos/add.user.preference.dto';

export class BusinessPreferenceController extends BaseModel {
    protected endPoint = 'api/b/business-preference';

    async getAll() {
        this.api = this.endPoint;

        return this.get();
    }
    async show(slug: string) {
        this.api = `${this.endPoint}/${slug}`;
        return this.get();
    }

    async create(slug: string) {
        this.api = `${this.endPoint}/${slug}`;
        this.bodyDto = AddBusinessPreferenceDto;
        return this.post();
    }
}
