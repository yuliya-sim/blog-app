import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity as Blog, UserEntity as User } from './../entities';
import { Pagination, PaginationOptionsInterface } from './../paginate';
import { SlugProvider } from './slug.provider';
import { CreateBlogDto, updateBlogDto } from './dtos';
import { MessageResponse } from '../../libs/shared/src/dtos/messageResponse.dto';
import { Role } from '../user/roles/role.enum';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly slugProvider: SlugProvider,
    ) { }

    /**
     * Retrieves a paginated list of blogs based on the provided pagination options.
     *
     * @param {PaginationOptionsInterface} paginationOptions - Options for pagination
     * @return {Promise<Pagination<Blog>>} A promise that resolves to a Pagination object containing the paginated blogs
     */
    async getPaginatedBlogs(paginationOptions: PaginationOptionsInterface): Promise<Pagination<Blog>> {
        const limit = paginationOptions.limit || 10;
        const page = paginationOptions.page || 0;

        const [blogs, total] = await this.blogRepository.findAndCount({
            take: limit,
            skip: page,
            relations: ['author'], // Assuming 'author' is the relationship field name in the BlogEntity
        });
        const blogsWithoutAuthor = blogs.map((blog) => {
            const { author, ...blogWithoutAuthor } = blog;
            return {
                ...blogWithoutAuthor,
                firstName: author?.firstName,
                lastName: author?.lastName,
            };
        });
        return new Pagination<any>({
            results: blogsWithoutAuthor,
            total,
        });
    }
    /**
     * Create a blog using the provided data.
     *
     * @param {CreateBlogDto} dto - the data for creating the blog
     * @return {Promise<Blog>} the created blog
     */
    async create(dto: CreateBlogDto, userId: string): Promise<Blog> {
        // Ensure the slug is unique
        const blog = await this.ensureUniqueSlug(dto);
        if (!blog) {
            throw new UnprocessableEntityException('Not unique');
        }

        // Save the blog to the database
        return await this.blogRepository.save(this.blogRepository.create({ ...blog, author: { id: userId } }));
    }

    /**
     * Finds a blog by its slug.
     *
     * @param {string} slug - The slug of the blog to find.
     * @return {Promise<Blog | null>} The found blog or null if not found.
     */
    async findBySlug(slug: string): Promise<Blog | null> {
        return await this.blogRepository.findOne({
            where: {
                slug,
            },
        });
    }

    /**
     * Ensure the uniqueness of the slug for a new blog.
     *
     * @param {CreateBlogDto} blog - the blog data to be used for creating the slug
     * @return {Promise<Partial<Blog>>} the updated blog with a unique slug, or null if a unique slug cannot be generated
     */
    async ensureUniqueSlug(blog: CreateBlogDto): Promise<Partial<Blog>> {
        const addSlug = await this.slugProvider.slugify(blog.title);

        const existingBlogs = await this.findSlugs(addSlug);

        const updatedDTO = {
            ...blog,
            slug: addSlug,
        };

        if (!existingBlogs.length) {
            return updatedDTO;
        }

        return null;
    }

    /**
     * Find slugs that match the provided slug.
     *
     * @param {string} slug - The slug to search for
     * @return {Promise<Blog[]>} A promise that resolves to an array of Blog objects
     * , it will search for Blog entities whose slugs start with 'example',
     * due to the wildcard % added after the provided slug. For example,
     * if there are slugs like 'example-blog', 'example-post', they would match this query.
     *  This function can be useful for scenarios where you need to find all blogs with slugs
     * having a certain prefix or pattern.
     */
    private async findSlugs(slug: string): Promise<Blog[]> {
        return await this.blogRepository
            .createQueryBuilder('blog')
            .where('slug like :slug', { slug: `${slug}%` })
            .getMany();
    }
    /**
     * Finds a blog by its ID.
     *
     * @param {string} id - The ID of the blog to find.
     * @return {Promise<Blog | null>} A promise that resolves to the found blog or null if not found.
     */
    async findById(id: string): Promise<Blog | null> {
        return await this.blogRepository.findOne({ where: { id } });
    }

    /**
     * Update a blog with the provided id and updated blog data.
     *
     * @param {string} id - The id of the blog to be updated
     * @param {updateBlogDto} updatedBlog - The updated blog data
     * @return {Promise<MessageResponse>} A message response indicating the success of the blog update
     */
    async update(id: string, updatedBlog: updateBlogDto, userId: string): Promise<any> {
        const { title, content } = updatedBlog;
        const slug = await this.slugProvider.slugify(title);
        const fieldsToUpdate: Partial<Blog> = {
            title,
            content,
            slug,
            lastChangedBy: userId,
        };

        try {
            await this.blogRepository.update(id, fieldsToUpdate);
            const blog = await this.blogRepository.findOne({
                where: { id },
                select: ['id', 'title', 'content'],
            });
            return {
                message: 'Blog updated successfully',
                blog,
            };
        } catch (err) {
            throw new NotFoundException(`Blog  wasn't updated`);
        }
    }

    /**
     * Asynchronously removes a blog by its ID.
     * Cascade deletes all associated posts and comments.
     * User can delete only their own blog or user with role 'admin'
     *
     * @param {string} blogId - The ID of the blog to be removed
     * @return {Promise<string>} A message indicating the result of the removal operation
     */
    async remove(blogId: string, userId: string): Promise<string> {
        try {
            // Fetch the blog entity along with its associated posts and comments
            const blog = await this.blogRepository.findOne({
                where: { id: blogId },
                relations: ['posts', 'posts.comments', 'author'],
            });
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (blog.author.id !== userId && user.role !== Role.Admin) {
                throw new NotFoundException(
                    `Blog with id ${blogId} not found or you don't have permission to delete it`,
                );
            }
            await this.blogRepository.delete(blogId);

            return 'Blog deleted successfully';
        } catch (err) {
            throw new NotFoundException(`Blog  wasn't deleted`);
        }
    }

    private async findBlogById(id: string): Promise<Blog | null> {
        {
            const blog = await this.blogRepository.findOne({ where: { id } });
            if (!blog) {
                throw new NotFoundException(`Blog  not found`);
            }
            return blog;
        }
    }
}
