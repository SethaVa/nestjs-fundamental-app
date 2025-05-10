import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Request } from 'express';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(
        @Req()
        req: Request,
    ): any {
        return req.user;
    }
}
