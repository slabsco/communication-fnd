import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { BusinessUserInvitationDto } from '../dto/business.user.invitation.dto';

export class BusinessUserInvitationController extends BaseModel {
    protected endPoint = 'api/b/invite-user';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async resend(id: number) {
        this.api = `${this.endPoint}/${id}/re-invite`;
        return this.post();
    }
    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }

    async create() {
        this.api = `${this.endPoint}`;
        this.bodyDto = BusinessUserInvitationDto;

        return this.post();
    }

    async remove(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.delete();
    }
}
