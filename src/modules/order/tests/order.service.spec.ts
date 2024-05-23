import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from '../services/order.service';
import { Order } from '../entities/order.entity';
import { BadRequestException } from '@nestjs/common';

const mockOrder = {
  strUniqueId: '6a8b4acf-22bd-42f7-80b1-3a54c3c0d54e',
  intProductId: 1,
  strCustomerName: 'John Doe',
  strCustomerPhone: '+1234567890',
  dteOrderDate: new Date('2024-05-21T12:00:00.000Z'),
  dteDeliveryDate: new Date('2024-05-28T12:00:00.000Z'),
  decDiscount: 10.5,
  decTotalAmount: 200.75,
  strRemarks: 'Handle with care',
  dteCreatedAt: new Date('2024-05-21T12:00:00.000Z'),
  dteUpdatedAt: new Date('2024-05-21T12:00:00.000Z'),
};

const mockOrderRepository = {
  save: jest.fn().mockResolvedValue({
    intOrderId: 1,
    ...mockOrder,
  }),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({ InventoryQuantity: 20 }),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
  }),
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const response = await service.create(mockOrder);

    expect(response).toEqual({
      intOrderId: 1,
      ...mockOrder,
    });

    expect(mockOrderRepository.save).toHaveBeenCalledWith({
      strUniqueId: expect.any(String),
      ...mockOrder,
    });

    expect(mockOrderRepository.createQueryBuilder).toHaveBeenCalled();
  });

  it('should throw BadRequestException if product not found in inventory', async () => {
    mockOrderRepository.createQueryBuilder = jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    });

    await expect(service.create(mockOrder)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if insufficient inventory quantity', async () => {
    mockOrderRepository.createQueryBuilder = jest.fn().mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ InventoryQuantity: 0 }),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    });

    await expect(service.create(mockOrder)).rejects.toThrow(BadRequestException);
  });
});
