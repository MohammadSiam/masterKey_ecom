import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from '../controller/inventory.controller';
import { InventoryService } from '../services/inventory.service';

const mocInventory = {
  intProductId: 1,
  intQuantity: 10,
  intInventoryId: 3,
  dteCreatedAt: "2024-05-22T11:43:31.000Z",
  dteUpdatedAt: "2024-05-22T11:43:31.000Z"
}

describe('InventoryController', () => {
  let controller: InventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [InventoryService],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
