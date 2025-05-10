import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artists.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Artist])],
    providers: [ArtistsService],
    exports: [ArtistsService],
})
export class ArtistsModule {}
