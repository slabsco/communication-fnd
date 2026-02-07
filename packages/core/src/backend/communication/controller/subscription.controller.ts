import { BaseModel } from '../../../Models/base.models';

export class SubscriptionController extends BaseModel {
    protected endPoint = 'api/b/subscription';

    async mySubscription() {
        this.api = this.endPoint;
        return this.get();
    }

    async renew(id: number) {
        this.api = `${this.endPoint}/${id}/renew`;

        return this.post();
    }
}
