import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { StringSearchDto } from '../../common/dtos/string.search.dto';
import { AddContactDto } from '../dto/add.contact.dto';
import { AddEnableBotModePayloadDto } from '../dto/change.contact.mode.dto';

export class ContactController extends BaseModel {
    protected endPoint = 'api/b/contact';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }

    async remove(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.delete();
    }

    async botMode(id: number) {
        this.api = `${this.endPoint}/${id}/enable-bot`;
        this.bodyDto = AddEnableBotModePayloadDto;

        return this.post();
    }

    async create() {
        this.api = `${this.endPoint}`;
        this.bodyDto = AddContactDto;

        return this.post();
    }

    async find() {
        this.api = `${this.endPoint}/find`;
        this.bodyDto = StringSearchDto;

        return this.post();
    }

    async findContactAttributes() {
        this.api = `${this.endPoint}/find-contact-attributes`;
        this.bodyDto = StringSearchDto;

        return this.post();
    }

    async findAttributes() {
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
}
