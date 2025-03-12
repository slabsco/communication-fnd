import { BaseModel } from '../../../Models/base.models';
import { StringSearchDto } from '../../common/dtos/string.search.dto';
import { ActionListFilterDto } from '../dto/action.list.filter.dto';
import { CreateActionDetailDto } from '../dto/create.action.detail.dto';

export class ActionDetailsController extends BaseModel {
    protected endPoint = 'api/b/action-details';

    async create() {
        this.api = this.endPoint;
        this.bodyDto = CreateActionDetailDto;

        return this.post();
    }

    async find() {
        this.api = `${this.endPoint}/find`;
        this.bodyDto = StringSearchDto;

        return this.post();
    }

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = ActionListFilterDto;

        return this.post();
    }
    async remove(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.delete();
    }
}
