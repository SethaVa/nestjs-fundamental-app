import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { validate } from '../.env.validation';
import { AppConfig, DatabaseConfig } from './config';
import { typeOrmAsyncConfig } from './config/typeorm.config';

@Module({
    imports: [
        SongsModule,
        PlaylistsModule,
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        AuthModule,
        UsersModule,
        ArtistsModule,
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [AppConfig, DatabaseConfig],
            // create 2 env files, .development.env and .production.env
            envFilePath: ['.env.development', '.env.production'],
            validate: validate,
        }),
        SeedModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: DevConfigService,
            useClass: DevConfigService,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(SongsController);
    }

    constructor(private dataSource: DataSource) {
        console.log(dataSource.driver.database);
    }
}
