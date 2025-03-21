import { ChangePasswordDto } from '../../../Models/dto/change.password.dto';
import { CommonController } from '../../common/controllers/common.controller';
import {
    ChangeUserMobileDto,
    UserProfileDto,
} from '../../common/dtos/user.profile.dto';

export class UserProfileController extends CommonController {
    protected endPoint = 'api/b/user';

    async updateProfilePicture() {
        this.api = `${this.endPoint}/update-profile-picture`;
        this.bodyDto = UserProfileDto;

        return this.post();
    }

    async changePassword() {
        this.api = `${this.endPoint}/change-password`;
        this.bodyDto = ChangePasswordDto;

        return this.post();
    }

    async verifyMobile() {
        this.api = `${this.endPoint}/update-mobile`;
        this.bodyDto = ChangeUserMobileDto;

        return this.post();
    }

    async getUserBusiness() {
        this.api = `${this.endPoint}/user-business`;
        return this.get();
    }
}
