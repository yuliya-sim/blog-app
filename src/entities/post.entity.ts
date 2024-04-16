import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BlogEntity } from './blog.entity';
import { CommentEntity } from './comment.entity';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {

  @Column()
  title: string;

  @Column()
  content: string;

  @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: ['remove'] })
  comments: CommentEntity[];

  @ManyToOne(() => BlogEntity, (blog) => blog.posts, { onDelete: 'CASCADE' })
  blog: BlogEntity;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  author: UserEntity;
}
