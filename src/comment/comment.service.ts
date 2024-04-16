import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity, PostEntity } from '../entities';
import { CreateCommentDto } from './dtos';
import { MessageResponse } from '@messageResponse/messageResponse.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,
    ) { }

    /**
     * Finds a post by its ID and returns the post entity along with the ID of its associated blog.
     *
     * @param {string} postId - The ID of the post to find.
     * @return {Promise<{ post: PostEntity | null; blogId: string | null }>} - A promise that resolves to an object containing the post entity and the ID of its associated blog, or null if the post does not exist.
     */
    async findPostById(postId: string): Promise<{ post: PostEntity | null; blogId: string | null }> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['blog'],
        });
        if (!post) {
            return { post: null, blogId: null };
        }
        return { post, blogId: post.blog ? post.blog.id : null };
    }

    /**
     * Creates a new comment for a post.
     *
     * @param {string} postId - The ID of the post.
     * @param {CreateCommentDto} createCommentDto - The data for creating the comment.
     * @return {Promise<any>} - A promise that resolves to the saved comment.
     */
    async create(postId: string, createCommentDto: CreateCommentDto, userId: string): Promise<CommentEntity> {
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
    }

    /**
     * Removes a comment with the given commentId.
     *
     * @param {string} commentId - The ID of the comment to be removed.
     * @return {Promise<string>} A promise that resolves to a string indicating the success of the deletion.
     * @throws {NotFoundException} If the comment with the given ID is not found.
     */
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
            throw new NotFoundException(`Comment  wasn't deleted`);
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
            throw new NotFoundException(`Comment  wasn't updated`);
        }
    }
}
