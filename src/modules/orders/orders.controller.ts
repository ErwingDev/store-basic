import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from 'src/common/dtos/order.dto';
import { UpdateOrderStatus } from '../../common/dtos/order.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('orders')
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Post()
    create(@Body() orderDto: OrderDto) {
        return this.ordersService.create(orderDto);
    }

    @Get()
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.ordersService.findAll(paginateQueryDto);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.ordersService.findOne(id);
    }

    @Patch('update-status/:id')
    updateOrderStatus(@Param('id') id: number, @Body() updateOrderStatus: UpdateOrderStatus) {
        return this.ordersService.updateOrderStatus(id, updateOrderStatus);
    }

}
