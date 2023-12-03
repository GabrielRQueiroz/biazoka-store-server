import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthRequest } from '../../auth/models';

export const CurrentUser = createParamDecorator<
	keyof UserEntity | undefined,
	ExecutionContext
>((data, context) => {
	const request = context.switchToHttp().getRequest<AuthRequest>();
	const user = request.user;

	if (data) return user[data];
	return user;
});

export type CurrentUser<Prop extends keyof UserEntity | undefined = undefined> =
	Prop extends keyof UserEntity ? UserEntity[Prop] : UserEntity;
