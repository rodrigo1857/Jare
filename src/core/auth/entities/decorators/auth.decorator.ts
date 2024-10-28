
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interface';
import { RoleProtected } from './role-protecte.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}