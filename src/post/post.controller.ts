import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Delete,
    UseGuards,
    Request,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PostEntity } from '../entities';
import { PostService } from './post.service';
import { UpdatePostDto } from './dtos';

import { JwtAuthGuard } from '../auth/guards';
import { AuthService } from '../auth/auth.service';
import { PostsBySlugResponse } from './post.interface';

@ApiTags('posts')
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('posts')
export class PostController {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly postService: PostService) { }

    @Get()
    @ApiOperation({
        summary: 'Get all posts.This route requires JWT token ',
    })
    @ApiResponse({ status: 200, description: 'List of posts' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiBearerAuth()
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async getAllPosts(): Promise<PostEntity[]> {
        return this.postService.getAllPosts();
    }

    @Get('blog/:blogId')
    @ApiOperation({
        summary: 'Get posts by blogId.This route requires JWT token ',
    })
    @ApiResponse({ status: 200, description: 'List of posts' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiBearerAuth()
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async getPostsByBlogId(@Param('blogId', ParseUUIDPipe) blogId: string): Promise<PostEntity[]> {
        return this.postService.getPostsByBlogId(blogId);
    }

    @Post(':blogId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create post' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiNotFoundResponse({ description: 'Blog not found' })
    async create(@Param('blogId', ParseUUIDPipe) blogId: string, @Body() createPostDto: UpdatePostDto, @Request() req) {
        return this.postService.create(blogId, createPostDto, req.user.id);
    }

    @Get(':postId')
    @ApiOperation({ summary: 'Get post details with comments' })
    @ApiNotFoundResponse({ description: 'Post not found' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Bad Request.' })
    async getPostDetails(@Param('postId', ParseUUIDPipe) postId: string): Promise<PostEntity> {
        return this.postService.getPostDetails(postId);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get all posts  by slug of blog' })
    @ApiNotFoundResponse({ description: 'Post not found' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Bad Request.' })
    async getPostsBySlug(@Param('slug') slug: string): Promise<PostsBySlugResponse> {
        return this.postService.getPostsBySlug(slug);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update post' })
    @ApiNotFoundResponse({ description: 'Post not found' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Bad Request.' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Request() req,
    ): Promise<Partial<UpdatePostDto>> {
        try {
            const updatedBlog = await this.postService.update(id, updatePostDto, req.user.id);
            return updatedBlog;
        } catch (error) {
            this.logger.error(' Error in update post', error);
            throw new Error();
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete post' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Bad Request.' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
        return this.postService.remove(id);
    }
}
