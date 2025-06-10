import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, UpdateStockProductDto } from 'src/common/dtos/product.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/common/upload/upload.service';
import { AlertMessages } from 'src/common/enums/message.enum';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController {

    constructor(
        private readonly productsService: ProductsService,
        private readonly uploadService: UploadService,
    ) {}

    private static getUploadOptions(fileUploadService: UploadService) {
        return fileUploadService.getMulterOptions('products');
    }

    @Post()
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    @UseInterceptors(FileInterceptor('image', 
        ProductsController.getUploadOptions(new UploadService())
    ))
    async create(@Body() createProductDto: CreateProductDto, @UploadedFile() image?: Express.Multer.File) {
        if (image) {
            // imageUrl = this.uploadService.getFileUrl('products', image.filename);
            createProductDto.image = image.filename;
        }
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
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    
    @Patch('add-stock/:id')
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    addStock(@Param('id') id: number, @Body() updateStockProductDto: UpdateStockProductDto) {
        return this.productsService.addStock(id, updateStockProductDto);
    }

    @Patch('upload-image/:id')
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    @UseInterceptors(FileInterceptor('image', 
        ProductsController.getUploadOptions(new UploadService())
    ))
    uploadImage(
        // @Res() res: Response,
        @Param('id') id: number, 
        @UploadedFile() image: Express.Multer.File
    ) {
        if(!image) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: AlertMessages.ImageNotFound,
            }, HttpStatus.BAD_REQUEST)
        }
        // return this.productsService.uploadImage(id, this.uploadService.getFileUrl('products', image.filename), image.filename);
        return this.productsService.uploadImage(id, image.filename);
        // console.log(path);
        // res.sendFile( path );
    }
    
    @Patch('subtract-stock/:id')
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    subtractStock(@Param('id') id: number, @Body() updateStockProductDto: UpdateStockProductDto) {
        return this.productsService.subtractStock(id, updateStockProductDto);
    }
    
    @Delete(':id')
    @Roles(Role.ADMINISTRATOR)
    remove(@Param('id') id: number) {
        return this.productsService.remove(id);
    }

}
