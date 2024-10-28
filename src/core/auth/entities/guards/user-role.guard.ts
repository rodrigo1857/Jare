import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators/role-protecte.decorator';
import { User } from '../user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {


  constructor(
    private readonly reflector: Reflector,
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('UserRoleGuard');
    const validRoles:string[] = this.reflector.get(META_ROLES,context.getHandler());
    console.log(validRoles)
   
    
    if(!validRoles) return true ; 
    if(validRoles.length ===0 ) return true

    const req = context.switchToHttp().getRequest();
    const user = req.user as User; 

    if(!user) 
      throw new BadRequestException ('User not found')
    console.log(user.roles)

      for(const role of user.roles){
        if(validRoles.includes(role))
          return true
      }

   throw new ForbiddenException(`User ${user.fullName} need a valid role [${validRoles}]`)
  }
}
