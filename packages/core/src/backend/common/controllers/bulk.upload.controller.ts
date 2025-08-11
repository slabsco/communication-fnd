import { BaseModel } from '../../../Models/base.models';
import { BulkUploadListFilterDto } from '../../ap/business/dtos/bulk.upload.list.filter.dto';
import { DocumentFileUploadDto } from '../../ap/business/dtos/document.file.upload.dto';

export class BulkUploadController extends BaseModel {
    private endPoint = `api/b/bulk-upload`;

    async list() {
        this.api = `${this.endPoint}/search`;
        this.bodyDto = BulkUploadListFilterDto;
        return this.post();
    }

    async show(id: number) {
        this.api = `${this.endPoint}/${id}`;
        return this.get();
    }

    async getTypes(id: number) {
        this.api = `${this.endPoint}/${id}/get-types`;
        return this.get();
    }
    async getColumns({ id, typeId }: { id: number; typeId: number }) {
        this.api = `${this.endPoint}/${id}/get-columns/${typeId}`;
        return this.get();
    }

    async lastRecord(id: number) {
        this.api = `${this.endPoint}/${id}/last-record`;
        return this.get();
    }

    async getDefinitions(id: number) {
        this.api = `${this.endPoint}/${id}/definitions`;
        return this.get();
    }

    async getTemplate(typeId: number) {
        this.api = `${this.endPoint}/${typeId}/template`;
        return this.post();
    }

    async set(typeId: number) {
        this.api = `${this.endPoint}/${typeId}/upload`;
        this.bodyDto = DocumentFileUploadDto;
        return this.post();
    }
}
