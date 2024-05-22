import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrderService } from '../services/order.service';

const mockOrder = {
  strUniqueId: '6a8b4acf-22bd-42f7-80b1-3a54c3c0d54e',
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

const mockAllOrders = [mockOrder];
const mockId = '123';

const mocOrderRepository = {
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(dto => Promise.resolve({
    intOrderId: expect.any(Number),
    ...dto,
  }))
}

describe('orderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mocOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created an order', async () => {
    const response = await service.create(mockOrder);

    expect(response).toEqual({
      intOrderId: expect.any(Number),
      ...mockOrder,
    });

    expect(mocOrderRepository.save).toHaveBeenCalledWith(mockOrder);
  })
});
