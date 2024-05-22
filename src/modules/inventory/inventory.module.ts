import { Module, forwardRef } from '@nestjs/common';
import { InventoryController } from './controller/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [TypeOrmModule]
})
export class InventoryModule { }
