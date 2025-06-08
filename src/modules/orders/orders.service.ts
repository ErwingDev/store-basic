import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderDto, UpdateOrderStatus } from 'src/common/dtos/order.dto';
import { Order } from 'src/common/entities/oder.entity';
import { DataSource, FindOptionsOrder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from 'src/common/entities/order-items.entity';
import { ClientsService } from '../clients/clients.service';
import { CRUDMessages, CustomMessages } from 'src/common/enums/message.enum';
import { ProductsService } from '../products/products.service';
import { DateTime } from 'luxon';
import { OrderStatus } from 'src/common/enums/order.enum';
import { Clients } from 'src/common/entities/client.entity';
import { Products } from 'src/common/entities/product.entity';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginateService } from 'src/common/pagination/service/paginated-base.service';

@Injectable()
export class OrdersService extends PaginateService<Order> {

    constructor(
        private readonly clientService: ClientsService,
        private readonly productsService: ProductsService,
        private readonly dataSource: DataSource,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItems)
        private readonly orderItemsRepository: Repository<OrderItems>,
    ) {
        super(orderRepository);
    }

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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        } finally {
            // Liberar el QueryRunner
            await queryRunner.release();
        }
    }

    async findAll(paginateQueryDto: PaginateQueryDto) {
        try {
            // const orders = await this.orderRepository.find({ relations: { items: { product: true }, client: true } });
            const orders = await this.paginate(paginateQueryDto, {
                searchableColumns: ['status', 'items.product.name'], //createdAt
                defaultSort: { createdAt: 'DESC' } as FindOptionsOrder<Order>,
                relations: ['items', 'client', 'items.product'],
            })
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: orders
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findOne(id: number) {
        try {
            const order = await this.orderRepository.findOne({
                where: { idorder: id },
                relations: { items: { product: true }, client: true }
            });
            if(!order) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idOder: ${id}`),
                    data: null
                }
            }
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: order
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async updateOrderStatus(id: number, updateOrderStatus: UpdateOrderStatus) {
        try {
            const order = await this.orderRepository.findOne({
                where: { idorder: id },
                relations: { items: { product: true }, client: true }
            });
            if(!order) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idOder: ${id}`),
                    data: null
                }
            }
            await this.orderRepository.update(id, updateOrderStatus);
            const updateOrder = await this.orderRepository.findOneBy({ idorder: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: updateOrder
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

}
