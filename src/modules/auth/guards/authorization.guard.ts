import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredRole = this.reflector.getAllAndOverride(ROLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    const userRole = request.user.role;

    if (requiredRole !== userRole) return false;

    return true;
  }
}
