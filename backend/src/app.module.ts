import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [PrismaModule, ProductsModule, StripeModule],
})
export class AppModule {}
