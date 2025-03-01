import { BaseModel } from '../../../Models/base.models';
import { WaUpdateDto } from '../dto/send.team.inbox.message.payload.dto';

export class BusinessController extends BaseModel {
    protected endPoint = 'api/b/business-detail';

    async show() {
        this.api = this.endPoint;
        return this.get();
    }
    async verifyNumber(id: string) {
        this.api = `${this.endPoint}/${id}/register-number`;
        return this.post();
    }
    async getWaHealth() {
        this.api = `${this.endPoint}/get-wa-health`;
        return this.get();
    }
    async getWaProfile() {
        this.api = `${this.endPoint}/whatsapp-business-detail`;
        return this.get();
    }
    async updateWaProfile() {
        this.api = `${this.endPoint}/update-wa-detail`;
        this.bodyDto = WaUpdateDto;
        return this.post();
    }
}
