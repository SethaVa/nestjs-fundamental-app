import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { Enable2FAType } from '../types/auth-types';
import { UpdateResult } from 'typeorm';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';
export interface RequestWithUser extends Request {
    user: {
        userId: number;
        email: string;
        password?: string;
        // Add more fields if your JWT payload contains them
    };
}
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}
    @Post('signup')
    signup(
        @Body()
        userDTO: CreateUserDTO,
    ): Promise<Partial<User>> {
        return this.userService.create(userDTO);
    }
    @Post('login')
    login(
        @Body()
        loginDTO: LoginDTO,
    ) {
        return this.authService.login(loginDTO);
    }
    @Post('enable-2fa')
    @UseGuards(JwtAuthGuard)
    enable2FA(
        @Req()
        req: RequestWithUser,
    ): Promise<Enable2FAType> {
        return this.authService.enable2FA(req.user.userId);
    }
    @Get('disable-2fa')
    @UseGuards(JwtAuthGuard)
    disable2FA(@Req() req: RequestWithUser): Promise<UpdateResult> {
        return this.authService.disable2FA(req.user.userId);
    }
    @Post('validate-2fa')
    @UseGuards(JwtAuthGuard)
    validate2FA(
        @Req() req: RequestWithUser,
        @Body() validateTokenDTO: ValidateTokenDTO,
    ): Promise<{ verified: boolean }> {
        return this.authService.validate2FAToken(
            req.user.userId,
            validateTokenDTO.token,
        );
    }
    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile(@Req() req: RequestWithUser) {
        delete req.user.password;
        return {
            msg: 'authenticated with api key',
            user: req.user,
        };
    }
    @Get('test')
    testEnv() {
        return this.authService.getEnvVariables();
    }
}
