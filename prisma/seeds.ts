import { PrismaClient } from '@prisma/client';

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
			password: '123456',
			createdAt: new Date(),
			updatedAt: new Date(),
			id: '870n6XHGJ98jt70nhi870nasdyng8967',
		},
	});
	const user = await prisma.user.upsert({
		where: { name: 'Biazoka User', email: 'bar@foo.com' },
		update: {},
		create: {
			name: 'Biazoka User',
			email: 'bar@foo.com',
			password: '123456',
			createdAt: new Date(),
			updatedAt: new Date(),
			id: '870n6XHGJ98jt70nhi870nasdyng8968',
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
