import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from 'src/common/entities/client.entity';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [
    TypeOrmModule.forFeature([
      Clients
    ])
  ],
  exports: [
    ClientsService
  ]
})
export class ClientsModule {}
