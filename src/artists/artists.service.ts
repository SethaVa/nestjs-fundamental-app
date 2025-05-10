import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artists.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectRepository(Artist)
        private artistRepo: Repository<Artist>,
    ) {}
    async findArtis(userId: number): Promise<Artist> {
        const artist = await this.artistRepo.findOneBy({
            user: { id: userId },
        });
        if (!artist) {
            throw new NotFoundException(
                `Artist with user id ${userId} not found`,
            );
        }
        return artist;
    }
}
