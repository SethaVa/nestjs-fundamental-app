import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ArtistsModule } from '../artists/artists.module';
import { ApiKeyStrategy } from './ApiKeyStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
    imports: [
        UsersModule,
        PassportModule,
        ArtistsModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('secret'),
                signOptions: {
                    expiresIn: '1d',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [AuthService],
})
export class AuthModule {}
