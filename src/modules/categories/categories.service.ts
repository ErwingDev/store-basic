import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/common/dtos/category.dto';
import { Category } from 'src/common/entities/category.entity';
import { CRUDMessages } from 'src/common/enums/message.enum';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

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
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async findAll() {
        const categories = await this.categoryRepository.find();
        return {
            statusCode: HttpStatus.OK,
            message: CRUDMessages.GetSuccess,
            data: categories,
            count: categories.length
        }
    }

    async findOne(id: number) {
        try {
            const category = await this.categoryRepository.findOneBy({ idcategory: id });
            if(!category) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CRUDMessages.GetNotfound,
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
                statusCode: HttpStatus.BAD_REQUEST,
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
                    message: CRUDMessages.GetNotfound,
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
                statusCode: HttpStatus.BAD_REQUEST,
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
                    message: CRUDMessages.GetNotfound,
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
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }
    
}
