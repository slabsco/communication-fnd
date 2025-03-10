import { BaseModel } from '../../../Models/base.models';
import { ActionListFilterDto } from '../dto/action.list.filter.dto';
import { CreateActionDetailDto } from '../dto/create.action.detail.dto';

export class ActionDetailsController extends BaseModel {
    protected endPoint = 'api/b/action-details';

    async create() {
        this.api = this.endPoint;
        this.bodyDto = CreateActionDetailDto;

        return this.post();
    }

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = ActionListFilterDto;

        return this.post();
    }
}
