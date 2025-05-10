import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from '../playlists/playlists.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @OneToMany(() => Playlist, (playlist) => playlist.user)
    playLists: Playlist[];
    @Column({ unique: true })
    email: string;
    @Column()
    @Exclude()
    password: string;
    @Column({ nullable: true, type: 'text' })
    twoFASecret: string;
    @Column({ default: false, type: 'boolean' })
    enable2FA: boolean;
    @Column()
    apiKey: string;
    @Column()
    phone: string;
}
