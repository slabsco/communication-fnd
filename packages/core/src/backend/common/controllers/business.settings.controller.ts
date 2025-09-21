import { SetBusinessSettingsDto } from '../dtos/business.settings.dto';
import { CommonController } from './common.controller';

export class BusinessSettingsController extends CommonController {
    protected endPoint = 'api/b/business-settings';

    async getData() {
        this.api = this.endPoint;
        return this.get();
    }

    async set() {
        this.api = this.endPoint;
        this.bodyDto = SetBusinessSettingsDto;

        return this.post();
    }
}
