import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUsers(email: string, password: string): Promise<any> {
    const user = await this.UsersService.findByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      const userData = await this.UsersService.create(dto);

      return { token: this.jwtService.sign({ id: userData.id }) };
    } catch (error) {
      console.log(error);

      throw new ForbiddenException('Ошибка регистрации');
    }
  }

  async login(user: UserEntity) {
    return { token: this.jwtService.sign({ id: user.id }) };
  }
}
