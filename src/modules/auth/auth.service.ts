import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { ClientsService } from '../clients/clients.service';
import { UsersService } from '../users/users.service';
import { AlertMessages } from 'src/common/enums/message.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private clientsService: ClientsService,
        private usersService: UsersService
    ) {}

    async validateUser(username: string, pass: string) {
        const user = (await this.usersService.findByEmail(username)).data;
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return { ...result, role: user.role };
        }
        return null;
    }

    async validateClient(email: string, pass: string) {
        const client = (await this.clientsService.findByEmail(email)).data;
        if (client && client.password === pass) {
            const { password, ...result } = client;
            return { ...result, role: 'client' };
        }
        return null;
    }

    async loginUser(loginDto: LoginDto) {
        const data = await this.usersService.findByEmail(loginDto.email);
        const isPasswordValid = await bcrypt.compare(loginDto.password, data.data?.password);
        if(data.statusCode == HttpStatus.NOT_FOUND || !isPasswordValid) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: AlertMessages.InvalidCredentials
            }
        }
        const user = data.data;
        const payload = { 
            email : user?.email,
            sub: user?.iduser,
            role: user?.role
        }
        return {
            statusCode: HttpStatus.OK,
            message: AlertMessages.LoginSuccess,
            data: {
                token: this.jwtService.sign(payload),
                idclient: user?.iduser,
                email: user?.email,
                name: user?.name,
                surname: user?.surname,
            }
        };
    }

    async loginClient(loginDto: LoginDto) {
        const data = await this.clientsService.findByEmail(loginDto.email);
        const isPasswordValid = await bcrypt.compare(loginDto.password, data.data?.password);
        if(data.statusCode == HttpStatus.NOT_FOUND || !isPasswordValid) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: AlertMessages.InvalidCredentials
            }
        }
        const client = data.data;
        const payload = { 
            email : client?.email,
            sub: client?.idclient,
            role: 'client'
        }
        const refreshToken = this.generateRefreshToken(payload);

        // save refreshToken
        await this.clientsService.updateRefreshToken(client?.idclient || 0, refreshToken);
        return {
            statusCode: HttpStatus.OK,
            message: AlertMessages.LoginSuccess,
            data: {
                token: this.jwtService.sign(payload),
                refreshToken: refreshToken,
                idclient: client?.idclient,
                email: client?.email,
                name: client?.name,
                surname: client?.surname,
                image: client?.pathImage
            }
        };
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            // const decoded = this.jwtService.verify(refreshToken); 
            const clientData = await this.clientsService.findByRefreshToken(refreshToken)
            const client = clientData.data;
            if (!client) {
                return {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Refresh token inválido o expirado'
                }
            }

            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const newAccessToken = this.jwtService.sign(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '1d', secret: process.env.JWT_SECRET },
            );
            const newRefreshToken = this.jwtService.sign(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET }
            );
            await this.clientsService.updateRefreshToken(client.idclient, newRefreshToken);
            return {
                statusCode: HttpStatus.OK,
                message: AlertMessages.LoginSuccess,
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }
            };
        } catch (error) {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'RefreshInvalid or expired refresh token'
            }
        }
    }

    private generateRefreshToken(payload: any): string {
        return this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_REFRESH_SECRET, 
        });
    }

}
