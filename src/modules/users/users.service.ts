import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/common/dtos/user.dto';
import { Users } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { CRUDMessages } from 'src/common/enums/message.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>
    ) {}

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
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async findAll() {
        const users = await this.userRepository.find();
        return {
            statusCode: HttpStatus.OK,
            message: CRUDMessages.GetSuccess,
            data: users,
            count: users.length
        }
    }

    async findOne(id: number) {
        try {
            const user = await this.userRepository.findOneBy({ iduser: id });
            if(!user) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CRUDMessages.GetNotfound,
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
                statusCode: HttpStatus.BAD_REQUEST,
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
                    message: CRUDMessages.GetNotfound,
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
                statusCode: HttpStatus.BAD_REQUEST,
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
                    message: CRUDMessages.GetNotfound,
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
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }
}
