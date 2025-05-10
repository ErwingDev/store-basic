import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/common/entities/product.entity';
import { Category } from 'src/common/entities/category.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([
      Products,
      Category
    ]),
  ],
  exports: [
    ProductsService
  ]
})
export class ProductsModule {}
