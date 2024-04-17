import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    Index,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'tokens' })
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        name: 'updated_at',
    })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.tokens)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({ type: 'timestamp', nullable: true })
    exp: Date;

    @Column({ nullable: true })
    @Index({ unique: true })
    token: string;

    @Column({ nullable: true, name: 'user_Agent' })
    userAgent: string;
}
