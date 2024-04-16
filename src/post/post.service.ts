import { Repository } from 'typeorm';
import { PostEntity as Post, BlogEntity as Blog, UserEntity as User } from '../entities';
import { Injectable, Logger, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDto } from './dtos';
import { MessageResponse } from '@messageResponse/messageResponse.dto';
import { Role } from '../user/roles/role.enum';
import { AuthService } from '../auth/auth.service';

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
            this.logger.error('Error fetching posts:', error);
            throw error;
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
                this.logger.error('Blog not found');
                return new NotFoundException('Blog not found');
            }

            if (blog.author.id !== userId || user.role !== Role.Admin) {
                this.logger.error("You cannot create a post for this blog or you don't have permission to create it");
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
                message: 'Post was created',
                post: {
                    title: newPost.title,
                    content: newPost.content,
                },
            };
        } catch (error) {
            this.logger.error('Error creating post:', error);
            return { message: "Post wasn't created" };
        }
    }

    async getPostsByBlogId(blogId: string): Promise<Post[]> {
        try {
            const blog = await this.blogRepository.findOne({ where: { id: blogId } });
            if (!blog) {
                this.logger.error(`Blog with id ${blogId} not found`);
                throw new NotFoundException(`Blog with id ${blogId} not found`);
            }
            return this.postRepository.find({ where: { blog: { id: blogId } } });
        } catch (error) {
            this.logger.error(`Error retrieving posts for blog with id ${blogId}`);
            throw new NotFoundException(`Error retrieving posts for blog with id ${blogId}`);
        }
    }

    async getPostsBySlug(
        slugId: string,
    ): Promise<{ title: string; posts: any[]; blog_content: string; blog_id: string }> {
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
                this.logger.error(`Blog with slug ${slugId} not found`);
                throw new NotFoundException(`Blog with slug ${slugId} not found`);
            }

            const postsData = blog.posts.map((post) => ({
                ...post,
                createDateTime: post.createdAt.toISOString(),
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
            this.logger.error(`Error retrieving posts for blog with slug ${slugId}`);
            throw new NotFoundException(`Error retrieving posts for blog with slug ${slugId}`);
        }
    }

    async update(
        id: string,
        updatePostDto: UpdatePostDto,
        userId: string,
    ): Promise<MessageResponse<Partial<UpdatePostDto>>> {
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

            return {
                message: 'Post updated successfully',
                post,
            };
        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new NotFoundException(`Post  wasn't updated`);
        }
    }

    async remove(postId: string): Promise<string> {
        try {
            await this.postRepository.delete(postId);

            return 'Post deleted successfully';
        } catch (err) {
            this.logger.error(err.message, err.stack);
            throw new NotFoundException(`Post  wasn't deleted`);
        }
    }

    async getPostDetails(postId: string): Promise<Post> {
        try {
            const post = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['comments'],
            });
            if (!post) {
                this.logger.error('Post not found');
                throw new NotFoundException('Post not found');
            }
            return post;
        } catch (error) {
            this.logger.error('Post not found');
            throw new NotFoundException('Post not found');
        }
    }
}
