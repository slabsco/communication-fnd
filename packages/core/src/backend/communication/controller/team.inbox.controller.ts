import { BaseModel } from '../../../Models/base.models';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import { IdPayloadDto } from '../../common/dtos/id.payload.dto';
import { AddAssigneePayloadDto } from '../dto/add.assignee.payload.dto';
import {
    SendTeamInboxMessagePayloadDto,
    SendTeamInboxSimpleMessagePayloadDto,
} from '../dto/send.team.inbox.message.payload.dto';

export class TeamInboxController extends BaseModel {
    protected endPoint = 'api/b/team-inbox';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async messages(id: number) {
        this.api = `${this.endPoint}/${id}/messages`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
    }

    async markAsRead(id: number) {
        this.api = `${this.endPoint}/${id}/mark-as-read`;
        return this.post();
    }

    async addAssignee(id: number) {
        this.api = `${this.endPoint}/${id}/add-assignee`;
        this.bodyDto = AddAssigneePayloadDto;

        return this.post();
    }

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }

    async create() {
        this.api = `${this.endPoint}`;
        this.bodyDto = SendTeamInboxMessagePayloadDto;

        return this.post();
    }
    async sendMessage(id: number) {
        this.api = `${this.endPoint}/${id}/send-message`;
        this.bodyDto = SendTeamInboxSimpleMessagePayloadDto;

        return this.post();
    }

    async getDocument(slug: string) {
        this.api = `${this.endPoint}/${slug}/get-document`;
        return this.get();
    }
}
