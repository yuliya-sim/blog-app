import { BaseEntity } from './base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity, CommentEntity, PostEntity } from './index';
import { Sections } from '../constants/sections';

@Entity({ name: 'blogs' })
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({
    unique: true,
  })
  slug: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  topic: Sections;

  @Column({})
  published: boolean = false;

  @Column({
    type: Date,
    nullable: true,
  })
  publish_at: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.blogs)
  author: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.blog, { cascade: ['remove'] })
  comments: CommentEntity[];

  @OneToMany(() => PostEntity, (post) => post.blog, { cascade: ['remove'] })
  posts: PostEntity[];
}
