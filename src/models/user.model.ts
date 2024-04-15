import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BlogEntity, PostEntity } from 'src/entities';
import { CommentEntity } from 'src/entities/comment.entity';


export class UserModel {
  readonly id: string;

  @IsEmail()
  @MinLength(4)
  @MaxLength(255)
  @ApiProperty({
    description: 'Email address of the user',
  })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })

  @ApiProperty({
    description:
      'Password of the user.Should be strong: 8 characters long, with at least 1 lowercase, 1 uppercase, 1 number and 0 symbols',
  })
  password: string;

  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsOptional()
  posts: PostEntity[];

  @IsOptional()
  blogs: BlogEntity[];

  @IsOptional()
  comments: CommentEntity[];
}
