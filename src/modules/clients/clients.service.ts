import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto, UpdateClientDto } from 'src/common/dtos/client.dto';
import { Clients } from 'src/common/entities/client.entity';
import { CRUDMessages, CustomMessages } from 'src/common/enums/message.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';

@Injectable()
export class ClientsService {

    constructor(
        @InjectRepository(Clients)
        private readonly clientRepository: Repository<Clients>
    ) {}

    async create(createClientDto: CreateClientDto) {
        try {
            const client = this.clientRepository.create({
                ...createClientDto,
                password: bcrypt.hashSync(createClientDto.password, 10),
                createdAt: DateTime.now().setZone('America/La_Paz'),
            })
            const clientCreated = await this.clientRepository.save(client);
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.CreateSuccess,
                data: {
                    ...clientCreated,
                    // token: this.getJwtToken({id: user.id})
                }
            }
            // const { password, ...rspta } = clientCreated;
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async findAll() {
        const clients = await this.clientRepository.find();
        return {
            statusCode: HttpStatus.OK,
            message: CRUDMessages.GetSuccess,
            data: clients,
            count: clients.length
        }
    }

    async findOne(id: number) {
        try {
            const client = await this.clientRepository.findOneBy({ idclient: id });
            if(!client) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idClient: ${id}`),
                    data: null
                }
            }
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: client
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message
            }
        }
    }

    async update(id:number, updateClientDto: UpdateClientDto) {
        try {
            const client = await this.clientRepository.findOneBy({ idclient: id });
            if(!client) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idClient: ${id}`),
                    data: null
                }
            }
            await this.clientRepository.update(id, updateClientDto);
            const updateClient = await this.clientRepository.findOneBy({ idclient: id });
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
            const client = await this.clientRepository.findOneBy({ idclient: id });
            if(!client) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`idClient: ${id}`),
                    data: null
                }
            }
            const remove = await this.clientRepository.delete(id);
            if(remove['affected']) {
                return {
                    statusCode: HttpStatus.OK,
                    message: CRUDMessages.DeleteSuccess,
                    data: client
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
