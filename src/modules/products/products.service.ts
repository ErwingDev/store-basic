import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto, UpdateStockProductDto } from 'src/common/dtos/product.dto';
import { Products } from 'src/common/entities/product.entity';
import { CRUDMessages } from 'src/common/enums/message.enum';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Category } from 'src/common/entities/category.entity';

@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Products)
        private readonly productRepository: Repository<Products>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const category = await this.categoryRepository.findOneBy({ idcategory: createProductDto.idCategory });
            if(!category) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: `No existe una categoria con el idcategory: '${createProductDto.idCategory}'`,
                    data: null
                }
            }
            const product = this.productRepository.create({
                ...createProductDto,
                createdAt: DateTime.now().setZone('America/La_Paz'),
                category
            })
            const productCreated = await this.productRepository.save(product);
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.CreateSuccess,
                data: productCreated
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async findAll() {
        const products = await this.productRepository.find({ relations: { category: true } });
        return {
            statusCode: HttpStatus.OK,
            message: CRUDMessages.GetSuccess,
            data: products,
            count: products.length
        }
    }

    async findOne(id: number) {
        try {
            const product = await this.productRepository.findOne({
                where: { idproduct: id },
                relations: { category: true }
            });
            if(!product) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CRUDMessages.GetNotfound,
                    data: null
                }
            }
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: product
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async update(id:number, updateClientDto: UpdateProductDto) {
        try {
            const product = await this.productRepository.findOneBy({ idproduct: id });
            if(!product) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CRUDMessages.GetNotfound,
                    data: null
                }
            }
            await this.productRepository.update(id, updateClientDto);
            const updateClient = await this.productRepository.findOneBy({ idproduct: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateClient
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async addStock(id:number, { stock }: UpdateStockProductDto) {
        try {
            const product = await this.productRepository.findOneBy({ idproduct: id });
            if(!product) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CRUDMessages.GetNotfound,
                    data: null
                }
            }
            await this.productRepository.increment({ idproduct: id }, 'stock', +stock)
            const updateClient = await this.productRepository.findOneBy({ idproduct: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateClient
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async subtractStock(id:number, { stock }: UpdateStockProductDto) {
        try {
            const product = await this.productRepository.findOneBy({ idproduct: id });
            if(!product) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CRUDMessages.GetNotfound,
                    data: null
                }
            }
            await this.productRepository.decrement({ idproduct: id }, 'stock', +stock)
            const updateClient = await this.productRepository.findOneBy({ idproduct: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateClient
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async remove(id: number) {
        try {
            const product = await this.productRepository.findOneBy({ idproduct: id });
            if(!product) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CRUDMessages.GetNotfound,
                    data: null
                }
            }
            const remove = await this.productRepository.delete(id);
            if(remove['affected']) {
                return {
                    statusCode: HttpStatus.OK,
                    message: CRUDMessages.DeleteSuccess,
                    data: product
                }
            } else {
                return {
                    statusCode: HttpStatus.OK,
                    message: CRUDMessages.DeleteError,
                    data: null
                }
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

}
