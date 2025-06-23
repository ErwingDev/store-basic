import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/common/dtos/category.dto';
import { Category } from 'src/common/entities/category.entity';
import { CRUDMessages, CustomMessages } from 'src/common/enums/message.enum';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginateService } from 'src/common/pagination/service/paginated-base.service';
import { FindOptionsOrder, Repository } from 'typeorm';

@Injectable()
export class CategoriesService extends PaginateService<Category> {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {
        super(categoryRepository);
    }

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            const category = await this.categoryRepository.save(createCategoryDto);
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.CreateSuccess,
                data: category
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findAll(isClient: boolean, paginateQueryDto: PaginateQueryDto) {
        try {  
            if(isClient) paginateQueryDto.equal = "status=true";
            
            const categories = await this.paginate(paginateQueryDto, {
                searchableColumns: ['name', 'description'],
                defaultSort: { name: 'ASC' } as FindOptionsOrder<Category>,
                // relations: ['products']
            });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: categories
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
            const category = await this.categoryRepository.findOneBy({ idcategory: id });
            if(!category) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idCategory: ${id}`),
                    data: null
                }
            }
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: category
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async update(id:number, updateCategoryDto: UpdateCategoryDto) {
        try {
            const category = await this.categoryRepository.findOneBy({ idcategory: id });
            if(!category) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idCategory: ${id}`),
                    data: null
                }
            }
            await this.categoryRepository.update(id, updateCategoryDto);
            const updateCategory = await this.categoryRepository.findOneBy({ idcategory: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateCategory
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
            const category = await this.categoryRepository.findOneBy({ idcategory: id });
            if(!category) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idCategory: ${id}`),
                    data: null
                }
            }
            const remove = await this.categoryRepository.delete(id);
            if(remove['affected']) {
                return {
                    statusCode: HttpStatus.OK,
                    message: CRUDMessages.DeleteSuccess,
                    data: category
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
