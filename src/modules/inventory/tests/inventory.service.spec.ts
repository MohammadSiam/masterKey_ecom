import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from '../entities/inventory.entity';
import { InventoryService } from '../services/inventory.service';

const inventoryId = '1';
const mockInventory = {
  intInventoryId: 1,
  intProductId: 1,
  intQuantity: 10,
  dteCreatedAt: new Date('2024-05-22T11:43:31.000Z'),
  dteUpdatedAt: new Date('2024-05-22T11:43:31.000Z'),
};

const mocInventoryRepository = {
  save: jest.fn((dto) => {
    return {
      intInventoryId: expect.any(Number),
      ...dto,
    };
  }),
  findOneBy: jest.fn().mockImplementation(({ intInventoryId }) => {
    if (intInventoryId === mockInventory.intInventoryId) {
      return Promise.resolve(mockInventory);
    }
    return Promise.resolve(null);
  }),
  find: jest.fn().mockImplementation(() => {
    return mockInventory;
  }),
  update: jest.fn().mockImplementation((id, dto) => ({
    intInventoryId: id,
    ...dto,
  })),
};
describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mocInventoryRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created an inventory', async () => {
    const response = await service.create(mockInventory);

    expect(response).toEqual({
      intInventoryId: expect.any(Number),
      ...mockInventory,
    });

    expect(mocInventoryRepository.save).toHaveBeenCalledWith(mockInventory);
  });

  it('should be updated an inventory', async () => {
    const response = await service.update(+inventoryId, mockInventory);

    expect(response).toEqual({
      message: 'Inventory updated successfully',
    });

    expect(mocInventoryRepository.save).toHaveBeenCalledWith({
      ...mockInventory,
      dteUpdatedAt: expect.any(Date),
    });
  });
});
