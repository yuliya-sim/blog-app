import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectConfig, ConfigService } from 'nestjs-config';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { TokenEntity, UserEntity as User, UserEntity } from './../entities';
import { Pagination, PaginationOptionsInterface } from './../paginate';
import { UpdateUserDto } from './dto';
import { RegisterDto } from '../auth/dto/index';
import { MessageResponse } from '../../libs/shared/src/dtos/messageResponse.dto';

@Injectable()
export class UserService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    @InjectConfig() private readonly config: ConfigService,
  ) {
    this.saltRounds = config.get('app.salt_rounds', 10);
  }

  /**
   * Retrieves paginated users based on the provided pagination options.
   *
   * @param {PaginationOptionsInterface} paginationOptions - options for pagination
   * @return {Promise<Pagination<User>>} a promise that resolves to a pagination object containing users
   */
  async getPaginatedUsers(
    paginationOptions: PaginationOptionsInterface,
  ): Promise<Pagination<User>> {
    const limit = paginationOptions.limit || 10;
    const page = paginationOptions.page || 0;
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: page,
    });

    return new Pagination<User>({
      results: users,
      total,
    });
  }
  /**
   * Create a new user with the provided user data.
   *
   * @param {RegisterDto} userData - the user data to create the user with
   * @return {Promise<User>} the newly created user
   */
  async create(userData: RegisterDto): Promise<User> {
    const user = await this.userRepository.create({
      ...userData,
      password: await this.getHash(userData.password),
    });

    const createdUser = await this.userRepository.save(user);
    return createdUser;
  }

  /**
   * Update a user with the provided ID using the information in the updatedUser object.
   *
   * @param {string} id - The ID of the user to update
   * @param {UpdateUserDto} updatedUser - The updated user object containing new information
   * @return {Promise<UpdateResult>} A promise that resolves to the update result
   */
  async update(
    id: string,
    updatedUser: UpdateUserDto,
  ): Promise<MessageResponse<UpdateUserDto>> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User  not found`);
    }
    const { firstName, lastName, isActive, role } = updatedUser;

    const fieldsToUpdate: Partial<UserEntity> = {
      firstName,
      lastName,
      isActive,
      role,
    };
    try {
      await this.userRepository.update(id, fieldsToUpdate);
      const user = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'firstName', 'lastName', 'isActive', 'role'],
      });
      return {
        message: 'User updated successfully',
        user,
      };
    } catch (err) {
      throw new NotFoundException(`User  wasn't updated`);
    }
  }

  /**
   * Finds a user by their email.
   *
   * @param {string} email - The email of the user to find.
   * @return {Promise<User | null>} A promise that resolves to the user with the given email, or null if no user is found.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'firstName', 'lastName', 'isActive', 'role'],
    });
  }

  async findById(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async findUserByToken(id: string): Promise<UserEntity | null> {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { userId: id },
    });
    if (!tokenEntity) {
      throw new NotFoundException('Token not found');
    }
    return tokenEntity.user;
  }

  async getHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Finds a user by their credentials.
   *
   * @param {{ email: string; password: string; }} param0 - object containing email and password
   * @return {Promise<User | null>} the found user, or null if not found
   */
  async findByCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  /**
   * Deletes a user with the given userId.
   *
   * @param {string} userId - The ID of the user to be deleted.
   * @return {Promise<DeleteResult>} A promise that resolves to a DeleteResult object indicating the result of the deletion.
   */
  async remove(userId: string): Promise<string> {
    try {
      await this.userRepository.delete(userId);

      return 'User deleted successfully';
    } catch (err) {
      throw new NotFoundException(`User  wasn't deleted`);
    }
  }
}
