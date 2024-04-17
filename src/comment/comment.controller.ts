import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Delete,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    UseGuards,
    Request,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { MessageResponse } from '@messageResponse/messageResponse.dto';
import { JwtAuthGuard } from '../auth/guards';
import { AuthService } from '../auth/auth.service';

@ApiTags('comments')
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('comment')
export class CommentController {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly commentService: CommentService) { }

    @Post(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create comment' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiResponse({
        status: 201,
        description: 'The comment has been successfully created',
    })
    async create(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() createCommentDto: CreateCommentDto,
        @Request() req,
    ): Promise<CreateCommentDto> {
        try {
            return await this.commentService.create(id, createCommentDto, req.user.id);
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException()
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete comment' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async remove(@Param('id') id: string): Promise<string> {
        return this.commentService.remove(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update comment' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    async update(
        @Param('id') id: string,
        @Body() updateCommentDto: CreateCommentDto,
    ): Promise<MessageResponse<CreateCommentDto>> {
        try {
            return await this.commentService.update(id, updateCommentDto);
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException();
        }
    }
}
