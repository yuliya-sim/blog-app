import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Delete,
  Param,
  NotFoundException,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../entities';
import { Pagination } from '@/utils/paginate/index';
import { UserService } from './user.service';

import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto';
import { RegisterDto } from '../auth/dto/index';
import { AuthService } from '../auth/auth.service';

@ApiTags('users')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('users')
export class UserController {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  @Get()
  //allows only admin to access this route who are authenticated
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get all users.This route requires JWT token and "admin" role',
  })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPaginatedUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ): Promise<Pagination<UserEntity>> {
    const paginationOptions = { limit, page };
    try {
      return await this.userService.getPaginatedUsers(paginationOptions);
    } catch (error) {
      this.logger.error('Failed to get users', error);
      throw new Error();
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async register(@Body() createUserDto: RegisterDto): Promise<string> {
    try {
      const existingUser = await this.userService.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
      const createdUser = await this.userService.create(createUserDto);
      return this.jwtService.sign({ id: createdUser.id });
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new Error();
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async showUserById(@Param('id', ParseUUIDPipe) userId: string): Promise<UserEntity> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      this.logger.error('Failed to get user', error);
      throw new Error();
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update a user by ID:firstName,lastName,isActive,role',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);
      return updatedUser;
    } catch (error) {
      this.logger.error('Error updating user', error);
      throw new Error(error);
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id') id: string): Promise<string> {
    return this.userService.remove(id);
  }

  @Get('email/:email')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async showUserByEmail(@Param('email') email: string): Promise<UserEntity> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      this.logger.error('Failed to get user', error);
      throw new Error();
    }
  }
}
