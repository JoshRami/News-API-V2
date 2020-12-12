import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Error while creating user');
    }
  }
  async deleteUser(id: number): Promise<boolean> {
    try {
      const { affected } = await this.userRepository.delete(id);
      return affected === 1;
    } catch (error) {
      throw new InternalServerErrorException('Error while deleting user');
    }
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id);

      const updated = await this.userRepository.save({
        ...user,
        ...updateUserDto,
      });

      return updated;
    } catch (error) {
      throw new InternalServerErrorException('Error while updating user');
    }
  }
  async getUser(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found, id: ${id}`);
    }
    return user;
  }
  async findByCredentials(username: string, password: string) {
    try {
      const user = await this.userRepository.findOne({ username, password });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while fetching user by credentials',
      );
    }
  }
}
