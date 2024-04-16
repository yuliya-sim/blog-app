import { Repository } from 'typeorm';
import { PostEntity as Post, BlogEntity as Blog, UserEntity as User } from '../entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDto } from './dtos';
import { MessageResponse } from '@messageResponse/messageResponse.dto';
import { Role } from '../user/roles/role.enum';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }
    /**
     * Create a new post for a specific blog.
     *
     * @param {string} blogId - The ID of the blog to create the post for
     * @param {UpdatePostDto} createPostDto - The data for the new post
     * @return {Promise<Post>} The newly created post
     */
    async create(blogId: string, createPostDto: UpdatePostDto, userId: string) {
        const blog = await this.blogRepository.findOne({ where: { id: blogId }, relations: ['author'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!blog) {
            return { message: 'Blog not found' };
        }

        if (blog.author.id !== userId || user.role !== Role.Admin) {
            return { message: "You cannot create a post for this blog or you don't have permission to create it" };
        }

        const newPost = this.postRepository.create({
            ...createPostDto,
            blog,
            author: { id: userId },
            lastChangedBy: userId,
        });

        try {
            await this.postRepository.save(newPost);

            return {
                message: 'Post was created',
                post: {
                    title: newPost.title,
                    content: newPost.content,
                },
            };
        } catch (error) {
            return { message: "Post wasn't created" };
        }
    }

    /**
     * Get all posts asynchronously.
     *
     * @return {Promise<Post[]>} all posts
     */
    async getAllPosts(): Promise<Post[]> {
        return this.postRepository.find();
    }

    /**
     * Retrieves an array of Post objects based on the provided blogId.
     *
     * @param {string} blogId - The ID of the blog to retrieve posts for.
     * @return {Promise<Post[]>} A Promise that resolves to an array of Post objects.
     */
    async getPostsByBlogId(blogId: string): Promise<Post[]> {
        const blog = await this.blogRepository.findOne({ where: { id: blogId } });
        if (!blog) {
            throw new NotFoundException(`Blog with id ${blogId} not found`);
        }
        return this.postRepository.find({ where: { blog: { id: blogId } } });
    }
    /**
     * Find the blog based on the slug
     *
     * @param {string} slugId - the unique identifier for the blog slug
     * @return {Promise<{ title: string, posts: Post[] }>} the title and posts of the blog
     */

    async getPostsBySlug(
        slugId: string,
    ): Promise<{ title: string; posts: any[]; blog_content: string; blog_id: string }> {
        // Find the blog based on the slug
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
            createDateTime: post.createDateTime.toISOString(), // Convert Date to ISO string
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
    }
    /**
     * Updates a post with the given ID using the provided data.
     *
     * @param {string} id - The ID of the post to update.
     * @param {UpdatePostDto} updatePostDto - The data to update the post with.
     * @return {Promise<MessageResponse<Partial<UpdatePostDto>>>} - A promise that resolves to a message response containing the updated post.
     * @throws {NotFoundException} - If the post with the given ID is not found.
     */
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
            throw new NotFoundException(`Post  wasn't updated`);
        }
    }

    /**
     * Asynchronously removes a post by its ID.
     *
     * @param {string} postId - The ID of the post to be removed
     * @return {Promise<string>} A message indicating the result of the removal operation
     */
    async remove(postId: string): Promise<string> {
        try {
            await this.postRepository.delete(postId);

            return 'Post deleted successfully';
        } catch (err) {
            throw new NotFoundException(`Post  wasn't deleted`);
        }
    }

    /**
     * Retrieves the details of a post with the given ID.
     *
     * @param {string} postId - The ID of the post to retrieve.
     * @return {Promise<Post>} The post object with the specified ID.
     */
    async getPostDetails(postId: string): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['comments'],
        });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }
}
