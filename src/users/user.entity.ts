import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from '../playlists/playlists.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'Jane',
        description: 'Provide the firstname of the user',
    })
    @Column()
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Provide the lastname of the user',
    })
    @Column()
    lastName: string;

    @OneToMany(() => Playlist, (playlist) => playlist.user)
    playLists: Playlist[];

    @ApiProperty({
        example: 'jane_doe@gmail.com',
        description: 'Provide the email of the user',
    })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        example: 'test123#@',
        description: 'Provide the password of the user',
    })
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
