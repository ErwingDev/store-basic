import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto, UpdateStockProductDto } from 'src/common/dtos/product.dto';
import { Products } from 'src/common/entities/product.entity';
import { CRUDMessages, CustomMessages } from 'src/common/enums/message.enum';
import { FindOptionsOrder, Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Category } from 'src/common/entities/category.entity';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginateService } from 'src/common/pagination/service/paginated-base.service';

@Injectable()
export class ProductsService extends PaginateService<Products> {

    constructor(
        @InjectRepository(Products)
        private readonly productRepository: Repository<Products>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {
        super(productRepository);
    }

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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findAll(paginateQueryDto: PaginateQueryDto) {
        try {
            // const products = await this.productRepository.find({ relations: { category: true } });
            const products = await this.paginate(paginateQueryDto, {
                searchableColumns: ['name', 'description'],
                defaultSort: { name: 'ASC' } as FindOptionsOrder<Products>,
                relations: ['category']
            });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: products
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
            const product = await this.productRepository.findOne({
                where: { idproduct: id },
                relations: { category: true }
            });
            if(!product) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idProduct: ${id}`),
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async update(id:number, updateProductDto: UpdateProductDto) {
        try {
            const product = await this.productRepository.findOneBy({ idproduct: id });
            if(!product) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idProduct: ${id}`),
                    data: null
                }
            }
            await this.productRepository.update(id, updateProductDto);
            const updateProduct = await this.productRepository.findOneBy({ idproduct: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateProduct
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
                    message: CustomMessages.RegisterNotFound(`idProduct: ${id}`),
                    data: null
                }
            }
            await this.productRepository.increment({ idproduct: id }, 'stock', +stock)
            const updateProduct = await this.productRepository.findOneBy({ idproduct: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateProduct
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
                    message: CustomMessages.RegisterNotFound(`idProduct: ${id}`),
                    data: null
                }
            }
            await this.productRepository.decrement({ idproduct: id }, 'stock', +stock)
            const updateProduct = await this.productRepository.findOneBy({ idproduct: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateProduct
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
                    message: CustomMessages.RegisterNotFound(`idProduct: ${id}`),
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

}
