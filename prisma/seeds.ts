import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// create two dummy articles
	const admin = await prisma.user.upsert({
		where: { name: 'Biazoka Admin', email: 'foo@bar.com' },
		update: {},
		create: {
			name: 'Biazoka Admin',
			email: 'foo@bar.com',
			password: await hash('123456', 10),
			role: 'admin',
			createdAt: new Date(),
			updatedAt: new Date(),
			id: randomUUID(),
		},
	});
	const user = await prisma.user.upsert({
		where: { name: 'Biazoka User', email: 'bar@foo.com' },
		update: {},
		create: {
			name: 'Biazoka User',
			email: 'bar@foo.com',
			password: await hash('123456', 10),
			role: 'user',
			createdAt: new Date(),
			updatedAt: new Date(),
			id: randomUUID(),
		},
	});

	console.log({ admin, user });
}

// execute the main function
main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		// close Prisma Client at the end
		await prisma.$disconnect();
	});
