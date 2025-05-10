import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/common/entities/oder.entity';
import { OrderItems } from 'src/common/entities/order-items.entity';
import { ClientsModule } from '../clients/clients.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItems
    ]),
    ClientsModule,
    ProductsModule
  ]
})
export class OrdersModule {}
