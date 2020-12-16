import {
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WhitelistGuard } from 'src/auth/guards/jwt-whitelist.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { data: user };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, WhitelistGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.userService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException('User to delete not found');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, WhitelistGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return updatedUser;
  }
}
