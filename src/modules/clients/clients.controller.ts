import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from 'src/common/dtos/client.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('clients')
export class ClientsController {

    constructor(
        private readonly clientsService: ClientsService
    ) {}

    @Post()
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @Get()
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.clientsService.findAll(paginateQueryDto);
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.clientsService.findOne(id);
    }
    
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, updateClientDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.clientsService.remove(id);
    }

}
