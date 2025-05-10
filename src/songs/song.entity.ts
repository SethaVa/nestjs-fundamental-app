import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from '../artists/artists.entity';
import { Playlist } from '../playlists/playlists.entity';

@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({ type: 'date' })
    releasedDate: Date;
    @Column({ type: 'time' })
    duration: Date;
    @Column({ type: 'text' })
    lyrics: string;
    @ManyToMany(() => Artist, (artist) => artist.songs)
    @JoinTable({ name: 'songs_artists' })
    artists: Artist[];
    @ManyToOne(() => Playlist, (playlist) => playlist.songs)
    playList: Playlist;
}
