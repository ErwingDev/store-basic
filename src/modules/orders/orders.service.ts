import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderDto } from 'src/common/dtos/order.dto';
import { Order } from 'src/common/entities/oder.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from 'src/common/entities/order-items.entity';
import { ClientsService } from '../clients/clients.service';
import { CRUDMessages } from 'src/common/enums/message.enum';
import { ProductsService } from '../products/products.service';
import { DateTime } from 'luxon';
import { OrderStatus } from 'src/common/enums/order.enum';
import { Clients } from 'src/common/entities/client.entity';
import { Products } from 'src/common/entities/product.entity';

@Injectable()
export class OrdersService {

    constructor(
        private readonly clientService: ClientsService,
        private readonly productsService: ProductsService,
        private readonly dataSource: DataSource,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItems)
        private readonly orderItemsRepository: Repository<OrderItems>,
    ) {}

    async create(orderDto: OrderDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {

            const client = await this.clientService.findOne(orderDto.idClient);
            if(client.statusCode != 200) return client;
            
            const order = this.orderRepository.create({
                client: <Clients>client.data,
                shippingAddress: orderDto.shippingAddress,
                status: OrderStatus.PENDING,
                createdAt: DateTime.now().setZone('America/La_Paz'),
                total: 0,
            });
            const savedOrder = await queryRunner.manager.save(Order, order);
            
            let total = 0;
            /* const items = [];
            for (const item of createOrderDto.items) {
                const processedItem = await processItem(item); // Función que maneja cada ítem
                items.push(processedItem);
                const product = await this.productsService.findOne(item.idProduct)
                if(product.statusCode != 200) return product; 
                console.log(product.data);
            } */
            // TODO: proceso en paralelo
            await Promise.all(
                orderDto.items.map(async (item) => {
                    const httpProduct = await this.productsService.findOne(item.idProduct);
                    if(httpProduct.statusCode != 200) return httpProduct;
                    const product = <Products>httpProduct.data;
                    const orderItem = this.orderItemsRepository.create({
                        order: savedOrder,
                        product,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice
                    });

                    total += item.quantity * product.price;
                    product.stock -= item.quantity;
                    await queryRunner.manager.save(Products, product);
                    return await queryRunner.manager.save(OrderItems, orderItem);
                }),
            );
            savedOrder.total = total;
            await queryRunner.manager.save(Order, savedOrder);

            // Commit de la transacción
            await queryRunner.commitTransaction();

            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.CreateSuccess,
                data: savedOrder
            }
        } catch (error) {
            // Rollback en caso de error
            await queryRunner.rollbackTransaction();
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        } finally {
            // Liberar el QueryRunner
            await queryRunner.release();
        }
    }

}
