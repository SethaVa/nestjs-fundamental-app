import { Body, Controller, Post } from "@nestjs/common";
import { PlaylistsService } from "./playlists.service";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { Playlist } from "./playlists.entity";

@Controller("playlists")
export class PlaylistsController {
  constructor(private readonly playlistService: PlaylistsService) {}
  @Post()
  create(
    @Body()
    playlistDTO: CreatePlaylistDto,
  ): Promise<Playlist> {
    return this.playlistService.create(playlistDTO);
  }
}
