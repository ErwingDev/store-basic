import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from 'src/common/dtos/user.dto';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    create(@Body() createClientDto: CreateUserDto) {
        return this.usersService.create(createClientDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }
    
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateClientDto: UpdateUserDto) {
        return this.usersService.update(id, updateClientDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }

}
