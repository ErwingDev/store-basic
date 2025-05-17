import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, UpdateStockProductDto } from 'src/common/dtos/product.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('products')
export class ProductsController {

    constructor(
        private readonly productsService: ProductsService
    ) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.productsService.findAll(paginateQueryDto);
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.productsService.findOne(id);
    }
    
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    
    @Patch('add-stock/:id')
    addStock(@Param('id') id: number, @Body() updateStockProductDto: UpdateStockProductDto) {
        return this.productsService.addStock(id, updateStockProductDto);
    }
    
    @Patch('subtract-stock/:id')
    subtractStock(@Param('id') id: number, @Body() updateStockProductDto: UpdateStockProductDto) {
        return this.productsService.subtractStock(id, updateStockProductDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.productsService.remove(id);
    }

}
