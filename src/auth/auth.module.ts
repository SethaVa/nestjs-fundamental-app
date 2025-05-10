import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './auth.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ArtistsModule } from '../artists/artists.module';
import { ApiKeyStrategy } from './ApiKeyStrategy';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
    imports: [
        UsersModule,
        PassportModule,
        ArtistsModule,
        JwtModule.register({
            secret: authConstants.secret,
            signOptions: {
                expiresIn: '1d',
            },
        }),
    ],
    exports: [AuthService],
})
export class AuthModule {}
