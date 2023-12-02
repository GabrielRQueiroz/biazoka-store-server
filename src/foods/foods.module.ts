import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';

@Module({
	controllers: [FoodsController],
	providers: [FoodsService],
	imports: [PrismaModule],
})
export class FoodsModule {}
