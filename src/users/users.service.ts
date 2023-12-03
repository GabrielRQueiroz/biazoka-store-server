import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	findAll() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
			},
		});
	}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email: email },
		});
	}

	findById(id: string) {
		return this.prisma.user.findUnique({
			where: { id: id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});
	}

	update(id: string, updateUserDto: UpdateUserDto) {
		return this.prisma.user.update({
			where: { id: id },
			data: updateUserDto,
		});
	}

	remove(id: string) {
		return this.prisma.user.delete({
			where: { id: id },
		});
	}
}
