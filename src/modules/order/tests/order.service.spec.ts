import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrderService } from '../services/order.service';

const mockOrder: CreateOrderDto = {
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
const mockIdError = 'error';
export const EXCLUDE_FIELDS = '-_id -__v';

class MockedOrderModel {
  constructor(private data: any) {}
  static create = jest.fn().mockReturnValue(mockOrder);
  static find = jest.fn().mockReturnThis();
  static findOneAndDelete = jest.fn().mockImplementation((id: string) => {
    if (id === mockIdError) throw new NotFoundException();
    return { exec: jest.fn().mockReturnValue(mockOrder) };
  });
  static exec = jest.fn().mockReturnValue(mockAllOrders);
  static select = jest.fn().mockReturnThis();
  static findOne = jest.fn().mockImplementation((id: string) => {
    if (id === mockIdError) throw new NotFoundException();
    return { exec: jest.fn().mockReturnValue(mockOrder) };
  });
}

describe('OrdersService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: MockedOrderModel,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new order', async () => {
    const expectedOutput = await service.create(mockOrder);
    expect(MockedOrderModel.create).toHaveBeenCalledTimes(1);
    expect(expectedOutput).toEqual(mockOrder);
  });

  it('should find all orders', async () => {
    const expectedOutput = await service.findAll();
    expect(MockedOrderModel.find).toHaveBeenCalledTimes(1);
    expect(MockedOrderModel.exec).toHaveBeenCalledTimes(1);
    expect(expectedOutput).toEqual(mockAllOrders);
  });

  describe('Get Order', () => {
    it('should find order by id', async () => {
      const expectedOutput = await service.findOne(+mockId);
      expect(MockedOrderModel.findOne).toHaveBeenCalledTimes(1);
      expect(expectedOutput).toEqual(mockOrder);
    });

    it('should throw NotFoundException', async () => {
      try {
        await service.findOne(+mockIdError);
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Not Found');
      }
    });
  });

  // Add tests for update and delete functionalities here.
});
