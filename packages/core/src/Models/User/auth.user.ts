import { IdPayloadDto } from '../../backend/common/dtos/id.payload.dto';
import { BaseModel } from '../base.models';
import { AuthBusinessToken } from '../dto/auth.business.token.dto';
import { ForgotPasswordPayloadDto } from '../dto/forgot.password.dto';
import { LoginDto } from '../dto/login.dto';
import { Login2faDto } from '../dto/login2fa.dto';
import { MobileOtpPayloadDto } from '../dto/mobile.otp.payload.dto';
import { RegisterUserDto } from '../dto/register.user.dto';
import { ResetPasswordPayloadDto } from '../dto/reset.password.dto';
import { SignupDto } from '../dto/signup.dto';
import { ValidateMobileOtpPayloadDto } from '../dto/validate.mobile.otp.payload.dto';
import { ValidateTokenBusiness } from '../dto/validate.token.business.dto';
import { VerifyEmailPayloadDto } from '../dto/verify.email.dto';

export class AuthUser extends BaseModel {
    protected isMeta = true;

    async login() {
        this.api = 'auth/login';
        this.bodyDto = LoginDto;
        return this.post();
    }

    async metaLogout() {
        this.api = 'auth/logout';
        this.isMeta = true;

        return this.post();
    }
    async logout() {
        this.api = 'auth/logout';
        this.isMeta = false;

        return this.post();
    }

    async login2fa() {
        this.api = 'auth/login-2fa';
        this.bodyDto = Login2faDto;
        return this.post();
    }

    async signup() {
        this.api = 'auth/signup';
        this.bodyDto = SignupDto;

        this.isMeta = false;
        return this.post();
    }

    async register() {
        this.api = 'auth/register';
        this.bodyDto = RegisterUserDto;
        return this.post();
    }

    async forgotPassword() {
        this.api = 'auth/send-reset-password';
        this.bodyDto = ForgotPasswordPayloadDto;
        return this.post();
    }

    async resetPassword() {
        this.api = 'auth/reset-password';
        this.bodyDto = ResetPasswordPayloadDto;
        return this.post();
    }

    async forgot2fa() {
        this.api = 'auth/send-reset-2fa';
        this.bodyDto = ForgotPasswordPayloadDto;
        return this.post();
    }

    async reset2fa() {
        this.api = 'auth/reset-2fa';
        this.bodyDto = RegisterUserDto;
        return this.post();
    }

    async resendEmail() {
        this.api = 'auth/send-verify-email';
        this.bodyDto = ForgotPasswordPayloadDto;
        return this.post();
    }

    async verifyEmail() {
        this.api = 'auth/verify-email';
        this.bodyDto = VerifyEmailPayloadDto;
        return this.post();
    }

    async authBusinessToken() {
        this.api = `auth/validate-token`;
        this.bodyDto = IdPayloadDto;
        return this.post();
    }

    async validateToken() {
        this.api = `auth/validate-token`;
        this.bodyDto = ValidateTokenBusiness;
        this.isMeta = false;
        return this.post();
    }

    async sendLoginMobileOtp() {
        this.api = `auth/login-mobile-otp`;
        this.bodyDto = MobileOtpPayloadDto;
        return this.post();
    }
    async validateLoginMobileOtp() {
        this.api = `auth/validate-mobile-otp`;
        this.bodyDto = ValidateMobileOtpPayloadDto;
        return this.post();
    }
}
