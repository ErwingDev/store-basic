import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto, UpdateClientDto } from 'src/common/dtos/client.dto';
import { Clients } from 'src/common/entities/client.entity';
import { CRUDMessages, CustomMessages } from 'src/common/enums/message.enum';
import { FindOptionsOrder, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { PaginateQueryDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginateService } from 'src/common/pagination/service/paginated-base.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientsService extends PaginateService<Clients> {

    folder = 'clients';

    constructor(
        @InjectRepository(Clients)
        private readonly clientRepository: Repository<Clients>,
        private readonly configService: ConfigService
    ) {
        super(clientRepository);
    }

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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findAll(paginateQueryDto: PaginateQueryDto) {
        try {
            const clients = await this.paginate(paginateQueryDto, {
                searchableColumns: ['name', 'surname', 'email'],
                defaultSort: { idclient: 'DESC' } as FindOptionsOrder<Clients>,
            });
            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.GetSuccess,
                data: clients
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findByEmail(email: string) {
        try {
            const client = await this.clientRepository.findOneBy({ email, status: true });
            if(!client) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`email: ${email}`),
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async findByRefreshToken(token: string) {
        try {
            const client = await this.clientRepository.findOneBy({ refresh_token: token });
            if(!client) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: CustomMessages.RegisterNotFound(`refresh_token: ${token}`),
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        try {
            if(!id) {
                return {
                    statusCode: HttpStatus.NOT_ACCEPTABLE,
                    message: 'Invalid'
                }
            }
            const updateRefreshToken = await this.clientRepository.update(id, { 
                refresh_token: refreshToken
            });

            return {
                statusCode: HttpStatus.OK,
                message: CRUDMessages.DeleteError,
                data: updateRefreshToken
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    async uploadImage(id: number, fileName: string) {
        await this.clientRepository.update(id, { image: fileName });
        const secureUrl = `${this.configService.get('HOST_UPLOAD')}/${this.folder}/${fileName}`;
        return secureUrl;
    }

}
