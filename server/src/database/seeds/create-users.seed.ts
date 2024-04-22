import { UserEntity } from '../../entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';

export class UserCreateSeed implements Seeder {
    public async run(factory: Factory, connection: any): Promise<any> {
        const entityManager = connection.createEntityManager();
        await entityManager.query(
            `CREATE TABLE IF NOT EXISTS "users" ("id" SERIAL PRIMARY KEY, "create_date_time" TIMESTAMP, "last_changed_date_time" TIMESTAMP, "last_changed_by" VARCHAR, "internal_comment" VARCHAR, "email" VARCHAR, "password" VARCHAR, "first_name" VARCHAR, "last_name" VARCHAR, "role" VARCHAR)`,
        );
        await entityManager.insert('users', {
            email: 'admin@example.com',
            password: bcrypt.hashSync('Admin2024', 10),
            firstName: 'Admin',
            lastName: 'Example',
            createdAt: new Date(),
            role: 'admin',
        });
        for (let i = 0; i < 10; i++) {
            const user = await factory(UserEntity)().create();

            await entityManager.insert('users', {
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                role: user.role,
            });
        }
    }
}
