import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BlogEntity, PostEntity, UserEntity } from './index';
import { BaseEntity } from './base.entity';

@Entity({ name: 'comments' })
export class CommentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    content: string;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    user: UserEntity;

    @ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: 'CASCADE' })
    blog: BlogEntity;

    @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
    post: PostEntity;
}
