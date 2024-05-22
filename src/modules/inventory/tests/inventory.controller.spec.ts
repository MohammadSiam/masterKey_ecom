import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from '../controller/inventory.controller';
import { InventoryService } from '../services/inventory.service';

const inventoryId = '1';
const mockInventory = {
  intProductId: 1,
  intQuantity: 10,
  dteCreatedAt: new Date('2024-05-22T11:43:31.000Z'),
  dteUpdatedAt: new Date('2024-05-22T11:43:31.000Z'),
};

const mockInventoryService = {
  create: jest.fn((dto) => {
    return {
      intInventoryId: expect.any(Number),
      ...dto,
    };
  }),
  update: jest.fn().mockImplementation((id, dto) => ({
    intInventoryId: id,
    ...dto,
  })),
};

describe('InventoryController', () => {
  let controller: InventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [InventoryService],
    })
      .overrideProvider(InventoryService)
      .useValue(mockInventoryService)
      .compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be created', async () => {
    const response = await controller.create(mockInventory);

    expect(response).toEqual({
      success: true,
      data: {
        intInventoryId: expect.any(Number),
        ...mockInventory,
      },
    });

    expect(mockInventoryService.create).toHaveBeenCalledWith(mockInventory);
  });

  it('should be updated an inventory', async () => {
    const response = await controller.update(inventoryId, mockInventory);

    expect(response).toEqual({
      success: true,
      data: {
        intInventoryId: expect.any(Number),
        ...mockInventory,
      },
    });
    expect(mockInventoryService.update).toHaveBeenCalled();
  });
});
