import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticationGuard } from './guards/authentication.guard';
import { Role } from './decorators/role.decorator';
import { Role as RoleType } from '@prisma/client';
import { AuthorizationGuard } from './guards/authorization.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiBearerAuth()
  @Role(RoleType.ADMIN)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
