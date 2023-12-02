import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest<AuthRequest>();

		if (!requiredRoles.some((role) => user.role?.includes(role))) {
			throw new ForbiddenException(
				'Você não tem permissão para acessar esse recurso',
			);
		} else {
			return true;
		}
	}
}
