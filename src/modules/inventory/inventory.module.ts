import { Module } from '@nestjs/common';
import { InventoryController } from './controller/inventory.controller';
import { InventoryService } from './services/inventory.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
