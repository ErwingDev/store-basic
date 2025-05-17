import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/common/dtos/category.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('categories')
export class CategoriesController { 

    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.categoriesService.findAll(paginateQueryDto);
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.categoriesService.findOne(id);
    }
    
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.categoriesService.remove(id);
    }

}
