import { IsString, IsDate, IsBoolean, IsNotEmpty } from 'class-validator';

export class BlogModel {
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsDate()
  publish_at?: Date;

  @IsBoolean()
  published: boolean = false;
}
