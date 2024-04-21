import { define } from 'typeorm-seeding';
import { UserEntity as User } from '../../src/entities';
import * as Faker from 'faker';

define(User, (faker: typeof Faker) => {
    const gender = faker.random.number(1);
    const user = new User();
    user.firstName = faker.name.firstName(gender);
    user.lastName = faker.name.lastName(gender);
    user.email = faker.internet.email();
    user.password = faker.random.word();
    return user;
});
