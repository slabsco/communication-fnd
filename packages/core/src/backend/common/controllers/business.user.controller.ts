import { user } from '../../../Models/User';
import { BusinessUserListFilterDto } from '../dtos/business.user.list.filter.dto';
import { StringSearchDto } from '../dtos/string.search.dto';
import { UserRoleAssignmentDto } from '../dtos/user.role.assignment.dto';
import { CommonController } from './common.controller';

export class BusinessUserController extends CommonController {
    protected endPoint = 'api/b/business-user';

    async searchMeta() {
        this.api = `${this.endPoint}/search-meta`;
        this.bodyDto = BusinessUserListFilterDto;
        // this.body = { ...this.body };
        return this.post();
    }
    async searchBilled() {
        this.api = `${this.endPoint}/search-billed`;
        return this.post();
    }
    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = BusinessUserListFilterDto;

        const product_id = user.getProductId();
        this.body = { ...this.body, product_id };

        return this.post();
    }

    async find() {
        this.api = `${this.endPoint}/find`;
        this.bodyDto = StringSearchDto;
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

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }

    async info(id: number) {
        this.api = `${this.endPoint}/${id}/info`;
        return this.get();
    }

    async reassignRole({ id, role_id }: { role_id: number; id: number }) {
        this.api = `${this.endPoint}/${id}/reassign-role/${role_id}`;
        return this.post();
    }

    async getUsers() {
        this.api = `${this.endPoint}`;
        return this.get();
    }

    async drop(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.delete();
    }

    async create() {
        this.api = this.endPoint;
        this.bodyDto = UserRoleAssignmentDto;

        const product_id = user.getProductId();
        this.body = { ...this.body, product_id };

        return this.post();
    }

    async remove(id: number) {
        this.api = `${this.endPoint}/${id}`;

        return this.delete();
    }
}
