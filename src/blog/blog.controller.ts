import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  NotFoundException,
  Body,
  UnprocessableEntityException,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogEntity } from './../entities';
import { Pagination } from './../paginate';
import { BlogService } from './blog.service';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBlogDto, updateBlogDto } from './dtos';
import { MessageResponse } from '@messageResponse/messageResponse.dto';
import { AuthGuard, JwtAuthGuard } from '../auth/guards';

@ApiTags('blogs')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({ status: 200, description: 'List of blogs' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPaginatedBlogs(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ): Promise<Pagination<BlogEntity>> {
    const paginationOptions = { limit, page };
    return await this.blogService.getPaginatedBlogs(paginationOptions);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create blog' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiResponse({
    status: 201,
    description: 'The blog has been successfully created',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() body: CreateBlogDto, @Request() req): Promise<any> {
    const exists = await this.blogService.findBySlug(body.title);

    if (exists) {
      throw new UnprocessableEntityException('Title already exists');
    }

    return await this.blogService.create(body, req.user.id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get blog by slug' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  async showBlogBySlug(@Param('slug') slug: string): Promise<BlogEntity> {
    const blog = await this.blogService.findBySlug(slug);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update blog' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Blog not updated' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlogDto: updateBlogDto,
    @Request() req,
  ): Promise<MessageResponse<updateBlogDto>> {
    const updatedBlog = await this.blogService.update(id, updateBlogDto, req.user.id);
    return updatedBlog;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete blog' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async remove(@Param('id') id: string, @Request() req): Promise<string> {
    return this.blogService.remove(id, req.user.id);
  }
}
