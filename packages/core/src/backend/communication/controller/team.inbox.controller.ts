import { CommentDocumentController } from '../../common/controllers/comment.document.controller';
import { CommonListFilterDto } from '../../common/dtos/common.list.filter.dto';
import {
    AddAssigneePayloadDto,
    TeamInboxUpdateStatusDto,
} from '../dto/add.assignee.payload.dto';
import {
    SendTeamInboxMessagePayloadDto,
    SendTeamInboxSimpleMessagePayloadDto,
} from '../dto/send.team.inbox.message.payload.dto';
import { TeamInboxListFilterDto } from '../dto/teaminbox.list.filter.dto';

export class TeamInboxController extends CommentDocumentController {
    protected endPoint = 'api/b/team-inbox';

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = TeamInboxListFilterDto;

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

    async sendTypingIndicator(id: number) {
        this.api = `${this.endPoint}/${id}/send-typing-indicator`;
        return this.post();
    }

    async addAssignee(id: number) {
        this.api = `${this.endPoint}/${id}/add-assignee`;
        this.bodyDto = AddAssigneePayloadDto;

        return this.post();
    }
    async changeStatus(id: number) {
        this.api = `${this.endPoint}/${id}/update-status`;
        this.bodyDto = TeamInboxUpdateStatusDto;

        return this.post();
    }

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }
    async showMobile(id: number) {
        this.api = `${this.endPoint}/${id}/mobile`;
        return this.get();
    }

    async previewChat(id: number) {
        this.api = `${this.endPoint}/${id}/preview-chat`;
        this.bodyDto = CommonListFilterDto;

        return this.post();
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
    async triggerChatbot({
        id,
        chatbot_id,
    }: {
        id: number;
        chatbot_id: number;
    }) {
        this.api = `${this.endPoint}/${id}/trigger-chatbot/${chatbot_id}`;
        return this.post();
    }

    async getDocument(slug: string) {
        this.api = `${this.endPoint}/${slug}/get-document`;
        return this.get();
    }
}
