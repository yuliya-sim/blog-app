import { define } from 'typeorm-seeding';
import { UserEntity as User } from '../../entities/user.entity';
import * as Faker from 'faker';
import * as bcrypt from 'bcrypt';

define(User, (faker: typeof Faker) => {
    const gender = faker.random.number(1);
    const roles = ['user', 'admin'];
    const user = new User();
    user.firstName = faker.name.firstName(gender);
    user.lastName = faker.name.lastName(gender);
    user.email = faker.internet.email();
    user.password = bcrypt.hashSync(faker.random.word(), 10);
    user.role = faker.random.arrayElement(roles);
    user.createdAt = new Date();
    return user;
});
