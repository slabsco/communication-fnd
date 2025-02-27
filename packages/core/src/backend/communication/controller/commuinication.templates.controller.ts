import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { IdsPayloadDto } from '../../common/dtos/ids.payload.dto';
import { StringSearchDto } from '../../common/dtos/string.search.dto';
import { WhatsappTemplateCreationDto } from '../dto/whatsapp.template.dto';

export class CommunicationTemplateController extends BaseModel {
    protected endPoint = 'api/b/communication-whatsapp-templates';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async getBusinessTemplates() {
        this.api = `${this.endPoint}/business-template`;
        return this.get();
    }

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;

        return this.get();
    }
    async create() {
        this.api = `${this.endPoint}`;
        this.bodyDto = WhatsappTemplateCreationDto;

        return this.post();
    }

    async importTemplates() {
        this.api = `${this.endPoint}/import-template`;
        this.bodyDto = IdsPayloadDto;

        return this.post();
    }

    async find() {
        this.api = `${this.endPoint}/find`;
        this.bodyDto = StringSearchDto;

        return this.post();
    }
}
