import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/common/dtos/user.dto';
import { Users } from 'src/common/entities/user.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { CRUDMessages, CustomMessages } from 'src/common/enums/message.enum';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginateService } from 'src/common/pagination/service/paginated-base.service';

@Injectable()
export class UsersService extends PaginateService<Users> {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>
    ) {
        super(userRepository);
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const user = this.userRepository.create({
                ...createUserDto,
                password: bcrypt.hashSync(createUserDto.password, 10),
                createdAt: DateTime.now().setZone('America/La_Paz'),
            })
            const userCreated = await this.userRepository.save(user);
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.CreateSuccess,
                data: {
                    ...userCreated,
                    // token: this.getJwtToken({id: user.id})
                }
            }
            // const { password, ...rspta } = userCreated;
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findAll(paginateQueryDto: PaginateQueryDto) {
        try {
            const users = await this.paginate(paginateQueryDto, {
                searchableColumns: ['name', 'surname', 'email'],
                defaultSort: { name: 'ASC' }  as FindOptionsOrder<Users>
            })
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: users,
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findOne(id: number) {
        try {
            const user = await this.userRepository.findOneBy({ iduser: id });
            if(!user) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idUser: ${id}`),
                    data: null
                }
            }
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: user
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

     async findByEmail(email: string) {
        try {
            const user = await this.userRepository.findOneBy({ email });
            if(!user) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`email: ${email}`),
                    data: null
                }
            }
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: user
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async update(id:number, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.userRepository.findOneBy({ iduser: id });
            if(!user) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idUser: ${id}`),
                    data: null
                }
            }
            await this.userRepository.update(id, updateUserDto);
            const updateClient = await this.userRepository.findOneBy({ iduser: id });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.UpdateSuccess,
                data: updateClient
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async remove(id: number) {
        try {
            const user = await this.userRepository.findOneBy({ iduser: id });
            if(!user) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idUser: ${id}`),
                    data: null
                }
            }
            const remove = await this.userRepository.delete(id);
            if(remove['affected']) {
                return {
                    statusCode: HttpStatus.OK,
                    message: CRUDMessages.DeleteSuccess,
                    data: user
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }
}
