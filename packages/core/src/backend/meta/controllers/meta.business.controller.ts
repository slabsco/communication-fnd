import { BaseModel } from '../../../Models/base.models';
import { UserBusiness } from '../../../Models/Business/user.business';
import { user } from '../../../Models/User';
import { MetaBusinessDto } from '../dtos/meta.business.dto';

export class MetaBusinessController extends BaseModel {
    protected endPoint = 'api/business';

    async list() {
        this.api = this.endPoint;
        return this.get();
    }

    async onboarding() {
        this.api = this.endPoint;
        this.bodyDto = MetaBusinessDto;
        this.isMeta = true;
        return this.post();
    }

    async sendMetaCodeDetails() {
        this.api = `${this.endPoint}/set-access-token`;
        this.isMeta = false;

        this.bodyDto = MetaBusinessDto;
        return this.post();
    }

    async setBusinessWaId() {
        this.api = `${this.endPoint}/set-internal-id`;
        this.isMeta = false;

        this.bodyDto = MetaBusinessDto;
        return this.post();
    }

    async getProducts(id: number) {
        this.api = `${this.endPoint}/${id}/products`;
        this.isMeta = true;
        return this.get();
    }

    async validateProduct({
        businessId,
        productId,
    }: {
        businessId: number;
        productId: number;
    }) {
        this.api = `${this.endPoint}/${businessId}/product/${productId}`;
        this.isMeta = true;
        return this.get();
    }

    async setName() {
        const business = UserBusiness.getCurrentBusiness();

        this.bodyDto = MetaBusinessDto;
        const product_id = user.getProductId();

        this.body = { ...this.body, product_id };

        this.api = `${this.endPoint}/${business?.meta_server_id}/name`;

        this.isMeta = true;
        return this.post();
    }
}
