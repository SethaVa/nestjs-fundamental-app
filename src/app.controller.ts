import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    getProfile(
        @Req()
        req: Request,
    ): any {
        return req.user;
    }
}
