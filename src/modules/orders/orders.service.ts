import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderDto } from 'src/common/dtos/order.dto';
import { Order } from 'src/common/entities/oder.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from 'src/common/entities/order-items.entity';
import { ClientsService } from '../clients/clients.service';
import { CRUDMessages } from 'src/common/enums/message.enum';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {

    constructor(
        private readonly clientService: ClientsService,
        private readonly productsService: ProductsService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItems)
        private readonly orderItemsRepository: Repository<OrderItems>,
    ) {}

    async create(orderDto: OrderDto) {
        try {
            const client = await this.clientService.findOne(orderDto.idClient);
            if(client.statusCode != 200) return client; 
            console.log(orderDto.items);
            //TODO: cmabiar mensajes en caso de not found
            /* for(const item in orderDto.items) {
                const product = await this.productsService.findOne(item.idProduct)
                // console.log(product);
            } */
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.CreateSuccess,
                data: client
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

}
