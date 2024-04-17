import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BlogEntity, CommentEntity, PostEntity, TokenEntity } from '.';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 300, nullable: true, name: 'first_name' })
  firstName: string;

  @Column({ length: 300, nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ length: 300, nullable: true })
  role: string;

  @OneToMany(() => BlogEntity, (blog) => blog.author, { cascade: true })
  blogs: BlogEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, { cascade: true })
  comments: CommentEntity[];

  @OneToMany(() => PostEntity, (post) => post.author, { cascade: true })
  posts: PostEntity[];

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[];
}
