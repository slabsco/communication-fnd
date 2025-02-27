import { UserBusiness } from '../../../Models/Business/user.business';
import { user } from '../../../Models/User';
import { InvitedUserCreationDto } from '../dtos/invited.user.creation.dto';
import { CommonController } from './common.controller';

export class InvitedUserController extends CommonController {
    protected endPoint = 'api/invited-user';
    protected isMeta = true;

    async list() {
        const businessId = await this.getServerBusinessId();
        this.api = `${this.endPoint}?business_id=${businessId}`;

        return this.get();
    }

    async create() {
        this.api = this.endPoint;

        this.bodyDto = InvitedUserCreationDto;

        const businessId = await this.getServerBusinessId();
        const product_id = user.getProductId();
        this.body = { ...this.body, business_id: businessId, product_id };

        return this.post();
    }

    async remove(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.delete();
    }

    async accept(id: number) {
        this.api = `${this.endPoint}/${id}/accept`;
        return this.post();
    }

    async reject(id: number) {
        this.api = `${this.endPoint}/${id}/reject`;
        return this.post();
    }

    /**
     * gets the meta server id against the given active business context
     * of the logged user
     * @private
     * @return {*}
     * @memberof InvitedUserController
     */
    private async getServerBusinessId() {
        const business = UserBusiness.getCurrentBusiness();

        return business?.meta_server_id;
    }
}
