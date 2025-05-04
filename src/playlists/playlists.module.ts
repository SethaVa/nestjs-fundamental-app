import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Playlist } from "./playlists.entity";
import { Song } from "../songs/song.entity";
import { User } from "../users/user.entity";
import { PlaylistsController } from "./playlists.controller";
import { PlaylistsService } from "./playlists.service";
import { Artist } from "../artists/artists.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User, Artist])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
