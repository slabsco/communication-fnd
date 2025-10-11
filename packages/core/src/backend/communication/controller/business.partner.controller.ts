import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { CreatePartnerBusinessDto } from '../dto/create.partner.business.dto';

export class BusinessPartnerController extends BaseModel {
    protected endPoint = 'api/b/parent-business';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async create() {
        this.api = this.endPoint;
        this.bodyDto = CreatePartnerBusinessDto;

        return this.post();
    }
}
