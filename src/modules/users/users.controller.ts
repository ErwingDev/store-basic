import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from 'src/common/dtos/user.dto';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMINISTRATOR)
export class UsersController {

    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    create(@Body() createClientDto: CreateUserDto) {
        return this.usersService.create(createClientDto);
    }

    @Get()
    findAll(@Query() paginateQueryDto: PaginateQueryDto) {
        return this.usersService.findAll(paginateQueryDto);
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
