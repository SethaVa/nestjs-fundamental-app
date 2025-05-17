import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { Playlist } from '../playlists/playlists.entity';
import { Artist } from '../artists/artists.entity';
import { Song } from '../songs/song.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('POSTGRESQL_PORT'),
            username: configService.get<string>('POSTGRESQL_USERNAME'),
            database: configService.get<string>('POSTGRESQL_DATABASE'),
            password: configService.get<string>('POSTGRESQL_PASSWORD'),
            entities: [User, Playlist, Artist, Song],
            synchronize: false,
            migrations: ['dist/db/migrations/*.js'],
        };
    },
};
