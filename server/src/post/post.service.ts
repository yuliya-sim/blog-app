import { Repository } from 'typeorm';
import { PostEntity as Post, BlogEntity as Blog, UserEntity as User } from '../entities';
import { Injectable, Logger, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDto } from './dtos';
import { Role } from '../user/roles/role.enum';
import { AuthService } from '../auth/auth.service';
import { PostsBySlugResponse } from './post.interface';

@Injectable()
export class PostService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllPosts(): Promise<Post[]> {
        try {
            return await this.postRepository.find();
        } catch (error) {
            this.logger.error('Error fetching posts.', error);
            throw new Error();
        }
    }

    /**
     * Create a new post for a specific blog.
     *
     * @param {string} blogId - The ID of the blog to create the post for
     * @param {UpdatePostDto} createPostDto - The data for the new post
     * @return {Promise<Post>} The newly created post
     */
    async create(blogId: string, createPostDto: UpdatePostDto, userId: string) {
        try {
            const blog = await this.blogRepository.findOne({ where: { id: blogId }, relations: ['author'] });
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!blog) {
                return new NotFoundException('Blog not found');
            }

            if (blog.author.id !== userId || user.role !== Role.Admin) {
                return new MethodNotAllowedException(
                    "You cannot create a post for this blog or you don't have permission to create it",
                );
            }

            const newPost = this.postRepository.create({
                ...createPostDto,
                blog,
                author: { id: userId },
                lastChangedBy: userId,
            });

            await this.postRepository.save(newPost);

            return {
                post: {
                    title: newPost.title,
                    content: newPost.content,
                },
            };
        } catch (error) {
            this.logger.error('Error creating post.', error);
            throw new Error();
        }
    }

    async getPostsByBlogId(blogId: string): Promise<Post[]> {
        try {
            const blog = await this.blogRepository.findOne({ where: { id: blogId } });
            if (!blog) {
                throw new NotFoundException(`Blog with id ${blogId} not found`);
            }
            return this.postRepository.find({ where: { blog: { id: blogId } } });
        } catch (error) {
            this.logger.error(`Error retrieving posts for blog with id ${blogId}`, error);
            throw new Error();
        }
    }

    async getPostsBySlug(slugId: string): Promise<PostsBySlugResponse> {
        try {
            const blog = await this.blogRepository.findOne({
                where: { slug: slugId },
                relations: {
                    posts: {
                        comments: {
                            user: true,
                        },
                    },
                },
            });
            if (!blog) {
                throw new NotFoundException(`Blog with slug ${slugId} not found`);
            }

            const postsData = blog.posts.map((post) => ({
                ...post,
                createdAt: post.createdAt.toISOString(),
                comments: post.comments.map((comment) => ({
                    ...comment,
                    content: comment.content,
                    user: {
                        id: comment.user.id,
                        firstName: comment.user.firstName,
                        lastName: comment.user.lastName,
                    },
                })),
            }));

            return {
                title: blog.title,
                posts: postsData,
                blog_content: blog.content,
                blog_id: blog.id,
            };
        } catch (error) {
            this.logger.error(`Error retrieving posts for blog with slug ${slugId}`, error);
            throw new Error();
        }
    }

    async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Partial<UpdatePostDto>> {
        const { title, content } = updatePostDto;

        const fieldsToUpdate: Partial<Post> = {
            title,
            content,
            lastChangedBy: userId,
        };

        try {
            await this.postRepository.update(id, fieldsToUpdate);
            const post = await this.postRepository.findOne({
                where: { id },
            });

            return post;
        } catch (err) {
            this.logger.error('Error in update post', err);
            throw new Error();
        }
    }

    async remove(postId: string): Promise<string> {
        try {
            await this.postRepository.delete(postId);

            return 'Post deleted successfully';
        } catch (err) {
            this.logger.error('Error in remove post', err);
            throw new Error();
        }
    }

    async getPostDetails(postId: string): Promise<Post> {
        try {
            const post = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['comments'],
            });
            if (!post) {
                throw new NotFoundException('Post not found');
            }
            return post;
        } catch (error) {
            this.logger.error('Post not found', error);
            throw new Error();
        }
    }
}
