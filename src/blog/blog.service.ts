import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity as Blog, UserEntity as User } from './../entities';
import { Pagination, PaginationOptionsInterface } from '../utils/paginate';
import { SlugProvider } from './slug.provider';
import { CreateBlogDto, updateBlogDto } from './dtos';
import { Role } from '../user/roles/role.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class BlogService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly slugProvider: SlugProvider,
    ) { }

    async getPaginatedBlogs(paginationOptions: PaginationOptionsInterface): Promise<Pagination<Blog>> {
        try {
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
        } catch (error) {
            this.logger.error('Error in getPaginatedBlogs service', error);
            throw new Error();
        }
    }

    async create(dto: CreateBlogDto, userId: string): Promise<Blog> {
        try {
            const blog = await this.ensureUniqueSlug(dto);
            if (!blog) {
                throw new UnprocessableEntityException('Not unique');
            }

            return await this.blogRepository.save(this.blogRepository.create({ ...blog, author: { id: userId } }));
        } catch (error) {
            this.logger.error('Error in create service', error);
            throw new Error();
        }
    }

    async findBySlug(slug: string): Promise<Blog | null> {
        try {
            return await this.blogRepository.findOne({
                where: {
                    slug,
                },
            });
        } catch (error) {
            this.logger.error('Error in findBySlug service', error);
            throw new Error();
        }
    }

    async ensureUniqueSlug(blog: CreateBlogDto): Promise<Partial<Blog>> {
        try {
            const addSlug = await this.slugProvider.slugify(blog.title);

            const existingBlogs = await this.findSlugs(addSlug);

            const updatedDTO = {
                ...blog,
                slug: addSlug,
            };

            if (!existingBlogs.length) {
                return updatedDTO;
            }
        } catch (error) {
            this.logger.error('Error in ensureUniqueSlug service', error);
            throw new Error();
        }
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
        try {
            return await this.blogRepository
                .createQueryBuilder('blog')
                .where('slug like :slug', { slug: `${slug}%` })
                .getMany();
        } catch (error) {
            this.logger.error('Error in findSlugs service', error);
            throw new Error();
        }
    }

    async findById(id: string): Promise<Blog> {
        try {
            const blog = await this.blogRepository.findOne({ where: { id } });
            if (!blog) {
                throw new NotFoundException(`Blog with id ${id} not found`);
            }
            return blog;
        } catch (error) {
            this.logger.error('Error in findById service', error);
            throw new Error();
        }
    }

    async update(id: string, updatedBlog: updateBlogDto, userId: string): Promise<Partial<updateBlogDto>> {
        try {
            const { title, content } = updatedBlog;
            const slug = await this.slugProvider.slugify(title);
            const fieldsToUpdate: Partial<Blog> = {
                title,
                content,
                slug,
                lastChangedBy: userId,
            };

            await this.blogRepository.update(id, fieldsToUpdate);
            const blog = await this.blogRepository.findOne({
                where: { id },
                select: ['id', 'title', 'content'],
            });
            return blog;
        } catch (err) {
            this.logger.error('Error in update service', err);
            throw new Error();
        }
    }

    async remove(blogId: string, userId: string): Promise<string> {
        try {
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
            this.logger.error('Error in remove service', err);
            throw new Error();
        }
    }
}
