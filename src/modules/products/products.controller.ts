import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, UpdateStockProductDto } from 'src/common/dtos/product.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/common/upload/upload.service';

@Controller('products')
export class ProductsController {

    constructor(
        private readonly productsService: ProductsService,
        private readonly uploadService: UploadService,
    ) {}

    private static getUploadOptions(fileUploadService: UploadService) {
        return fileUploadService.getMulterOptions('products');
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', 
        ProductsController.getUploadOptions(new UploadService())
    ))
    async create(@Body() createProductDto: CreateProductDto, @UploadedFile() image?: Express.Multer.File,) {
        let imageUrl = '';
        if (image) {
            imageUrl = this.uploadService.getFileUrl('products', image.filename);
            createProductDto.image = imageUrl;
        }
        // return this.productsService.create(createProductDto);
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
