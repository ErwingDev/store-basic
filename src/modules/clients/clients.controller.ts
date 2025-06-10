import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from 'src/common/dtos/client.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { UploadService } from 'src/common/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlertMessages } from 'src/common/enums/message.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Public } from '../auth/decorator/public.decorator';

@Controller('clients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ClientsController {

    constructor(
        private readonly clientsService: ClientsService
    ) {}

    private static getUploadOptions(fileUploadService: UploadService) {
        return fileUploadService.getMulterOptions('clients');
    }

    @Post()
    @Roles(Role.ADMINISTRATOR)
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @Get()
    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.clientsService.findAll(paginateQueryDto);
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.clientsService.findOne(id);
    }
    
    @Patch(':id')
    @Roles(Role.CLIENT)
    update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, updateClientDto);
    }
    
    @Patch('upload-image/:id')
    @Roles(Role.CLIENT)
    @UseInterceptors(FileInterceptor('image', 
        ClientsController.getUploadOptions(new UploadService())
    ))
    uploadImage(
        @Param('id') id: number, 
        @UploadedFile() image: Express.Multer.File
    ) {
        if(!image) {
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: AlertMessages.ImageNotFound,
            }, HttpStatus.BAD_REQUEST)
        }
        return this.clientsService.uploadImage(id, image.filename);
    }
    
    @Delete(':id')
    @Roles(Role.ADMINISTRATOR, Role.CLIENT)
    remove(@Param('id') id: number) {
        return this.clientsService.remove(id);
    }

}
