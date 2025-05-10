import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from 'src/common/dtos/order.dto';

@Controller('orders')
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Post()
    create(@Body() orderDto: OrderDto) {
        return this.ordersService.create(orderDto);
    }

}
