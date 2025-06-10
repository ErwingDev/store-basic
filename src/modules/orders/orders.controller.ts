import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from 'src/common/dtos/order.dto';
import { UpdateOrderStatus } from '../../common/dtos/order.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService
    ) {}

    @Post()
    @Roles(Role.CLIENT)
    create(@Body() orderDto: OrderDto) {
        return this.ordersService.create(orderDto);
    }
    
    @Get()
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    // @UsePipes(new QueryArrayPipe(paginateQueryDto))
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.ordersService.findAll(paginateQueryDto);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.ordersService.findOne(id);
    }

    @Patch('update-status/:id')
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    updateOrderStatus(@Param('id') id: number, @Body() updateOrderStatus: UpdateOrderStatus) {
        return this.ordersService.updateOrderStatus(id, updateOrderStatus);
    }

}
