import { Factory, Seeder } from 'typeorm-seeding';
import { UserEntity as User } from '../../src/entities';
export class UserCreateSeed implements Seeder {
    public async run(factory: Factory): Promise<any> {
        await factory(User)().createMany(10);
    }
}
