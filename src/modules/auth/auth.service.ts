import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (!user) throw new NotFoundException(`No user found for email ${email}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const payload = { userId: user.id, email: email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
