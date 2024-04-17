import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity, PostEntity } from '../entities';
import { CreateCommentDto } from './dtos';
import { MessageResponse } from '@messageResponse/messageResponse.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CommentService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
    ) { }

    async findPostById(postId: string): Promise<{ post: PostEntity | null; blogId: string | null }> {
        try {
            const post = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['blog'],
            });
            if (!post) {
                throw new NotFoundException('Post not found');
            }
            return { post, blogId: post.blog ? post.blog.id : null };
        } catch (err) {
            throw new UnprocessableEntityException();
        }
    }
    async create(postId: string, createCommentDto: CreateCommentDto, userId: string): Promise<CommentEntity> {
        try {
            const { post, blogId } = await this.findPostById(postId);
            if (!post) {
                throw new NotFoundException('Post not found');
            }

            const newComment = this.commentRepository.create({
                post: { id: post.id },
                blog: { id: blogId },
                user: { id: userId },
                content: createCommentDto.content,
            });
            const savedComment = await this.commentRepository.save(newComment);

            return savedComment;
        } catch (err) {
            this.logger.error(err);
            throw new BadRequestException();
        }
    }

    async remove(commentId: string): Promise<string> {
        try {
            const comment = await this.commentRepository.findOne({
                where: { id: commentId },
            });
            if (!comment) {
                throw new NotFoundException();
            }
            await this.commentRepository.delete(commentId);

            return 'Comment deleted successfully';
        } catch (err) {
            this.logger.error(err);
            throw new BadRequestException();
        }
    }

    async update(id: string, updateCommentDto: CreateCommentDto): Promise<MessageResponse<CreateCommentDto>> {
        try {
            const comment = await this.commentRepository.findOne({
                where: { id },
            });
            if (!comment) {
                throw new NotFoundException();
            }
            await this.commentRepository.update(id, updateCommentDto);

            return {
                message: 'Comment updated successfully',
                comment,
            };
        } catch (err) {
            this.logger.error(err);
            throw new BadRequestException();
        }
    }
}
