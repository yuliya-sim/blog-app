import { Injectable } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import slugify from 'slugify';

@Injectable()
export class SlugProvider {
  constructor(@InjectConfig() private readonly config) { }


  slugify(slug: string): string {
    return slugify(slug, this.config.get('slugify'));
  }

  replacement(): string {
    return this.config.get('slugify.replacement');
  }
}
