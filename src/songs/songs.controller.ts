import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Scope,
    UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { UpdateSongDto } from './dto/update-song.dto';
import { UpdateResult } from 'typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller({
    path: 'songs',
    scope: Scope.REQUEST,
})
export class SongsController {
    constructor(private songsService: SongsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createSongDto: CreateSongDto): Promise<Song> {
        return this.songsService.create(createSongDto);
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit: number = 10,
    ): Promise<Pagination<Song>> {
        try {
            limit = limit > 100 ? 100 : limit;
            return this.songsService.paginate({
                page,
                limit,
            });
        } catch (error) {
            throw new HttpException(
                'server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: error,
                },
            );
        }
    }

    @Get(':id')
    findOne(
        @Param(
            'id',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
            }),
        )
        id: number,
    ): Promise<Song> {
        return this.songsService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSongDto: UpdateSongDto,
    ): Promise<UpdateResult> {
        return this.songsService.update(id, updateSongDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.songsService.remove(id);
    }
}
