import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './songs/song.entity';
import { Artist } from './artists/artists.entity';
import { User } from './users/user.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { Playlist } from './playlists/playlists.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        SongsModule,
        PlaylistsModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '11111',
            database: 'test-app',
            entities: [Song, Artist, User, Playlist],
            synchronize: true,
            logging: true,
        }),
        AuthModule,
        UsersModule,
        ArtistsModule,
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
