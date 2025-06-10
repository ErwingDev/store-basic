import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from 'src/common/entities/client.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [
    TypeOrmModule.forFeature([
      Clients
    ]),
    ConfigModule
  ],
  exports: [
    ClientsService
  ]
})
export class ClientsModule {}
