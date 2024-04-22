
import { define } from 'typeorm-seeding';
import { Faker } from 'faker';
import { BlogEntity } from '../../entities/blog.entity';

define(BlogEntity, (faker: typeof Faker) => {
    const blog = new BlogEntity();
    blog.title = faker.lorem.words(4);
    const sections = ['tech', 'travel', 'food', 'lifestyle', 'business'];
    blog.topic = faker.random.arrayElement(sections);
    blog.slug = faker.helpers.slugify(blog.title);
    blog.content = faker.lorem.sentence();
    blog.createdAt = faker.date.past();
    blog.updatedAt = faker.date.past();
    return blog;
});
