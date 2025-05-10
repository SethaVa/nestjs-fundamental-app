import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from '../artists/artists.entity';

@Injectable({
    scope: Scope.TRANSIENT,
})
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
    ) {}

    async create(songDTO: CreateSongDto): Promise<Song> {
        const song = new Song();
        song.title = songDTO.title;
        song.duration = songDTO.duration;
        song.releasedDate = songDTO.releasedDate;
        song.lyrics = songDTO.lyrics;
        song.artists = await this.artistRepository.findByIds(songDTO.artists);
        return this.songRepository.save(song);
    }
    findAll(): Promise<Song[]> {
        return this.songRepository.find();
    }
    async findOne(id: number): Promise<Song> {
        const song = await this.songRepository.findOneBy({ id: id });

        if (!song) {
            throw new NotFoundException(`Song with ID ${id} not found`);
        }
        return song;
    }
    async remove(id: number): Promise<void> {
        await this.songRepository.delete(id);
    }
    update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
        return this.songRepository.update(id, recordToUpdate);
    }
    async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        const queryBuilder = this.songRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releaseDate', 'DESC');
        return paginate<Song>(queryBuilder, options);
    }
}
