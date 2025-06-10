import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/common/dtos/category.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Public } from '../auth/decorator/public.decorator';

@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CategoriesController { 

    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Post()
    @Roles(Role.ADMINISTRATOR)
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @Public()
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.categoriesService.findAll(paginateQueryDto);
    }
    
    @Get(':id')
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    findOne(@Param('id') id: number) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }
    
    @Delete(':id')
    @Roles(Role.ADMINISTRATOR)
    remove(@Param('id') id: number) {
        return this.categoriesService.remove(id);
    }

}
